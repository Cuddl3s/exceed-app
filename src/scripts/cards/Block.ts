import { Card } from '../types/types';
import { afterBlock } from './triggers/after';

const Block: Card = {
  name: "Block",
  
  attributes: {
    range: [0,0],
    speed: 0,
    power: 0,
    armor: 2,
    guard: 3,
  },

  triggers: {
    after: [afterBlock],
  }
};

export default Block;