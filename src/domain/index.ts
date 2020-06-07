import { flow } from "fp-ts/lib/function";
import { range, map, chunksOf } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import {
  some,
  fromNullable,
  map as mapOption,
  flatten as flattenOption,
  none,
  getOrElse
} from "fp-ts/lib/Option";

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

/**
 * フィールドの各マス
 */
export type MineFieldCell = Readonly<{
  cell: CellIsMine | CellIsNotMine;
  state: CellState;
}>;

/**
 * 初期化時のフィールドの各マス
 */
export type InitFieldCell = {
  cell: CellHasNoMine;
  state: "unknown";
};

/**
 * 地雷セット時のフィールドの各マス
 */
export type MineSetsFieldCell = {
  cell: CellHasNoMine | CellIsMine;
  state: "unknown";
};

export type MineField = ReadonlyArray<ReadonlyArray<MineFieldCell>>;

export type GameState = "Game" | "GameOver" | "GameClear";

/**
 * 乱数生成
 */
const getRandInt = (max: number) => Math.floor(Math.random() * max);

/**
 * 初期化
 */
export const initialize = (row: number, col: number): InitFieldCell[][] =>
  pipe(
    range(1, row * col),
    map((): InitFieldCell => ({ cell: "has0", state: "unknown" })),
    chunksOf(col)
  );

/**
 * 地雷判定
 */
export const isMine = (cell: CellDisplayType) => cell === "mine";

/**
 * 行の地雷の数を数える
 */
const countMineRow = (cells: ReadonlyArray<MineFieldCell>) =>
  cells.reduce((sum, cell) => sum + (isMine(cell.cell) ? 1 : 0), 0);

/**
 * 地雷の数を数える
 */
const countMine = (field: MineField) =>
  field.reduce((sum, row) => sum + countMineRow(row), 0);

/**
 * 地雷を埋めたフィールドを返す関数を作る
 * @param except 地雷を埋めない場所
 * @param mine 地雷の数
 */
export const setMine = (except: [number, number][], mine: number) => (
  field: InitFieldCell[][]
): MineSetsFieldCell[][] => {
  const copyField: MineSetsFieldCell[][] = field;
  const size = copyField.length * copyField[0].length;
  const mineNum = mine === 0 ? 1 : mine >= size ? size - 1 : mine;
  let currentMine = 0;
  while (mineNum > currentMine) {
    const row = getRandInt(copyField.length);
    const col = getRandInt(copyField[0].length);
    if (except.find(([r, c]) => r === row && c === col)) continue;
    const cell = copyField[row][col];
    cell.cell = "mine";
    currentMine = countMine(copyField);
  }
  return copyField;
};

/**
 * 周囲の地雷情報をセットする
 * @param field 地雷が埋まったフィールド
 */
export const setHavingMine = (field: MineSetsFieldCell[][]): MineField =>
  field.map((row, rIndex) =>
    row.map(({ cell, state }, cIndex) =>
      cell === "mine"
        ? { cell, state }
        : ({
            cell: `has${getAroundCell(field, rIndex, cIndex).reduce(
              (sum, [r, c]) => sum + (field[r][c].cell === "mine" ? 1 : 0),
              0
            )}`,
            state
          } as MineFieldCell)
    )
  );

/**
 * ゲームの初期化
 * @param except 地雷を埋めない場所
 * @param mineNum 地雷の数
 */
export const initializerFactory = (
  except: [number, number][],
  mineNum: number
) => flow(initialize, setMine(except, mineNum), setHavingMine);

/**
 * 周囲に地雷があるか判定
 */
const doseCellHaveMine = (cell: MineFieldCell) =>
  cell.cell !== "has0" && cell.cell !== "mine";

/**
 * 対象マスが地雷かどうか判定
 */
const isMineCell = (cell: MineFieldCell) => isMine(cell.cell);

/**
 * 対象マスをオープンする
 */
const openTheCell = (f: MineField, row: number, col: number): MineField =>
  modifyAt(row, col, { cell: f[row][col].cell, state: "open" })(f);

/**
 * 全マスをオープンする
 */
const allOpen = (f: MineField): MineField =>
  f.map(r => r.map(c => ({ state: "open", cell: c.cell })));

/**
 * 地雷情報が得られるまでオープンする
 */
const openRecursive = (row: number, col: number) => (f: MineField): MineField =>
  getAroundCell(f, row, col).reduce((field, [r, c]): MineField => {
    if (field[r][c].state === "open") return field;
    return openCell(field, r, c);
  }, f);

/**
 * 対象マスをオープン
 */
export const openCell = (
  field: MineField,
  row: number,
  col: number
): MineField =>
  pipe(
    fromNullable(field),
    mapOption(f => f[row]),
    mapOption(r => r[col]),
    mapOption(c => {
      if (doseCellHaveMine(c)) return some(openTheCell(field, row, col));
      if (isMineCell(c)) return some(allOpen(field));
      if (c.cell === "has0")
        return pipe(
          openTheCell(field, row, col),
          openRecursive(row, col),
          some
        );
      return none;
    }),
    flattenOption,
    getOrElse(() => field)
  );

/**
 * ゲームの状態を取得
 */
export const toGameState = (field: MineField): GameState =>
  field.flat().reduce((state: GameState, cell) => {
    if (state === "GameOver") return state;
    if (cell.cell === "mine" && cell.state === "open") return "GameOver";
    if (cell.cell !== "mine" && cell.state !== "open") return "Game";
    return state;
  }, "GameClear");

/**
 * マスの状態を変更
 */
export const changeState = (field: MineField, row: number, col: number) =>
  pipe(
    fromNullable(field),
    mapOption(f => f[row]),
    mapOption(r => r[col]),
    mapOption(cell => {
      if (cell.state === "unknown")
        return pipe(
          field,
          modifyAt(row, col, { ...field[row][col], state: "flag" }),
          some
        );
      if (cell.state === "flag")
        return pipe(
          field,
          modifyAt(row, col, { ...field[row][col], state: "question" }),
          some
        );
      if (cell.state === "question")
        return pipe(
          field,
          modifyAt(row, col, { ...field[row][col], state: "unknown" }),
          some
        );
      return none;
    }),
    flattenOption,
    getOrElse(() => field)
  );

/**
 * 対象マスを更新した新しい状態を返す
 */
const modifyAt = (row: number, col: number, value: MineFieldCell) => (
  field: MineField
): MineField =>
  field.map((r, rIndex) =>
    r.map((cell, cIndex) =>
      rIndex === row && cIndex === col ? value : { ...cell }
    )
  );

/**
 * 期待値分 flag が立ってるマスの周囲をオープン
 */
export const openAround = (field: MineField, row: number, col: number) => {
  if (!field[row] || !field[row][col]) return field;
  if (field[row][col].state !== "open") return field;
  if (field[row][col].cell === "has0" || field[row][col].cell === "mine")
    return field;
  const coords = getAroundCell(field, row, col);
  const flags = coords.filter(
    coord => field[coord[0]][coord[1]].state === "flag"
  ).length;
  if (field[row][col].cell !== `has${flags}`) return field;
  return coords.reduce(
    (f, [r, c]) =>
      f[r][c].state === "flag" && f[r][c].cell === "mine"
        ? f
        : openCell(f, r, c),
    field
  );
};

/**
 * 対象マスの周囲のマス座標を取得
 */
export const getAroundCell = (field: MineField, row: number, col: number) =>
  [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1]
  ].filter(
    ([r, c]) => !(r < 0 || field.length <= r || c < 0 || field[0].length <= c)
  );
