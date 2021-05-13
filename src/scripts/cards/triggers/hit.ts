import { Character, Trigger } from "../../types/types";

export const hitGrasp: Trigger = {name: "Push or Pull 1 or 2", effect: (_: Character, opponent: Character) => {
  opponent.currentFieldNumber += 2;
}};

export const hitSweep: Trigger = {name: "The opponent discards a card at random", effect: () => {}};

export default [hitGrasp, hitSweep];