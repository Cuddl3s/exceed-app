import "../styles/index.scss";
import {
  AttributeName,
  Card,
  Character,
  Trigger,
  GameField,
} from "./types/types";

import triggers from "./cards/triggers";
import Grasp from "./cards/Grasp";
import Assault from "./cards/Assault";
import Block from "./cards/Block";
import Cross from "./cards/Cross";
import Dive from "./cards/Dive";
import Focus from "./cards/Focus";
import Spike from "./cards/Spike";
import Sweep from "./cards/Sweep";

let gameField: GameField;

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

console.log("webpack starterkit");

let playerConfigurators = [];

const initTriggerSelects = () => {
  ["before", "hit", "after", "alwaysOn"].forEach((triggerType) => {
    const $select = $(`select[name=${triggerType}]`);
    const triggerOptions = triggers[triggerType].map(
      (trigger) => `<option value="${trigger.name}">${trigger.name}</option>`
    );
    triggerOptions.push(`<option selected value="">None</option>`);

    $select.empty();
    $select.append(triggerOptions);
  });
};

const addTriggers = (triggers, $playerTriggers) => {
  Object.entries(triggers).forEach(([trigger, value]) => {
    const $currentTriggerSelect = $playerTriggers.find(
      `select[name=${trigger}]`
    );
    $currentTriggerSelect.val(value[0].name);
  });
};

const addAttributes = (attributes, $playerAttributes) => {
  Object.entries(attributes).forEach(([attribute, value]) => {
    const $currentAttributeInput = $playerAttributes.find(
      `input[name*=${attribute}]`
    );
    if (attribute === "range" && value[0] === value[1]) {
      $currentAttributeInput.val(`${value[0]}`);
    } else if (value[0] !== value[1]) {
      $currentAttributeInput.val(`${value[0]}-${value[1]}`);
    } else {
      $currentAttributeInput.val(`${value}`);
    }
  });
};

const addCard = (card: Card, playerNumber: number) => {
  const $playerAttributes =
    playerConfigurators[playerNumber - 1].children(".attributes-panel");
  const $playerTriggers =
    playerConfigurators[playerNumber - 1].children(".trigger-panel");

  const { attributes, triggers } = card;

  addAttributes(attributes, $playerAttributes);
  addTriggers(triggers, $playerTriggers);
};

const placePlayer = (player: string, gameField: GameField, number: number) => {
  if (gameField.includes(player)) {
    if (gameField[number] === player) {
      return;
    } else if (gameField[number] !== "") {
      alert(`Cannot place ${player} on this field.`);
    } else {
      gameField[gameField.indexOf(player)] = "";
      gameField[number] = player;
    }
  } else if (gameField[number] === "") {
    gameField[number] = player;
  } else {
    alert(`Cannot place ${player} on this field.`);
  }
};

let fieldClickListener;

const showPlayerPositions = (gameField: GameField, $cardFields) => {
  gameField.forEach((field, index) => {
    $cardFields[index].innerHTML = `${field}`;
    $cardFields.off("click", fieldClickListener);
  });
};

const placeCardFieldOnClick = (
  player: string,
  gameField: GameField,
  $cardFields
) => {
  $cardFields.each(function (index) {
    $(this).on("click", function fieldClickListener() {
      let number = index;
      placePlayer(player, gameField, number);
      showPlayerPositions(gameField, $cardFields);
    });
  });
};

const runAfterEffects = (first: Character, second: Character) => {
  if (first.card.triggers.after) {
    first.card.triggers.after.forEach((trigger) => {
      trigger.effect(first, second);
    });
  }
};

const calculateDamage = (attacker: Character, defender: Character) => {
  const defenderDamage =
    attacker.card.attributes.power - defender.card.attributes.armor;
  if (defenderDamage > defender.card.attributes.guard) {
    alert("Defender is stunned.");
  } else {
    return defenderDamage;
  }
};

const runHitEffects = (attacker: Character, defender: Character) => {
  if (attacker.card.triggers.hit) {
    attacker.card.triggers.hit.forEach((trigger) => {
      trigger.effect(attacker, defender);
    });
  }
};

const checkRange = (attacker: Character, defender: Character) => {
  let inRange = "false";

  for (
    let i = attacker.card.attributes.range[0];
    i <= attacker.card.attributes.range[1];
    i++
  ) {
    if (
      gameField.indexOf(defender.player) ===
        gameField.indexOf(attacker.player) + i ||
      gameField.indexOf(attacker.player) - i
    ) {
      inRange = "true";
    } else {
      return;
    }
  }

  if (inRange === "false") {
    alert("The opponent is not in this card's attack range.");
  } else {
    attacker.guage++;
    runHitEffects(attacker, defender);
  }
};

const runBeforeEffects = (attacker: Character, defender: Character) => {
  if (attacker.card.triggers.before) {
    attacker.card.triggers.before.forEach((trigger) => {
      trigger.effect(attacker, defender);
    });
  }

  if (defender.card.triggers.before) {
    defender.card.triggers.before.forEach((trigger) => {
      trigger.effect(defender, attacker);
    });
  }
};

const compareSpeeds = (playerOne: Character, playerTwo: Character) => {
  const players = [playerOne, playerTwo];
  return players.sort(
    (first, second) =>
      second.card.attributes.speed - first.card.attributes.speed
  );
};

const movePlayers = (attacker: Character, defender: Character, $cardFields) => {
  const players = [attacker, defender];
  players.forEach((player) => {
    let playerIndex = gameField.indexOf(player.player);
    let spotsToMove = 0;
    for (let i = 1; i <= player.move; i++) {
      if (gameField[playerIndex + i] !== "") {
        spotsToMove += 2;
      } else {
        spotsToMove += 1;
      }
    }
    gameField[playerIndex] = "";
    if (playerIndex + spotsToMove <= 8) {
      playerIndex = playerIndex + spotsToMove;
    } else {
      playerIndex = 8;
    }
    gameField[playerIndex] = player.player;
  });
  showPlayerPositions(gameField, $cardFields);
};

const simulateFight = (
  playerOne: Character,
  playerTwo: Character,
  $cardFields
) => {
  const [attacker, defender] = compareSpeeds(playerOne, playerTwo);
  runBeforeEffects(attacker, defender);
  checkRange(attacker, defender);
  const defenderDamage = calculateDamage(attacker, defender);
  runAfterEffects(attacker, defender);
  movePlayers(attacker, defender, $cardFields);
  if (defenderDamage !== undefined) {
    checkRange(defender, attacker);
    const attackerDamage = calculateDamage(attacker, defender);
    if (attackerDamage === undefined) {
      alert("Opponent is stunned.");
    }
  } else {
    alert("Opponent is stunned.");
  }
  console.log(gameField);
  // return gameField;
};

$(() => {
  initTriggerSelects();

  const playerOneDiv = "#configurator1";
  const playerTwoDiv = "#configurator2";

  playerConfigurators.push($(playerOneDiv), $(playerTwoDiv));

  let playerOne: Character = {
    move: 0,
    card: Grasp,
    guage: 0,
    player: "Player One",
  };

  let playerTwo: Character = {
    move: 0,
    card: Sweep,
    guage: 0,
    player: "Player Two",
  };

  gameField = ["", "", "", "", "", "", "", "", ""];

  const $placeButtonPlayerOne = $("#place-player-one-button");
  const $placeButtonPlayerTwo = $("#place-player-two-button");
  const $cardFields = $("#game-field").children();

  $placeButtonPlayerOne.on("click", function () {
    placeCardFieldOnClick(playerOne.player, gameField, $cardFields);
  });

  $placeButtonPlayerTwo.on("click", function () {
    placeCardFieldOnClick(playerTwo.player, gameField, $cardFields);
  });

  $("#simulate-button").on("click", function () {
    simulateFight(playerOne, playerTwo, $cardFields);
  });

  addCard(playerOne.card, 1);
  addCard(playerTwo.card, 2);
});
