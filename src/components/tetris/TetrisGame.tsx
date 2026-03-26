"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTetris, type Cell, type Board, type Piece } from "./use-tetris";
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PIECE_COLORS,
  TETROMINOES,
  type TetrominoType,
} from "./constants";

// ─── Board cell ──────────────────────────────────────────────────────────────

function BoardCell({
  color,
  isGhost,
  isClearing,
}: {
  color: string | null;
  isGhost?: boolean;
  isClearing?: boolean;
}) {
  const base = "w-full h-full rounded-[2px] transition-colors duration-75";

  if (isClearing) {
    return <div className={`${base} bg-white`} />;
  }
  if (color) {
    return (
      <div
        className={base}
        style={{
          backgroundColor: isGhost ? `${color}33` : color,
          boxShadow: isGhost
            ? "none"
            : `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)`,
          border: isGhost ? `1px solid ${color}66` : "none",
        }}
      />
    );
  }
  return (
    <div
      className={base}
      style={{
        backgroundColor: "var(--background)",
        border: "1px solid var(--border)",
        opacity: 0.5,
      }}
    />
  );
}

// ─── Next piece preview ───────────────────────────────────────────────────────

function NextPreview({ type }: { type: TetrominoType | null }) {
  if (!type) return <div className="w-16 h-16" />;
  const shape = TETROMINOES[type];
  const color = PIECE_COLORS[type];
  const rows = shape.length;
  const cols = shape[0].length;

  return (
    <div
      className="inline-grid gap-[2px]"
      style={{
        gridTemplateColumns: `repeat(${cols}, 16px)`,
        gridTemplateRows: `repeat(${rows}, 16px)`,
      }}
    >
      {shape.flat().map((cell, i) => (
        <div
          key={i}
          className="rounded-[2px]"
          style={{
            backgroundColor: cell ? color : "transparent",
            boxShadow: cell
              ? `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)`
              : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main board renderer ─────────────────────────────────────────────────────

function renderBoard(
  board: Board,
  current: Piece | null,
  ghost: Piece | null,
  clearingRows: number[],
): (Cell | "ghost")[][] {
  // Deep copy
  const display: (Cell | "ghost")[][] = board.map(
    (row) => [...row] as (Cell | "ghost")[],
  );

  // Paint ghost
  if (ghost) {
    ghost.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const y = ghost.y + r;
        const x = ghost.x + c;
        if (
          y >= 0 &&
          y < BOARD_HEIGHT &&
          x >= 0 &&
          x < BOARD_WIDTH &&
          !display[y][x]
        ) {
          display[y][x] = "ghost";
        }
      });
    });
  }

  // Paint current piece
  if (current) {
    const color = PIECE_COLORS[current.type];
    current.shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const y = current.y + r;
        const x = current.x + c;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          display[y][x] = color;
        }
      });
    });
  }

  return display;
}

// ─── TetrisGame component ─────────────────────────────────────────────────────

export function TetrisGame() {
  const { state, start, togglePause, touchHandlers } = useTetris();
  const {
    board,
    current,
    ghost,
    next,
    score,
    level,
    lines,
    gameState,
    clearingRows,
  } = state;

  const display = renderBoard(board, current, ghost, clearingRows);

  // Cell size: 24px desktop, scales on small screens
  const cellSize = 24;
  const boardW = cellSize * BOARD_WIDTH;
  const boardH = cellSize * BOARD_HEIGHT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-4 select-none"
    >
      <div className="flex items-start gap-4">
        {/* Board */}
        <div
          className="relative rounded-lg overflow-hidden border border-[var(--border)]"
          style={{ width: boardW, height: boardH }}
          {...touchHandlers}
        >
          {/* Grid */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, ${cellSize}px)`,
              gap: "1px",
              padding: "1px",
              backgroundColor: "var(--border)",
            }}
          >
            {display.map((row, r) =>
              row.map((cell, c) => (
                <BoardCell
                  key={`${r}-${c}`}
                  color={
                    cell === "ghost"
                      ? current
                        ? PIECE_COLORS[current.type]
                        : null
                      : cell
                  }
                  isGhost={cell === "ghost"}
                  isClearing={clearingRows.includes(r)}
                />
              )),
            )}
          </div>

          {/* Overlay: idle */}
          <AnimatePresence>
            {gameState === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--background)]/90 backdrop-blur-sm"
              >
                <p className="text-[var(--muted)] text-xs font-mono tracking-widest uppercase">
                  Ready?
                </p>
                <button
                  onClick={start}
                  className="px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start Game
                </button>
                <p className="text-[var(--muted)] text-[10px] font-mono mt-1">
                  ← → move · ↑ rotate · ␣ drop · P pause
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay: paused */}
          <AnimatePresence>
            {gameState === "paused" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--background)]/90 backdrop-blur-sm"
              >
                <p className="text-[var(--foreground)] text-lg font-bold tracking-widest uppercase font-mono">
                  Paused
                </p>
                <button
                  onClick={togglePause}
                  className="px-5 py-2 rounded-full border border-[var(--border)] text-[var(--foreground)] text-sm hover:bg-[var(--border)] transition-colors"
                >
                  Resume
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay: game over */}
          <AnimatePresence>
            {gameState === "gameover" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--background)]/92 backdrop-blur-sm"
              >
                <p className="text-[var(--foreground)] text-lg font-bold tracking-widest uppercase font-mono">
                  Game Over
                </p>
                <p className="text-[var(--muted)] text-sm font-mono">
                  Score: <span className="text-[var(--accent)]">{score}</span>
                </p>
                <button
                  onClick={start}
                  className="px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 w-24">
          {/* Next piece */}
          <div className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-[var(--muted)] text-[10px] font-mono tracking-widest uppercase mb-2">
              Next
            </p>
            <div className="flex items-center justify-center h-10">
              <NextPreview type={next?.type ?? null} />
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-lg border border-[var(--border)] p-3 flex flex-col gap-3">
            <div>
              <p className="text-[var(--muted)] text-[10px] font-mono tracking-widest uppercase">
                Score
              </p>
              <p className="text-[var(--foreground)] text-sm font-mono font-bold tabular-nums">
                {score}
              </p>
            </div>
            <div>
              <p className="text-[var(--muted)] text-[10px] font-mono tracking-widest uppercase">
                Level
              </p>
              <p className="text-[var(--foreground)] text-sm font-mono font-bold tabular-nums">
                {level + 1}
              </p>
            </div>
            <div>
              <p className="text-[var(--muted)] text-[10px] font-mono tracking-widest uppercase">
                Lines
              </p>
              <p className="text-[var(--foreground)] text-sm font-mono font-bold tabular-nums">
                {lines}
              </p>
            </div>
          </div>

          {/* Controls hint */}
          {gameState === "playing" && (
            <button
              onClick={togglePause}
              className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] text-[10px] font-mono hover:bg-[var(--border)] transition-colors text-center"
            >
              P / Esc
              <br />
              Pause
            </button>
          )}
        </div>
      </div>

      {/* Mobile hint */}
      <p className="sm:hidden text-[var(--muted)] text-[10px] font-mono text-center">
        Tap to rotate · Swipe to move · Fast swipe down = drop
      </p>
    </motion.div>
  );
}
