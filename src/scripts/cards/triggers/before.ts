import { Character, Trigger } from "../../types/types";

export const beforeDive: Trigger = {name: "Advance 3. If you moved past the opponent, their attacks do not hit you.", effect: (myCharacter: Character, _: Character) => {
  myCharacter.move = 3;
}};

export const beforeAssault: Trigger = {name: "Close 2.", effect: (myCharacter: Character, _: Character) => {
    myCharacter.move = 2;
  }};

export default [beforeDive, beforeAssault];