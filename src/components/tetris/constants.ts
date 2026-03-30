export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export const TETROMINOES: Record<TetrominoType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

export const PIECE_COLORS: Record<TetrominoType, string> = {
  I: "#22d3ee", // cyan
  O: "#facc15", // yellow
  T: "#a855f7", // purple
  S: "#4ade80", // green
  Z: "#f87171", // red
  J: "#60a5fa", // blue
  L: "#fb923c", // orange
};

export const POINTS = [0, 100, 300, 500, 800];

export function levelSpeed(level: number): number {
  return Math.max(80, 800 - level * 70);
}

export const PIECE_TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
