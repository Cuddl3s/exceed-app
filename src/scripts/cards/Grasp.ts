import { Card } from '../types/types';
import { hitGrasp } from './triggers/hit';

const Grasp: Card = {
  name: "Grasp",
  
  attributes: {
    range: [1,1],
    speed: 7,
    power: 3,
    armor: 0,
    guard: 0,
  },

  triggers: {
    hit: [hitGrasp],
  }
};

export default Grasp;