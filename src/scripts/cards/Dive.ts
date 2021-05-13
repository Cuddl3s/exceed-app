import { Card } from '../types/types';
import { beforeDive } from './triggers/before';

const Dive: Card = {
  name: "Dive",
  
  attributes: {
    range: [1,1],
    speed: 5,
    power: 4,
    armor: 0,
    guard: 0,
  },

  triggers: {
    before: [beforeDive],
  }
};

export default Dive;