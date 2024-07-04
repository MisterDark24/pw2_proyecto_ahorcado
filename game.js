// Variables globales
var palabrasFaciles = []; // Array de palabras faciles
var palabrasAvanzadas = []; // Array de palabras avanzadas
var palabraSeleccionada = ""; // Palabra seleccionada de manera aleatoria
var pistasPalabraSeleccionada = []; // Pistas de la palabra seleccionada
var intentos = 0; // Intentos restantes
var palabraMostrada = ""; // Palabra oculta que se va mostrando con las letras adivinadas
var nombreJugador = ""; // Nombre del jugador
var dificultad = ""; // Dificultad seleccionada
// Datos de los jugadores
var juegos = [
  {
    nombre: "Mauricio",
    partidasJugadas: 9,
    totalGanados: 3,
    totalPerdidos: 6,
    porcentajeVictorias: 33.33,
    partidas: [
      {
        dificultad: "facil",
        ganados: 2,
        perdidos: 3,
      },
      {
        dificultad: "avanzado",
        ganados: 1,
        perdidos: 3,
      },
    ],
  },
  {
    nombre: "Eduardo",
    partidasJugadas: 6,
    totalGanados: 2,
    totalPerdidos: 4,
    porcentajeVictorias: 33.33,
    partidas: [
      {
        dificultad: "facil",
        ganados: 1,
        perdidos: 2,
      },
      {
        dificultad: "avanzado",
        ganados: 1,
        perdidos: 2,
      },
    ],
  },
];

// Funciones del juego
function iniciarJuego() {
  /* Esta funcion se encarga de seleccionar una palabra aleatoria segun la dificultad */
  let valor; // Valor es un objeto que contiene la palabra y la pista
  switch (dificultad) {
    case "facil":
      valor =
        palabrasFaciles[Math.floor(Math.random() * palabrasFaciles.length)];
      intentos = 5;
      break;
    case "avanzado":
      valor =
        palabrasAvanzadas[Math.floor(Math.random() * palabrasAvanzadas.length)];
      intentos = 2;
      break;
  }

  palabraSeleccionada = valor.word;
  pistasPalabraSeleccionada = valor.clue;

  // Inicializar la palabra mostrada con guiones bajos
  palabraMostrada = "_".repeat(palabraSeleccionada.length);

  actualizarPantalla();
}

function actualizarPantalla() {
  /* Esta funcion se encarga de actualizar la pantalla con la palabra oculta, la pista y los intentos restantes */
  // Seleccionar una pista aleatoria
  let pistaRandom =
    pistasPalabraSeleccionada[
      Math.floor(Math.random() * pistasPalabraSeleccionada.length)
    ];
  $("#word").text(palabraMostrada.split("").join(" ")); // Mostrar la palabra oculta
  $("#playerNameDisplay").text("Jugador: " + nombreJugador); // Mostrar el nombre del jugador
  $("#clue").text("Pista: " + pistaRandom); // Mostrar la pista
  mostrarIntentos();
  $("#guess").focus(); // Enfocar el input de adivinar letra
}

function mostrarIntentos() {
  /* Esta funcion se encarga de mostrar los intentos restantes representados por corazones */
  let attemptsHtml = "";
  for (let i = 0; i < intentos; i++) {
    attemptsHtml += '<div class="corazon">♥</div>';
  }
  $("#attempts").html(attemptsHtml);
}

function adivinarLetra(letra) {
  /* Esta funcion se encarga de verificar si la letra ingresada por el jugador es correcta o no */
  let nuevaPalabraMostrada = ""; // Variable que contiene la palabra oculta actualizada
  let acierto = false; // Variable que indica si se adivino la letra

  letra = letra.toUpperCase(); // Convertir la letra a mayuscula

  // Iterar letra por letra de la palabra seleccionada
  for (let i = 0; i < palabraSeleccionada.length; i++) {
    // Si la letra ingresada es igual a la letra actual de la palabra seleccionada
    if (palabraSeleccionada[i] === letra) {
      // Agregar la letra a la palabra oculta actualizada
      nuevaPalabraMostrada += letra;
      // Indicar que se adivino la letra
      acierto = true;
    } else {
      // Si no se adivino la letra, agregar la letra actual de la palabra oculta
      nuevaPalabraMostrada += palabraMostrada[i];
    }
  }

  // Si no se adivino la letra, restar un intento
  if (!acierto) {
    intentos--;
  }

  palabraMostrada = nuevaPalabraMostrada; // Actualizar la palabra oculta
  actualizarPantalla();
  verificarFinJuego();
}

function verificarFinJuego() {
  /* Esta funcion se encarga de verificar si el jugador gano o perdio */
  // Verificar si la palabra oculta es igual a la palabra seleccionada
  if (palabraMostrada === palabraSeleccionada) {
    // Si es igual, mostrar mensaje de victoria y registrar estadistica
    alert("¡Felicidades, ganaste!");
    registrarEstadistica(true);
    resetGame();
  } else if (intentos <= 0) {
    // Si se acabaron los intentos, mostrar mensaje de derrota y registrar estadistica
    alert("¡Lo siento, perdiste! La palabra era: " + palabraSeleccionada);
    registrarEstadistica(false);
    resetGame();
  }
}

function resetGame() {
  /* Esta funcion se encarga de resetear el juego */
  $("#gameArea").addClass("hidden");
  $("#loginArea").show();
  $("#statsArea").show();
}

// Funciones de estadisticas
function registrarEstadistica(ganado) {
  /* Esta funcion se encarga de registrar las estadisticas del jugador */
  // Buscar si el jugador ya tiene estadisticas registradas
  let jugadorStats = juegos.find((juego) => juego.nombre === nombreJugador);

  // Si no tiene estadisticas, crear un nuevo objeto con las estadisticas
  if (!jugadorStats) {
    jugadorStats = {
      nombre: nombreJugador,
      partidasJugadas: 0,
      totalGanados: 0,
      totalPerdidos: 0,
      porcentajeVictorias: 0,
      partidas: [
        {
          dificultad: "facil",
          ganados: 0,
          perdidos: 0,
        },
        {
          dificultad: "avanzado",
          ganados: 0,
          perdidos: 0,
        },
      ],
    };
    juegos.push(jugadorStats);
  }

  // Actualizar las partidas jugadas del jugador
  jugadorStats.partidasJugadas++;

  // Buscar la partida actual del jugador segun la dificultad
  let partidaStats = jugadorStats.partidas.find(
    (partida) => partida.dificultad === dificultad
  );

  // Si gano, aumentar las partidas ganadas
  if (ganado) {
    jugadorStats.totalGanados++;
    partidaStats.ganados++;
  }

  // Si perdio, aumentar las partidas perdidas
  if (!ganado) {
    jugadorStats.totalPerdidos++;
    partidaStats.perdidos++;
  }

  // Calcular el porcentaje de victorias del jugador
  jugadorStats.porcentajeVictorias =
    (jugadorStats.totalGanados / jugadorStats.partidasJugadas) * 100;

  actualizarTabla();
}

function dibujarGraficos(nombreJugador) {
  /* Esta funcion se encarga de dibujar los graficos de estadisticas del jugador */

  // Obtener --white-color de :root
  let whiteColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--white-color"
  );

  // Buscar al jugador segun el nombre
  let jugador = juegos.find((juego) => juego.nombre === nombreJugador);

  let data = new google.visualization.DataTable();
  data.addColumn("string", "Dificultad");
  data.addColumn("number", "Partidas");
  data.addRows([
    ["Facil", jugador.partidas[0].ganados + jugador.partidas[0].perdidos],
    ["Avanzado", jugador.partidas[1].ganados + jugador.partidas[1].perdidos],
  ]);

  let options = {
    title: "Partidas jugadas por dificultad",
    backgroundColor: whiteColor,
  };

  let chart = new google.visualization.PieChart(
    document.getElementById("difficultyChart")
  );
  chart.draw(data, options);

  let data2 = new google.visualization.DataTable();
  data2.addColumn("string", "Resultado");
  data2.addColumn("number", "Partidas");
  data2.addRows([
    ["Ganadas", jugador.totalGanados],
    ["Perdidas", jugador.totalPerdidos],
  ]);

  let options2 = {
    title: "Partidas ganadas y perdidas",
    backgroundColor: whiteColor,
  };

  let chart2 = new google.visualization.PieChart(
    document.getElementById("resultChart")
  );
  chart2.draw(data2, options2);

  $("#chartArea").removeClass("hidden");
  $("#chartAreaTitle").removeClass("hidden");
}

function actualizarTabla() {
  /* Esta funcion se encarga de actualizar la tabla de estadisticas de los jugadores */
  let tableHtml = "";
  juegos.forEach((juego) => {
    tableHtml += `<tr>
      <td>${juego.nombre}</td>
      <td>${juego.partidasJugadas}</td>
      <td>${juego.totalGanados}</td>
      <td>${juego.totalPerdidos}</td>
      <td>${juego.porcentajeVictorias.toFixed(2)}%</td>
      <td>
      <button class="btn btn-primary" onclick="dibujarGraficos('${
        juego.nombre
      }')">
      <i class="fas fa-chart-pie"></i>
      Ver Detalles
      </button>
      </td>
    </tr>`;
  });

  $("#playerTable > tbody").html(tableHtml);
}

// Funciones de musica
function playAudio() {
  /* Esta funcion se encarga de reproducir la musica de fondo */
  try {
    var audio = new Audio("assets/audio/Common Fight.ogg");
    audio.loop = true;
    // Delay de un 5 segundos para que no de error
    setTimeout(function () {
      audio.play();
    }, 5000);
  } catch (error) {
    console.log(error);
  }
}

// Eventos de la pagina
$(document).ready(async function () {
  // Cargar palabras de los archivos JSON
  palabrasFaciles = await fetch("./assets/json/easy_words.json").then(
    (response) => response.json()
  );
  palabrasAvanzadas = await fetch("./assets/json/hard_words.json").then(
    (response) => response.json()
  );

  // Cargar libreria de Google Charts
  google.charts.load("current", { packages: ["corechart"] });

  // Eventos de los botones e inputs
  $("#startGame").click(function () {
    nombreJugador = $("#playerName").val();
    dificultad = $("#difficulty").val();

    if (!nombreJugador) {
      alert("Por favor, ingresa tu nombre.");
      return;
    }

    iniciarJuego();

    $("#loginArea").hide();
    $("#statsArea").hide();
    $("#gameArea").removeClass("hidden");
  });

  $("#submitGuess").click(function () {
    let letra = $("#guess").val();
    $("#guess").val("");
    adivinarLetra(letra);
  });

  $("#guess").keypress(function (e) {
    if (e.which === 13) {
      $("#submitGuess").click();
    }
  });

  // Call de funciones al cargar la pagina
  actualizarTabla();
  playAudio();
});
