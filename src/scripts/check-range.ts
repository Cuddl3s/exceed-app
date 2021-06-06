import { Character, GameField } from "./types/types";

export const checkRange = (
  attacker: Character,
  defender: Character,
  gameField: GameField
) => {
  let inRange = false;

  for (
    let i = attacker.card.attributes.range[0];
    i <= attacker.card.attributes.range[1];
    i++
  ) {
    if (
      gameField.indexOf(defender.player) ===
        gameField.indexOf(attacker.player) + i ||
      gameField.indexOf(defender.player) ===
        gameField.indexOf(attacker.player) - i
    ) {
      return (inRange = true);
    }
  }

  return inRange;

  // if (inRange === false) {
  //   alert("The opponent is not in this card's attack range.");
  // } else {
  //   attacker.gauge++;
  //   $(`${attacker.results}`).append(`<div>Gauge: ${attacker.gauge}</div>`);
  // }

  // $(`${attacker.results}`).append(`<div>Hit: ${inRange}</div>`);
};
