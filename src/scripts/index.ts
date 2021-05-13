import '../styles/index.scss';
import { Card, Character, Trigger } from './types/types';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

console.log('webpack starterkit');

const init = () => {

};

window.onload = init;

const graspFunction = (myCharacter: Character, opponent: Character) => {
  opponent.currentFieldNumber += 2;
};

const cardDefault: Card = {
  name: "Grasp",
  range: [1,1],
  speed: 7,
  power: 3,
  armor: 0,
  guard: 0,

  hit: [{name: "Move the opponent 1 or 2", effect: graspFunction}],
};

const playerOneDiv = "#configurator1";
const playerTwoDiv = "#configurator2";

const addCard = (card, player) => {
  const playerAttributes = $(`${player}`).children(".attributes-panel");
  const playerTriggers =  $(`${player}`).children(".trigger-panel");
  Object.keys(card).forEach(key => {
    let currentAttributeInput = playerAttributes.find(`input[name*=${key}]`);
    currentAttributeInput.val(card[key]);
    // let currentAttributeTrigger = playerTriggers.find(`select[name=${key}]`);
    let currentAttributeTrigger = playerTriggers.find(`select[name=${key}]`);
    // console.log(card[key].get());
    // console.log(currentAttributeTrigger.get()[0]);
    currentAttributeTrigger.children().remove();
    currentAttributeTrigger.append(`<option>${card[key]}</option>`);
    // currentAttributeTrigger.text('hello');

      // currentTriggerInput.empty();
      // currentTriggerInput.append(`<option>${card[key][0]}</option>`); // why does it keep saying it can't read property name of undefined???
  });
};

addCard(cardDefault, playerOneDiv);
addCard(cardDefault, playerTwoDiv);



