import { Character, Trigger } from "../../types/types";

export const afterCross: Trigger = {name: "Retreat 3.", effect: (myCharacter: Character, _: Character) => {
  myCharacter.move = -3;
}};

export const afterFocus: Trigger = {name: "Draw a card.", effect: () => {}};

export const afterBlock: Trigger = {name: "Add this card to your Gauge at the end of the Strike.", effect: () => {}};

export default [afterCross, afterFocus, afterBlock];