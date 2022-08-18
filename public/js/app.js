const globals = {};

const newCharacter = () => {
  console.log(globals.models);

  alert("Holi");
};

const init = section => {
  switch(section) {
    case "newCharacter":
      newCharacter();

      break;
  }
};
