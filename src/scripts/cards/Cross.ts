import { Card } from '../types/types';
import { afterCross } from './triggers/after';

const Cross: Card = {
  name: "Cross",
  
  attributes: {
    range: [1,2],
    speed: 3,
    power: 6,
    armor: 0,
    guard: 0,
  },

  triggers: {
    after: [afterCross],
  }
};

export default Cross;