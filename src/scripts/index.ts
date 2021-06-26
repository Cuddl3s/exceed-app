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
import Grasp from "./cards/Grasp";
import Sweep from "./cards/Sweep";

import after from "./cards/triggers/after";
import always_on from "./cards/triggers/always_on";
import before from "./cards/triggers/before";
import hit, { hitGrasp, hitSweep } from "./cards/triggers/hit";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

let gameField: GameField;

if (process.env.NODE_ENV === "development") {
  require("../index.html");
}

console.log("webpack starterkit");

let playerConfigurators = [];

/*
<select value="2">
  <option value="Close 2">Close 2</option>
  <option value="Push 1">Push 1</option>
</select>

$(selectBefore).addEventListener("change", (event) => {
  const newValue = event.target.value;
   iterate through all before effects
  find the one with trigger.name === event.target.value
  => Found it!

  playerOne.card.triggers.before = [before]
})

$(selectHit).addEventListener("change", (e) => {

})

$(selectAfter).addEventListener("change", (e) => {

})
*/

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
      placePlayer(player, gameField, index);
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
  return attacker.card.attributes.power - defender.card.attributes.armor;
};

const isStunned = (attacker: Character, defender: Character) => {
  let stunned = false;
  if (calculateDamage(attacker, defender) > defender.card.attributes.guard) {
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
      inRange = true;
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

const movePlayer = (player: Character) => {
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
};

const runAttack = (attacker: Character, defender: Character, $cardFields) => {
  let damage;
  let stunned;

  runBeforeEffects(attacker, defender);
  const inRange = checkRange(attacker, defender, gameField);
  if (inRange === true) {
    attacker.gauge++;
    runHitEffects(attacker, defender);
    damage = calculateDamage(attacker, defender);
    stunned = isStunned(attacker, defender);
    if (stunned === false) {
      runAfterEffects(attacker, defender);
    }
    movePlayer(defender);
  } else {
    alert(`${defender.player} is not in ${attacker.player}'s range of attack.`);
    runAfterEffects(attacker, defender);
  }

  showPlayerPositions(gameField, $cardFields);

  if (stunned) {
    alert(`${defender.player} is stunned.`);
  }

  return {
    gauge: attacker.gauge,
    hit: inRange,
    damage: damage,
    playerStunned: isStunned(defender, attacker),
  };
};

const showResults = (player: Character, playerResults) => {
  $(`${player.results}`).append(`<div>Hit: ${playerResults.hit}</div>`);
  $(`${player.results}`).append(`<div>Gauge: ${playerResults.gauge}</div>`);
  $(`${player.results}`).append(
    `<div>Damage Received: ${playerResults.damage}</div>`
  );
  $(`${player.results}`).append(
    `<div>Stunned: ${playerResults.playerStunned}</div>`
  );
};

const clearResults = () => {
  $("#one").empty();
  $("#two").empty();
};

const getRange = (player): Range => {
  const input = $(player).val();
  let from = 0,
    to = 0;

  if (typeof input === "string") {
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

const currentPlayerAttributes = (playerOne, rangeContainer) => {
  $(".att-one > input").on("change", function () {
    playerOne.card.attributes.range = getRange(rangeContainer);
    playerOne.card.attributes.speed = $("#speed-one").val();
    playerOne.card.attributes.power = $("#power-one").val();
    playerOne.card.attributes.armor = $("#armor-one").val();
    playerOne.card.attributes.guard = $("#guard-one").val();
  });
};

const currentPlayerTriggers = (container, player) => {
  $(`.${container}[name="before"]`).on("change", function () {
    const newValue = $(this).val();
    triggers["before"].forEach((trigger) => {
      if (trigger.name === newValue) {
        player.card.triggers.before = [trigger];
      } else {
        player.card.triggers.before = [];
      }
    });
  });

  $(`.${container}[name="hit"]`).on("change", function () {
    const newValue = $(this).val();
    triggers["hit"].forEach((trigger) => {
      if (trigger.name === newValue) {
        player.card.triggers.hit = [trigger];
      } else {
        player.card.triggers.hit = [];
      }
    });
  });

  $(`.${container}[name="after"]`).on("change", function () {
    const newValue = $(this).val();
    triggers["after"].forEach((trigger) => {
      if (trigger.name === newValue) {
        player.card.triggers.after = [trigger];
      } else {
        player.card.triggers.after = [];
      }
    });
  });

  $(`.${container}[name="alwaysOn"]`).on("change", function () {
    const newValue = $(this).val();
    triggers["alwaysOn"].forEach((trigger) => {
      if (trigger.name === newValue) {
        player.card.triggers.alwaysOn = [trigger];
      } else {
        player.card.triggers.alwaysOn = [];
      }
    });
  });
};

const simulateFight = (
  playerOne: Character,
  playerTwo: Character,
  $cardFields
) => {
  clearResults();

  const [attacker, defender] = compareSpeeds(playerOne, playerTwo);
  const attackerResults = runAttack(attacker, defender, $cardFields);
  const defenderResults = runAttack(defender, attacker, $cardFields);

  showResults(attacker, attackerResults);
  showResults(defender, defenderResults);

  return gameField;
};

$(() => {
  initTriggerSelects();

  const playerOneDiv = "#configurator1";
  const playerTwoDiv = "#configurator2";

  playerConfigurators.push($(playerOneDiv), $(playerTwoDiv));

  let playerOne: Character = {
    move: 0,
    card: {
      attributes: {
        range: Grasp.attributes.range,
        speed: Grasp.attributes.speed,
        power: Grasp.attributes.power,
        armor: Grasp.attributes.armor,
        guard: Grasp.attributes.guard,
      },
      triggers: {
        hit: [hitGrasp],
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
        range: Sweep.attributes.range,
        speed: Sweep.attributes.speed,
        power: Sweep.attributes.power,
        armor: Sweep.attributes.armor,
        guard: Sweep.attributes.guard,
      },
      triggers: {
        hit: [hitSweep],
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
    if ($("#one").is(":empty") && $("#two").is(":empty")) {
      if (
        gameField.includes("Player One") &&
        gameField.includes("Player Two")
      ) {
        simulateFight(playerOne, playerTwo, $cardFields);
      }
    }
  });

  $("#clear-button").on("click", function () {
    $cardFields.empty();
    gameField = ["", "", "", "", "", "", "", "", ""];
    clearResults();
    addCard(playerOne.card, 1);
    addCard(playerTwo.card, 2);
  });

  currentPlayerTriggers("one", playerOne);
  currentPlayerTriggers("two", playerTwo);

  currentPlayerAttributes(playerOne, "#range-one");
  currentPlayerAttributes(playerTwo, "#range-two");
});
