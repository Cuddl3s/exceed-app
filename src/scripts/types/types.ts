export type Range = [number,number];

export type Character = {
  move: number;
  card: Card;
}

export type Trigger = {
  name: string;
  effect: (myCharacter: Character, opponent: Character) => void;
};

export type Card = {
  name: string;
  attributes: Attributes;
  triggers: Triggers;
};

export type Attributes = {
  range: Range;
  speed: number;
  power: number;
  armor: number;
  guard: number;
};


export type AttributeName = keyof Attributes;

export type Triggers = {
  alwaysOn?: Trigger[];
  before?: Trigger[];
  hit?: Trigger[];
  after?: Trigger[];
}

export type TriggerName = keyof Triggers;

export type GameField = [string, string, string, string, string, string, string, string, string];