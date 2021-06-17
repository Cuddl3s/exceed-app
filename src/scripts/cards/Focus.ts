import { Card } from "../types/types";
import { afterFocus } from "./triggers/after";
import { alwaysOnFocus } from "./triggers/always_on";

const Focus: Card = {
  attributes: {
    range: [1, 2],
    speed: 4,
    power: 1,
    armor: 2,
    guard: 5,
  },

  triggers: {
    alwaysOn: [alwaysOnFocus],
    after: [afterFocus],
  },
};

export default Focus;
