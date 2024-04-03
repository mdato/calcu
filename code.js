const keys = document.querySelectorAll(".key");
const display_input = document.querySelector(".display .input");
const display_output = document.querySelector(".display .output");

let input = "";

document.addEventListener("keydown", (event) => {
  const keyValue = event.key;
  const keyElement = document.querySelector(`.key[data-key="${keyValue}"]`);
  if (keyElement) {
    keyElement.classList.add("active");
  }
  if (keyValue === "Enter") {
    handleKey("=");
    const enterButton = document.getElementById('igual');
    enterButton.classList.add('active');
    setTimeout(() => {
      enterButton.classList.remove('active');
    }, 200);


  } else if (keyValue === "Escape" || keyValue === "Delete") {
    handleKey("clear");
    const backspaceButton = document.getElementById('limpio');
    backspaceButton.classList.add('active');
    setTimeout(() => {
      backspaceButton.classList.remove('active');
    }, 200);

  } else if (keyValue === "Backspace") {
    handleKey("backspace");
    const backspaceButton = document.getElementById('backspace');
    backspaceButton.classList.add('active');
    setTimeout(() => {
      backspaceButton.classList.remove('active');
    }, 200);

  } else if (keyValue === "(" || keyValue === ")") { // Manejo de eventos para "(" y ")"
    handleKey(keyValue);
    const parenthesesButton = document.getElementById('llaves');
    parenthesesButton.classList.add('active');
    setTimeout(() => {
      parenthesesButton.classList.remove('active');
    }, 200);
    
  } else {
    handleKey(keyValue);
  }
});

document.addEventListener("keyup", (event) => {
  const keyValue = event.key;
  const keyElement = document.querySelector(`.key[data-key="${keyValue}"]`);
  if (keyElement) {
    keyElement.classList.remove("active");
  }
});

function handleKey(value) {
  if (value === "Enter") value = "=";
  if (value === "Delete") value = "clear";
  if (value === "Escape") value = "clear";
  if (value === "Backspace") value = "backspace"; // Convertir "Backspace" a "backspace"

  if (
    value === "(" ||
    value === ")" ||
    value === "escape" ||
    value === "backspace" ||
    value === "="
  ) {
    // Inserta directamente el paréntesis, la tecla igual o la tecla Backspace al input
    if (value === "=") {
      let result = eval(PrepareInput(input));
      display_output.innerHTML = CleanOutput(result);
    } else if (value === "backspace") {
      input = input.slice(0, -1);
      display_input.innerHTML = CleanInput(input);
      if (input === "" && display_output.innerHTML !== "") { // Si el input está vacío y hay un resultado en el output
        display_output.innerHTML = ""; // Borra el contenido del output
      }
    } else {
      input += value;
      display_input.innerHTML = CleanInput(input);
    }
    
  } else {
    // Encuentra la tecla correspondiente y simula el clic
    for (let key of keys) {
      if (key.dataset.key === value) {
        key.click();
        break;
      }
    }
  }
}

for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener("click", () => {
    if (value === "clear") {
      input = "";
      display_input.innerHTML = "";
      display_output.innerHTML = "";
    } else if (value === "backspace") {
      input = input.slice(0, -1);
      display_input.innerHTML = CleanInput(input);
    } else if (value === "=" || value === "=")   {
      let result = eval(PrepareInput(input));
      display_output.innerHTML = CleanOutput(result);
    } else if (value === "brackets") {
      if (
        input.indexOf("(") === -1 ||
        (input.indexOf("(") !== -1 &&
          input.indexOf(")") !== -1 &&
          input.lastIndexOf("(") < input.lastIndexOf(")"))
      ) {
        input += "(";
      } else if (
        (input.indexOf("(") !== -1 && input.indexOf(")") === -1) ||
        (input.indexOf("(") !== -1 &&
          input.indexOf(")") !== -1 &&
          input.lastIndexOf("(") > input.lastIndexOf(")"))
      ) {
        input += ")";
      }

      display_input.innerHTML = CleanInput(input);
    } else {
      if (ValidateInput(value)) {
        input += value;
        display_input.innerHTML = CleanInput(input);
      }
    }
  });
}

function CleanInput(input) {
  let input_array = input.split("");
  let input_array_length = input_array.length;

  for (let i = 0; i < input_array_length; i++) {
    if (input_array[i] === "*") {
      input_array[i] = ` <span class="operator">x</span> `;
    } else if (input_array[i] === "/") {
      input_array[i] = ` <span class="operator">÷</span> `;
    } else if (input_array[i] === "+") {
      input_array[i] = ` <span class="operator">+</span> `;
    } else if (input_array[i] === "-") {
      input_array[i] = ` <span class="operator">-</span> `;
    } else if (input_array[i] === "(") {
      input_array[i] = `<span class="brackets">(</span>`;
    } else if (input_array[i] === ")") {
      input_array[i] = `<span class="brackets">)</span>`;
    } else if (input_array[i] === "%") {
      input_array[i] = `<span class="percent">%</span>`;
    }
  }

  return input_array.join("");
}

function CleanOutput(output) {
  // Limitar el resultado a 6 decimales
  let roundedOutput = +output.toFixed(10);

  let output_string = roundedOutput.toString();
  let decimal = output_string.split(".")[1];
  output_string = output_string.split(".")[0];

  let output_array = output_string.split("");

  if (output_array.length > 3) {
    for (let i = output_array.length - 3; i > 0; i -= 3) {
      output_array.splice(i, 0, ",");
    }
  }

  if (decimal) {
    output_array.push(".");
    output_array.push(decimal);
  }

  return output_array.join("");
}

function ValidateInput(value) {
  let last_input = input.slice(-1);
  let operators = ["+", "-", "*", "/"];

  if (value === "." && last_input === ".") {
    return false;
  }

  if (operators.includes(value)) {
    if (operators.includes(last_input)) {
      return false;
    } else {
      return true;
    }
  }

  return true;
}

function PrepareInput(input) {
  let input_array = input.split("");

  for (let i = 0; i < input_array.length; i++) {
    if (input_array[i] === "%") {
      input_array[i] = "/100";
    }
  }

  return input_array.join("");
}

/// Función para hacer desplazar automáticamente la barra de desplazamiento hacia abajo
function scrollInputToBottom() {
  display_input.scrollTop = display_input.scrollHeight;
}

// Verificar periódicamente si el contenido del input ha cambiado y desplazar la barra de desplazamiento hacia abajo
setInterval(() => {
  const currentHeight = display_input.scrollHeight;
  scrollInputToBottom();
  // Si el contenido ha cambiado, desplazar la barra de desplazamiento hacia abajo
  if (display_input.scrollHeight !== currentHeight) {
    scrollInputToBottom();
  }
}, 500); // Verificar cada 500 milisegundos

// Al final del código, llamar a la función una vez para asegurarse de que la barra de desplazamiento se encuentre inicialmente en la parte inferior
scrollInputToBottom();
