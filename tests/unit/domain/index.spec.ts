import { initialize, setMine, setHavingMine, MineField } from "@/domain";
describe("domain", () => {
  describe("initialize", () => {
    test("入力で指定した次元の行列で、unknown, has0 で初期化される", () => {
      const d = initialize(10, 12);
      expect(d).toHaveLength(10);
      d.forEach(ele => expect(ele).toHaveLength(12));
      d.forEach(ele =>
        ele.forEach(x =>
          expect(x).toEqual({
            state: "unknown",
            cell: "has0"
          })
        )
      );
    });
  });
  describe("setMine", () => {
    test.each([
      [
        10,
        10,
        [
          [1, 1],
          [1, 2]
        ],
        5,
        5
      ],
      [10, 8, [], 100, 79],
      [10, 8, [], 80, 79],
      [6, 8, [], 0, 1],
      [10, 8, [], 0, 1]
    ])(
      "%s行 %s列 の配列に %o 以外のマスに %s 指定されたときは %s 個の地雷が埋まっている",
      (row, col, except, request, mineNum) => {
        const field = initialize(row, col);
        const d = setMine(field, except as [number, number][], request);
        expect(d).toHaveLength(row);
        d.forEach(ele => expect(ele).toHaveLength(col));
        const num = d.reduce(
          (sum, ele) =>
            sum + ele.reduce((s, x) => s + (x.cell === "mine" ? 1 : 0), 0),
          0
        );
        expect(num).toBe(mineNum);
        except.forEach(([row, col]) => {
          expect(field[row][col].cell).not.toBe("mine");
        });
      }
    );
  });
  describe("setHavingMine", () => {
    test("埋まっている地雷に応じて周囲の地雷情報が更新されている", () => {
      const _before = [
        ["mine", "has0", "mine", "has0", "has0"],
        ["has0", "has0", "has0", "has0", "has0"],
        ["mine", "mine", "mine", "mine", "mine"],
        ["has0", "mine", "has0", "mine", "has0"],
        ["mine", "mine", "mine", "mine", "has0"]
      ];
      const _answer = [
        ["mine", "has2", "mine", "has1", "has0"],
        ["has3", "has5", "has4", "has4", "has2"],
        ["mine", "mine", "mine", "mine", "mine"],
        ["has5", "mine", "has8", "mine", "has4"],
        ["mine", "mine", "mine", "mine", "has2"]
      ];
      const before = _before.map(i =>
        i.map(cell => ({ cell, state: "unknown" }))
      ) as MineField;
      const answer = _answer.map(i =>
        i.map(cell => ({ cell, state: "unknown" }))
      );
      expect(setHavingMine(before)).toEqual(answer);
    });
  });
});
