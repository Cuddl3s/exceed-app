import { Card } from '../types/types';
import { beforeAssault } from './triggers/before';
import { hitAssault } from './triggers/hit';

const Assault: Card = {
  name: "Assault",
  
  attributes: {
    range: [1,1],
    speed: 4,
    power: 5,
    armor: 0,
    guard: 0,
  },

  triggers: {
    before: [beforeAssault],
    hit: [hitAssault],
  }
};

export default Assault;