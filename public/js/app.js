/**
  * enemy
  * enemyStatus
  * familyDestination
  * familyStatus
  * misfortune
  * mostRelevantFriend
  * parentalDestination
  * partner
  * partnerLocation
  * partnerRelationship
  * romanceTradegy
  * romanceTrouble
  * romanceType
  * sibling
  * siblingRelationship
  * style
  * values
  * venture
  **/

const globals = {};

const dice = (min = 1, max = 10) => Math.floor(Math.random() * (max - min)) + min;

const isPair = n => Boolean(n % 2 === 0);

const next = (previousNode, _next, text = null) => {
  previousNode.remove();

  if (text) console.log(text);

  _next();
};

const createSelector = ({ id, text, options }) => {
  const parent = document.createElement("div");

  parent.className = "form-group";

  // const label = document.createElement("label");

  // label.addClass("control-label");
  // label.setAttribute("for", id);

  // const textNode = document.createTextNode(text);

  // label.appendChild(textNode);
  // parent.appendChild(label);

  const select = document.createElement("select");

  select.className = "form-control";
  select.setAttribute("id", id);

  const textNode = document.createTextNode(text);
  const option = document.createElement("option");

  option.setAttribute("value", "");
  option.appendChild(textNode);

  select.appendChild(option);

  options.entities.forEach(op => {
    const option = document.createElement("option");

    option.setAttribute("value", op[options.value]);

    const textNode = document.createTextNode(op[options.name]);

    option.appendChild(textNode);
    select.appendChild(option);
  });

  parent.appendChild(select);

  return parent;
};

const selectCommonPath = () => {
  globals.background = {};

  const body = $("#pathStepContent > .card-body");

  const selectOrigin = () => {
    const selectRegion = () => {
      const selector = createSelector({
        id: "regionSelector",
        text: "Selecciona tu región de nacimiento",
        options: {
          entities: globals.models.regions.filter(region => !new RegExp("antiguas", "i").test(region.title)),
          value: "_id",
          name: "title"
        }
      });

      $(selector).on("change", e => {
        if (!e.target.value) return alert("Debes seleccionar tu región de nacimiento");

        globals.background.region = globals.models.regions.find(r => r._id === e.target.value);

        $("#pathStepContent").addClass("show");

        next($("#regionSelector"), selectKingdom, `Tu region: ${globals.background.region.title}`);
      });

      body.append(selector);
    };

    const selectKingdom = () => {
      const selector = createSelector({
        id: "kingdomSelector",
        text: "Selecciona tu reino de nacimiento",
        options: {
          entities: globals.models.kingdoms.filter(kingdom => new RegExp(globals.background.region.title, "i").test(kingdom.region)),
          value: "_id",
          name: "title"
        }
      });

      $(selector).on("change", e => {
        if (!e.target.value) return alert("Debes seleccionar tu reino de nacimiento");

        globals.background.kingdom = globals.models.kingdoms.find(r => r._id === e.target.value);

        $("#pathStepContent").addClass("show");

        next($("#kingdomSelector"), goToFamily, `Tu reino: ${globals.background.kingdom.title}`);
      });

      body.append(selector);
    };

    const goToFamily = () => {
      const parents = () => {
        if (isPair(dice())) return familyStatus();

        return parentalDestination();
      };

      const familyStatus = () => {
        console.log("Tus padres están vivos");
        console.log(Object.keys(globals.fixtures.common));
      };

      const parentalDestination = () => {
        console.log("Algo le pasó a tus padres");
        console.log(Object.keys(globals.fixtures.common));
      };

      const familyDestination = () => {
        console.log("Algo le pasó a tu familia");

        globals.background.family = globals.fixtures.common.familyDestination[dice()][globals.background.region.title];

        console.log(globals.background.family);
      };

      if (isPair(dice())) return parents();

      return familyDestination();
    };

    selectRegion();
  };

  if (["Enano", "Elfo"].includes(globals.race.title)) {
    globals.region = globals.models.regions.find(r => r.title === "Tierras Antiguas");
  } else {
    selectOrigin();
  }
};

const selectWitcherPath = () => {

};

const selectRace = () => {
  const body = $("#raceStepContent > .card-body");

  const selector = createSelector({
    id: "regionSelector",
    text: "Selecciona tu raza",
    options: {
      entities: globals.models.races,
      value: "_id",
      name: "title"
    }
  });

  body.append(selector);

  $(selector).on("change", e => {
    if (!e.target.value) return alert("Debes seleccionar tu raza");

    globals.race = globals.models.races.find(r => r._id === e.target.value);

    $("#pathStepContent").addClass("show");

    if (globals.race.title === "Brujo") return next($("#cardRace"), selectWitcherPath);

    return next($("#cardRace"), selectCommonPath, `Tu raza: ${globals.race.title}`);
  });
};

const newCharacter = () => {
  // 1. Escoge tu raza
  selectRace();
};

const init = section => {
  $("#cardPath").on("click", e => {
    if (!globals.race) e.stopPropagation();
  });

  switch (section) {
    case "newCharacter":
      newCharacter();

      break;
  }
};
