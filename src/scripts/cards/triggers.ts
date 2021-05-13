import { Character, Trigger } from "../types/types";
import hitTriggers from "./triggers/hit";

const before: Trigger[] = [
  {name: "Advance 3. If you moved past the opponent, their attack does not hit you", effect: (myCharacter: Character, _: Character) => {myCharacter.currentFieldNumber += 3;}}
];

const hit: Trigger[] = [
  ...hitTriggers,
];

const after: Trigger[] = [
  {name: "Draw a card", effect: () => {}}
];

export default {before, hit, after};