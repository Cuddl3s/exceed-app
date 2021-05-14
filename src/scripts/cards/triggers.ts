import { Character, Trigger } from "../types/types";
import hitTriggers from "./triggers/hit";
import beforeTriggers from "./triggers/before";
import afterTriggers from "./triggers/after";
import alwaysOnTriggers from "./triggers/always_on";

const before: Trigger[] = [
  ...beforeTriggers,
];

const hit: Trigger[] = [
  ...hitTriggers,
];

const after: Trigger[] = [
  ...afterTriggers,
];

const alwaysOn: Trigger[] = [
  ...alwaysOnTriggers,
];

export default {before, hit, after, alwaysOn};