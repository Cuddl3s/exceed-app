export type Range = [number,number];

export type Character = {
  currentFieldNumber: number;
  card: Card;
}

export type Trigger = {
  name: string;
  effect: (myCharacter: Character, opponent: Character) => void;
};

export type Card = {
  name: string;
  speed: number;
  power: number;
  range: Range;
  armor: number;
  guard: number;

  alwaysOn?: Trigger[];
  before?: Trigger[];
  hit?: Trigger[];
  after?: Trigger[];
}