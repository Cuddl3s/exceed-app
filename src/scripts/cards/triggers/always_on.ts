import { Character, Trigger } from "../../types/types";

export const alwaysOnFocus: Trigger = {
  name: "Opponents cannot move you.",
  effect: () => {},
};

export const alwaysOnSpike: Trigger = {
  name: "Ignore Armour, ignore Guard.",
  effect: () => {},
};

export default [alwaysOnFocus, alwaysOnSpike];
