import '../styles/index.scss';
import { AttributeName, Card, Character, Trigger } from './types/types';

import triggers from "./cards/triggers";
import Grasp from './cards/Grasp';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

console.log('webpack starterkit');

let playerConfigurators = [];

const initTriggerSelects = () => {

  ["before", "hit", "after"].forEach(triggerType => {
    const $select = $(`select[name=${triggerType}]`);
    const triggerOptions = triggers[triggerType].map(trigger => `<option value="${trigger.name}">${trigger.name}</option>`);

    $select.empty();
    $select.append(triggerOptions);
  });

};

$(() => {

  initTriggerSelects();

  const playerOneDiv = "#configurator1";
  const playerTwoDiv = "#configurator2";

  playerConfigurators.push($(playerOneDiv), $(playerTwoDiv));

  addCard(Grasp, 1);
  addCard(Grasp, 2);
});

const addCard = (card: Card, playerNumber: number) => {

  const playerAttributes = playerConfigurators[playerNumber-1].children(".attributes-panel");
  const playerTriggers =  playerConfigurators[playerNumber-1].children(".trigger-panel");

  const { attributes, triggers } = card;

  Object.entries(attributes).forEach(([attribute, value]) => {
    const currentAttributeInput = playerAttributes.find(`input[name*=${attribute}]`);
    currentAttributeInput.val(`${value}`);
  });

  Object.entries(triggers).forEach(([trigger,value]) => {
    const $currentTriggerSelect = playerTriggers.find(`select[name=${trigger}]`);
    $currentTriggerSelect.val(value[0].name);
  });
};





