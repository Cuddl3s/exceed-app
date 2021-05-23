import { Card } from '../types/types';
import { hitSweep } from './triggers/hit';

const Sweep: Card = {
  name: "Sweep",
  
  attributes: {
    range: [1,3],
    speed: 6,
    power: 2,
    armor: 0,
    guard: 6,
  },

  triggers: {
    hit: [hitSweep],
  }
};

export default Sweep;