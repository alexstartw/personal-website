"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINOES,
  PIECE_COLORS,
  PIECE_TYPES,
  POINTS,
  levelSpeed,
  type TetrominoType,
} from "./constants";

export type Cell = string | null; // null = empty, string = color
export type Board = Cell[][];

export interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

export type GameState = "idle" | "playing" | "paused" | "gameover";

export interface TetrisState {
  board: Board;
  current: Piece | null;
  next: Piece | null;
  ghost: Piece | null;
  score: number;
  level: number;
  lines: number;
  gameState: GameState;
  clearingRows: number[];
}

// ─── Pure helpers ───────────────────────────────────────────────────────────

function emptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function rotateCW(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  return Array.from({ length: cols }, (_, c) =>
    Array.from({ length: rows }, (__, r) => shape[rows - 1 - r][c]),
  );
}

function isValid(board: Board, piece: Piece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const s = shape ?? piece.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT) return false;
      if (ny >= 0 && board[ny][nx]) return false;
    }
  }
  return true;
}

function placePiece(board: Board, piece: Piece): Board {
  const next = board.map((row) => [...row]);
  const color = PIECE_COLORS[piece.type];
  piece.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return;
      const y = piece.y + r;
      const x = piece.x + c;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        next[y][x] = color;
      }
    });
  });
  return next;
}

function clearLines(board: Board): { newBoard: Board; cleared: number; clearedRows: number[] } {
  const clearedRows: number[] = [];
  const remaining = board.filter((row, i) => {
    if (row.every((cell) => cell !== null)) {
      clearedRows.push(i);
      return false;
    }
    return true;
  });
  const cleared = clearedRows.length;
  const newBoard = [
    ...Array.from({ length: cleared }, () => Array<Cell>(BOARD_WIDTH).fill(null)),
    ...remaining,
  ];
  return { newBoard, cleared, clearedRows };
}

function calcGhost(board: Board, piece: Piece): Piece {
  let dy = 0;
  while (isValid(board, piece, 0, dy + 1)) dy++;
  return { ...piece, y: piece.y + dy };
}

// ─── Bag randomizer ──────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makePiece(type: TetrominoType): Piece {
  const shape = TETROMINOES[type];
  return {
    type,
    shape,
    x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
    y: type === "I" ? -1 : 0,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTetris() {
  // Mutable game state in ref (read inside intervals without stale closures)
  const stateRef = useRef<TetrisState>({
    board: emptyBoard(),
    current: null,
    next: null,
    ghost: null,
    score: 0,
    level: 0,
    lines: 0,
    gameState: "idle",
    clearingRows: [],
  });

  // Render trigger
  const [render, setRender] = useState(0);
  const tick = useCallback(() => setRender((n) => n + 1), []);

  const bagRef = useRef<TetrominoType[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function nextFromBag(): TetrominoType {
    if (bagRef.current.length === 0) bagRef.current = shuffle([...PIECE_TYPES]);
    return bagRef.current.shift()!;
  }

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(
    (level: number) => {
      stopInterval();
      intervalRef.current = setInterval(() => {
        const s = stateRef.current;
        if (s.gameState !== "playing" || !s.current) return;

        if (isValid(s.board, s.current, 0, 1)) {
          s.current = { ...s.current, y: s.current.y + 1 };
          s.ghost = calcGhost(s.board, s.current);
        } else {
          lockPiece();
        }
        tick();
      }, levelSpeed(level));
    },
    [stopInterval, tick],
  );

  function lockPiece() {
    const s = stateRef.current;
    if (!s.current) return;

    const newBoard = placePiece(s.board, s.current);
    const { newBoard: clearedBoard, cleared, clearedRows } = clearLines(newBoard);

    const newLines = s.lines + cleared;
    const newLevel = Math.floor(newLines / 10);
    const newScore = s.score + POINTS[cleared] * (newLevel + 1);

    // Spawn next piece
    const nextType = nextFromBag();
    const nextPiece = makePiece(nextType);

    // Check game over: new piece immediately collides
    const isGameOver = !isValid(clearedBoard, nextPiece);

    if (cleared > 0) {
      // Brief flash animation
      s.clearingRows = clearedRows;
      s.board = newBoard; // show with pieces still there for flash
      tick();

      clearTimeoutRef.current = setTimeout(() => {
        s.board = clearedBoard;
        s.clearingRows = [];
        s.lines = newLines;
        s.level = newLevel;
        s.score = newScore;

        if (isGameOver) {
          s.gameState = "gameover";
          s.current = null;
          s.next = null;
          s.ghost = null;
          stopInterval();
        } else {
          s.current = nextPiece;
          s.next = makePiece(nextFromBag());
          s.ghost = calcGhost(s.board, s.current);
          if (newLevel > s.level) startInterval(newLevel);
        }
        tick();
      }, 150);
    } else {
      s.board = clearedBoard;
      s.lines = newLines;
      s.level = newLevel;
      s.score = newScore;

      if (isGameOver) {
        s.gameState = "gameover";
        s.current = null;
        s.next = null;
        s.ghost = null;
        stopInterval();
      } else {
        s.current = nextPiece;
        s.next = makePiece(nextFromBag());
        s.ghost = calcGhost(s.board, s.current);
        if (newLevel > s.level) startInterval(newLevel);
      }
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  const start = useCallback(() => {
    const firstType = nextFromBag();
    const secondType = nextFromBag();
    const first = makePiece(firstType);
    const board = emptyBoard();

    stateRef.current = {
      board,
      current: first,
      next: makePiece(secondType),
      ghost: calcGhost(board, first),
      score: 0,
      level: 0,
      lines: 0,
      gameState: "playing",
      clearingRows: [],
    };
    tick();
    startInterval(0);
  }, [tick, startInterval]);

  const togglePause = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "playing") {
      s.gameState = "paused";
      stopInterval();
    } else if (s.gameState === "paused") {
      s.gameState = "playing";
      startInterval(s.level);
    }
    tick();
  }, [tick, stopInterval, startInterval]);

  const moveLeft = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing" || !s.current) return;
    if (isValid(s.board, s.current, -1, 0)) {
      s.current = { ...s.current, x: s.current.x - 1 };
      s.ghost = calcGhost(s.board, s.current);
      tick();
    }
  }, [tick]);

  const moveRight = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing" || !s.current) return;
    if (isValid(s.board, s.current, 1, 0)) {
      s.current = { ...s.current, x: s.current.x + 1 };
      s.ghost = calcGhost(s.board, s.current);
      tick();
    }
  }, [tick]);

  const moveDown = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing" || !s.current) return;
    if (isValid(s.board, s.current, 0, 1)) {
      s.current = { ...s.current, y: s.current.y + 1 };
      s.ghost = calcGhost(s.board, s.current);
      s.score += 1;
      tick();
    } else {
      lockPiece();
      tick();
    }
  }, [tick]);

  const rotate = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing" || !s.current) return;
    const rotated = rotateCW(s.current.shape);

    // Wall kick: try offsets 0, -1, +1, -2, +2
    for (const dx of [0, -1, 1, -2, 2]) {
      if (isValid(s.board, s.current, dx, 0, rotated)) {
        s.current = { ...s.current, shape: rotated, x: s.current.x + dx };
        s.ghost = calcGhost(s.board, s.current);
        tick();
        return;
      }
    }
  }, [tick]);

  const hardDrop = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== "playing" || !s.current || !s.ghost) return;
    const dropped = s.ghost.y - s.current.y;
    s.current = { ...s.current, y: s.ghost.y };
    s.score += dropped * 2;
    lockPiece();
    tick();
  }, [tick]);

  // ── Keyboard ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.gameState === "idle") {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); }
        return;
      }
      if (s.gameState === "gameover") {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); }
        return;
      }
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        togglePause();
        return;
      }
      if (s.gameState !== "playing") return;

      switch (e.key) {
        case "ArrowLeft":  e.preventDefault(); moveLeft();   break;
        case "ArrowRight": e.preventDefault(); moveRight();  break;
        case "ArrowDown":  e.preventDefault(); moveDown();   break;
        case "ArrowUp":    e.preventDefault(); rotate();     break;
        case " ":          e.preventDefault(); hardDrop();   break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [start, togglePause, moveLeft, moveRight, moveDown, rotate, hardDrop]);

  // ── Touch ────────────────────────────────────────────────────────────────

  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.t;
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);

      const s = stateRef.current;
      if (s.gameState === "idle" || s.gameState === "gameover") {
        start();
        touchStart.current = null;
        return;
      }

      if (adx < 10 && ady < 10 && dt < 250) {
        rotate();
      } else if (adx > ady && adx > 20) {
        dx > 0 ? moveRight() : moveLeft();
      } else if (ady > adx && dy > 20) {
        dt < 200 ? hardDrop() : moveDown();
      }
      touchStart.current = null;
    },
    [start, rotate, moveLeft, moveRight, moveDown, hardDrop],
  );

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      stopInterval();
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    };
  }, [stopInterval]);

  return {
    state: stateRef.current,
    start,
    togglePause,
    touchHandlers: { onTouchStart, onTouchEnd },
  };
}
