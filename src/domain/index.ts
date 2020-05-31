export type CellDisplayType = CellState | CellType;
/**
 * ユーザから見た状態
 */
export type CellState = "unknown" | "flag" | "question" | "open";

/**
 * 地雷に関する型
 */
export type CellType = CellIsNotMine | CellIsMine;
/**
 * 地雷ではないマス
 */
export type CellIsNotMine = CellHasMine | CellHasNoMine;

/**
 * 地雷のマス
 */
export type CellIsMine = "mine";

/**
 * 周りに地雷があるマス
 */
export type CellHasMine =
  | "has1"
  | "has2"
  | "has3"
  | "has4"
  | "has4"
  | "has6"
  | "has7"
  | "has8";

/**
 * 周りに地雷がないマス
 */
export type CellHasNoMine = "has0";

export type MineFieldCell = {
  cell: CellIsMine | CellIsNotMine;
  state: CellState;
};

export type MineField = MineFieldCell[][];

export const isMine = (cell: CellDisplayType): cell is CellIsMine =>
  cell === "mine";

export const isNotOpen = (cell: CellDisplayType): cell is CellState =>
  cell === "unknown" || cell === "flag" || cell === "question" || isMine(cell);

export const isHavingMine = (cell: CellDisplayType): cell is CellHasMine =>
  !isNotOpen(cell) && cell !== "has0";

export const range = (num: number) => Array.from({ length: num }, (_, i) => i);

export const initialize = (row: number, col: number): MineField =>
  range(row).map(() =>
    range(col).map(() => ({
      cell: "has0",
      state: "unknown"
    }))
  );

const getRandInt = (max: number) => Math.floor(Math.random() * max);

const countMine = (field: MineField) =>
  field.reduce(
    (sum, ele) =>
      sum + ele.reduce((s, x) => s + (x.cell === "mine" ? 1 : 0), 0),
    0
  );

export const setMine = (
  field: MineField,
  except: [number, number][],
  mine: number
): MineField => {
  const size = field.length * field[0].length;
  const mineNum = mine === 0 ? 1 : mine >= size ? size - 1 : mine;
  let currentMine = 0;
  while (mineNum > currentMine) {
    const row = getRandInt(field.length);
    const col = getRandInt(field[0].length);
    const cell = field[row][col];
    cell.cell = "mine";
    currentMine = countMine(field);
  }
  return field;
};

export const setHavingMine = (field: MineField): MineField =>
  field.map((row, rIndex, f) =>
    row.map(({ cell, state }, cIndex, col) => {
      let count = 0;
      if (cell === "mine") return { cell, state };
      // before line
      if (rIndex > 0 && cIndex > 0)
        count += f[rIndex - 1][cIndex - 1].cell === "mine" ? 1 : 0;
      if (rIndex > 0) count += f[rIndex - 1][cIndex].cell === "mine" ? 1 : 0;
      if (rIndex > 0 && cIndex < col.length - 1)
        count += f[rIndex - 1][cIndex + 1].cell === "mine" ? 1 : 0;
      // current line
      if (cIndex > 0) count += f[rIndex][cIndex - 1].cell === "mine" ? 1 : 0;
      if (cIndex < col.length - 1)
        count += f[rIndex][cIndex + 1].cell === "mine" ? 1 : 0;
      // next line
      if (rIndex < field.length - 1 && cIndex > 0)
        count += f[rIndex + 1][cIndex - 1].cell === "mine" ? 1 : 0;
      if (rIndex < field.length - 1)
        count += f[rIndex + 1][cIndex].cell === "mine" ? 1 : 0;
      if (rIndex < field.length - 1 && cIndex < col.length - 1)
        count += f[rIndex + 1][cIndex + 1].cell === "mine" ? 1 : 0;
      return {
        cell: `has${count}`,
        state
      } as MineFieldCell;
    })
  );
