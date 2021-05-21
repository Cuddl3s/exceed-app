import '../styles/index.scss';
import { AttributeName, Card, Character, Trigger, GameField } from './types/types';

import triggers from "./cards/triggers";
import Grasp from './cards/Grasp';
import Assault from './cards/Assault';
import Block from './cards/Block';
import Cross from './cards/Cross';
import Dive from './cards/Dive';
import Focus from './cards/Focus';
import Spike from './cards/Spike';
import Sweep from './cards/Sweep';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

console.log('webpack starterkit');

let playerConfigurators = [];

const initTriggerSelects = () => {

  ["before", "hit", "after", "alwaysOn"].forEach(triggerType => {
    const $select = $(`select[name=${triggerType}]`);
    const triggerOptions = triggers[triggerType].map(trigger => `<option value="${trigger.name}">${trigger.name}</option>`);
    triggerOptions.push(`<option selected value="">None</option>`);

    $select.empty();
    $select.append(triggerOptions);
  });

};

const addTriggers = (triggers, $playerTriggers) => {
  Object.entries(triggers).forEach(([trigger,value]) => {
    const $currentTriggerSelect = $playerTriggers.find(`select[name=${trigger}]`);
    $currentTriggerSelect.val(value[0].name);
  });
};

const addAttributes = (attributes, $playerAttributes) => {
  Object.entries(attributes).forEach(([attribute, value]) => {
    const $currentAttributeInput = $playerAttributes.find(`input[name*=${attribute}]`);
    if(attribute === "range" && value[0] === value[1]) {
      $currentAttributeInput.val(`${value[0]}`);
    } else if(value[0] !== value[1]) {
      $currentAttributeInput.val(`${value[0]}-${value[1]}`);
    } else {
      $currentAttributeInput.val(`${value}`);
    }
  });
};

const addCard = (card: Card, playerNumber: number) => {

  const $playerAttributes = playerConfigurators[playerNumber-1].children(".attributes-panel");
  const $playerTriggers =  playerConfigurators[playerNumber-1].children(".trigger-panel");

  const { attributes, triggers } = card;

  addAttributes(attributes, $playerAttributes);
  addTriggers(triggers, $playerTriggers);
};

const placePlayer = (player: string, gameField: GameField, number: number) => {
  if(gameField.includes(player)) {
    if(gameField[number - 1] === player) {
      return;
    } else if(gameField[number - 1] !== "") {
      alert(`Cannot place ${player} on this field.`);
    } else {
      gameField[number - 1] = player;
    }
  } else if(gameField[number - 1] === "") {
    gameField[number - 1] = player;
  } else {
    alert(`Cannot place ${player} on this field.`);
  }
  console.log(gameField);
};


// const placePlayer = (player: string, gameField: GameField, number: number) => {
//   if(gameField[number - 1] !== "") {
//     if(gameField.includes(player) && gameField[number - 1] !== player) {
//       gameField[gameField.indexOf(player)] = "";
//     } else if (gameField[number - 1] === player) {
//       return;
//     } else {
//       alert(`Cannot place ${player} on this field.`);
//     }
//   } else if(gameField[number - 1] === "") {
//     if(gameField.includes(player)) {
//       gameField[gameField.indexOf(player)] = "";
//       gameField[number - 1] = player;
//     }
//       gameField[number - 1] = player;
//   } else {
//     gameField[number - 1] = player;
//   }
// };

const showPlayerPositions = (gameField: GameField, $cardFields) => {
  gameField.forEach((field, index) => { if(field !== "") {
    $cardFields[index].innerHTML = `<p>${field}</p>`;
  }});
};

const placeCardFieldOnClick = (player: string, gameField: GameField) => {
  const $cardFields = $("#game-field").children();
  console.log(gameField);
  $cardFields.each(function(index) { $(this).on("click", function() {
    let number =  index + 1;
    placePlayer(player, gameField, number);
    showPlayerPositions(gameField, $cardFields);
    });
  });
};

$(() => {

  initTriggerSelects();

  const playerOneDiv = "#configurator1";
  const playerTwoDiv = "#configurator2";

  playerConfigurators.push($(playerOneDiv), $(playerTwoDiv));

  const playerOne: Character = {
    move: 0,
    card: Focus,
  };

  const playerTwo: Character = {
    move: 0,
    card: Sweep,
  };

  let gameField: GameField = ["","","","","","","","",""];

  const $placeButtonPlayerOne = $("#place-player-one-button");
  const $placeButtonPlayerTwo = $("#place-player-two-button");

  $placeButtonPlayerOne.on("click", function() {
    placeCardFieldOnClick("Player One", gameField);
  });

  $placeButtonPlayerTwo.on("click", function() {
    placeCardFieldOnClick("Player Two", gameField);
  });

  addCard(playerOne.card, 1);
  addCard(playerTwo.card, 2);
});