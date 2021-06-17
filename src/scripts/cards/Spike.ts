import { Card } from "../types/types";
import { alwaysOnSpike } from "./triggers/always_on";

const Spike: Card = {
  attributes: {
    range: [2, 3],
    speed: 5,
    power: 3,
    armor: 0,
    guard: 4,
  },

  triggers: {
    alwaysOn: [alwaysOnSpike],
  },
};

export default Spike;
