import "../styles/index.scss";
import {
  AttributeName,
  Card,
  Character,
  Trigger,
  GameField,
  Range,
} from "./types/types";

import triggers from "./cards/triggers";

import after from "./cards/triggers/after";
import always_on from "./cards/triggers/always_on";
import before from "./cards/triggers/before";
import hit from "./cards/triggers/hit";

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
  if (checkRange(attacker, defender, gameField)) {
    return attacker.card.attributes.power - defender.card.attributes.armor;
  } else {
    return 0;
  }
};

const isStunned = (attacker: Character, defender: Character) => {
  let stunned = false;
  if (calculateDamage(attacker, defender) > defender.card.attributes.guard) {
    alert(`${defender.player} is stunned.`);
    stunned = true;
  }
  return stunned;
};

const runHitEffects = (attacker: Character, defender: Character) => {
  if (attacker.card.triggers.hit) {
    attacker.card.triggers.hit.forEach((trigger) => {
      trigger.effect(attacker, defender);
    });
  }
};

export const checkRange = (
  attacker: Character,
  defender: Character,
  gameField: GameField
) => {
  let inRange = false;

  for (
    let i = attacker.card.attributes.range[0];
    i <= attacker.card.attributes.range[1];
    i++
  ) {
    if (
      gameField.indexOf(defender.player) ===
        gameField.indexOf(attacker.player) + i ||
      gameField.indexOf(defender.player) ===
        gameField.indexOf(attacker.player) - i
    ) {
      return (inRange = true);
    }
  }

  return inRange;
};

const runBeforeEffects = (attacker: Character, defender: Character) => {
  if (attacker.card.triggers.before) {
    attacker.card.triggers.before.forEach((trigger) => {
      trigger.effect(attacker, defender);
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

const movePlayers = (attacker: Character, defender: Character) => {
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
};

const runAttack = (attacker: Character, defender: Character) => {
  runBeforeEffects(attacker, defender);
  checkRange(attacker, defender, gameField);
  const inRange = checkRange(attacker, defender, gameField);
  if (inRange === true) {
    attacker.gauge++;
  } else {
    alert(`${defender.player} is not in ${attacker.player}'s range of attack.`);
  }

  runHitEffects(attacker, defender);
  runAfterEffects(attacker, defender);

  const damage = calculateDamage(defender, attacker);
  const stunned = isStunned(defender, attacker);

  return {
    gauge: attacker.gauge,
    hit: inRange,
    damage: damage,
    stunned: stunned,
  };
};

const showResults = (player: Character, playerResults) => {
  $(`${player.results}`).append(`<div>Hit: ${playerResults.hit}</div>`);
  $(`${player.results}`).append(`<div>Gauge: ${playerResults.gauge}</div>`);
  $(`${player.results}`).append(`<div>Damage: ${playerResults.damage}</div>`);
  $(`${player.results}`).append(`<div>Stunned: ${playerResults.stunned}</div>`);
};

const clearResults = () => {
  $("#one").empty();
  $("#two").empty();
};

const simulateFight = (
  playerOne: Character,
  playerTwo: Character,
  $cardFields
) => {
  clearResults();

  const [attacker, defender] = compareSpeeds(playerOne, playerTwo);
  const attackerResults = runAttack(attacker, defender);
  const defenderResults = runAttack(defender, attacker);
  movePlayers(attacker, defender);
  showPlayerPositions(gameField, $cardFields);

  showResults(attacker, attackerResults);
  showResults(defender, defenderResults);

  return gameField;
};

const getRange = (player): Range => {
  const input = $(player).val();
  let from = 0,
    to = 0;

  if (input === "string") {
    if (input.length === 1) {
      from = parseInt(input);
      to = from;
    } else {
      const numbers = input.split("-");
      from = parseInt(numbers[0]);
      to = parseInt(numbers[1]);
    }
  }

  return [from, to];
};

const attributeReferencePlayerOne = "-one";
const attributeReferencePlayerTwo = "-two";
const attributesHtml = (attributeReference) => {
  return {
    speed: `speed${attributeReference}`,
    power: `power${attributeReference}`,
    armor: `armor${attributeReference}`,
    guard: `guard${attributeReference}`,
  };
};

$(() => {
  initTriggerSelects();

  const playerOneDiv = "#configurator1";
  const playerTwoDiv = "#configurator2";
  const power = $("#power-one").val();
  const armor = $("#armor-one").val();
  const guard = $("#guard-one").val();
  const speed = $("#speed-one").val();

  playerConfigurators.push($(playerOneDiv), $(playerTwoDiv));

  let playerOne: Character = {
    move: 0,
    card: {
      attributes: {
        range: getRange("#range-one"),
        speed:
          typeof attributesHtml(attributeReferencePlayerOne).speed === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerOne).speed)
            : 0,
        power:
          typeof attributesHtml(attributeReferencePlayerOne).power === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerOne).power)
            : 0,
        armor:
          typeof attributesHtml(attributeReferencePlayerOne).armor === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerOne).armor)
            : 0,
        guard:
          typeof attributesHtml(attributeReferencePlayerOne).guard === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerOne).guard)
            : 0,
      },
      triggers: {
        alwaysOn: always_on,
        before: before,
        hit: hit,
        after: after,
      },
    },
    gauge: 0,
    player: "Player One",
    results: "#one",
  };

  let playerTwo: Character = {
    move: 0,
    card: {
      attributes: {
        range: getRange("#range-two"),
        speed:
          typeof attributesHtml(attributeReferencePlayerTwo).speed === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerTwo).speed)
            : 0,
        power:
          typeof attributesHtml(attributeReferencePlayerTwo).power === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerTwo).power)
            : 0,
        armor:
          typeof attributesHtml(attributeReferencePlayerTwo).armor === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerTwo).armor)
            : 0,
        guard:
          typeof attributesHtml(attributeReferencePlayerTwo).guard === "string"
            ? parseInt(attributesHtml(attributeReferencePlayerTwo).guard)
            : 0,
      },
      triggers: {
        alwaysOn: always_on,
        before: before,
        hit: hit,
        after: after,
      },
    },
    gauge: 0,
    player: "Player Two",
    results: "#two",
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

  addCard(playerOne.card, 1);
  addCard(playerTwo.card, 2);

  $("#simulate-button").on("click", function () {
    simulateFight(playerOne, playerTwo, $cardFields);
  });
});
