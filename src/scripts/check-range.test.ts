import { checkRange } from "./check-range";
import { Character, GameField, Range } from "./types/types";

const setUpCharactersAndGameField = (
  attackerRange: Range = [1, 1],
  attackerPos: number = 0,
  defenderPos: number = 1
) => {
  const attacker: Character = {
    move: 0,
    card: {
      attributes: {
        range: attackerRange,
        speed: 1,
        power: 1,
        armor: 1,
        guard: 1,
      },
      triggers: {},
    },
    gauge: 0,
    player: "attacker",
    results: "",
  };

  const defender: Character = {
    move: 0,
    card: {
      attributes: {
        range: [1, 1],
        speed: 1,
        power: 1,
        armor: 1,
        guard: 1,
      },
      triggers: {},
    },
    gauge: 0,
    player: "defender",
    results: "",
  };

  //@ts-ignore
  const gameField: GameField = ["", "", "", "", "", "", "", "", ""].map(
    (_, index) => {
      if (index === attackerPos) return "attacker";
      if (index === defenderPos) return "defender";
      return "";
    }
  );

  return {
    attacker,
    defender,
    gameField,
  };
};

describe("checkRange", () => {
  test("should return true when opponent is in range", () => {
    const { attacker, defender, gameField } = setUpCharactersAndGameField();
    expect(checkRange(attacker, defender, gameField)).toBe(true);
  });

  test("should return false when opponent is not in range", () => {
    const { attacker, defender, gameField } = setUpCharactersAndGameField(
      [1, 1],
      0,
      5
    );
    expect(checkRange(attacker, defender, gameField)).toBe(false);
  });

  test("should return true when opponent is in range", () => {
    const { attacker, defender, gameField } = setUpCharactersAndGameField(
      [1, 1],
      2,
      1
    );
    expect(checkRange(attacker, defender, gameField)).toBe(true);
  });

  test("should return false when opponent is not in range", () => {
    const { attacker, defender, gameField } = setUpCharactersAndGameField(
      [1, 1],
      7,
      3
    );
    expect(checkRange(attacker, defender, gameField)).toBe(false);
  });
});
