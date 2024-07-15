// Variables globales
var palabrasFaciles = []; // Array de palabras faciles
var palabrasAvanzadas = []; // Array de palabras avanzadas
var palabraSeleccionada = ""; // Palabra seleccionada de manera aleatoria
var pistasPalabraSeleccionada = []; // Pistas de la palabra seleccionada
var intentos = 0; // Intentos restantes
var palabraMostrada = ""; // Palabra oculta que se va mostrando con las letras adivinadas
var nombreJugador = ""; // Nombre del jugador
var dificultad = ""; // Dificultad seleccionada
var isPlayingSound = false; // Variable que indica si la musica esta sonando o no
var audio = new Audio("assets/audio/Common Fight.ogg"); // Musica de fondo

var FrasesWin = [
  "¡Eres un ganador!",
  "¡Bien hecho!",
  "¡Excelente trabajo!",
  "¡Eres un campeón!",
  "¡Eres un genio!",
  "¡Eres un maestro!",
  "¡Eres un experto!",
  "¡Eres un héroe!",
  "¡Eres un crack!",
  "¡Eres un as!",
  "¡Eres un prodigio!",
];

var FrasesLose = [
  "¡No te rindas!",
  "¡Sigue intentando!",
  "¡No te desanimes!",
  "¡Sigue adelante!",
  "¡No te preocupes!",
  "¡Sigue practicando!",
  "¡No te desesperes!",
  "¡Sigue luchando!",
  "¡No te desalientes!",
  "¡Sigue esforzándote!",
  "¡No te desmotives!",
];

// Datos de los jugadores
var juegos = [
  {
    nombre: "Mauricio",
    partidasJugadas: 9,
    totalGanados: 3,
    totalPerdidos: 6,
    totalAbandonados: 0,
    porcentajeVictorias: 33.33,
    partidas: [
      {
        dificultad: "facil",
        ganados: 2,
        perdidos: 3,
        abandonados: 0,
      },
      {
        dificultad: "avanzado",
        ganados: 1,
        perdidos: 3,
        abandonados: 0,
      },
    ],
  },
  {
    nombre: "Eduardo",
    partidasJugadas: 7,
    totalGanados: 2,
    totalPerdidos: 4,
    totalAbandonados: 1,
    porcentajeVictorias: 28.57,
    partidas: [
      {
        dificultad: "facil",
        ganados: 1,
        perdidos: 2,
        abandonados: 0,
      },
      {
        dificultad: "avanzado",
        ganados: 1,
        perdidos: 2,
        abandonados: 0,
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
    $("#winMessage").text(
      FrasesWin[Math.floor(Math.random() * FrasesWin.length)]
    );
    $("#winModal").css("display", "block");
    registrarEstadistica(true);
    resetGame();
  } else if (intentos <= 0) {
    // Si se acabaron los intentos, mostrar mensaje de derrota y registrar estadistica
    $("#loseMessage").text(
      FrasesLose[Math.floor(Math.random() * FrasesLose.length)]
    );
    $("#loseModal").css("display", "block");
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
function registrarEstadistica(ganado, abandonado = false) {
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
      totalAbandonados: 0,
      porcentajeVictorias: 0,
      partidas: [
        {
          dificultad: "facil",
          ganados: 0,
          perdidos: 0,
          abandonados: 0,
        },
        {
          dificultad: "avanzado",
          ganados: 0,
          perdidos: 0,
          abandonados: 0,
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
  if (ganado && !abandonado) {
    jugadorStats.totalGanados++;
    partidaStats.ganados++;
  }

  // Si perdio, aumentar las partidas perdidas
  if (!ganado && !abandonado) {
    jugadorStats.totalPerdidos++;
    partidaStats.perdidos++;
  }

  // Si abandono, aumentar las partidas abandonadas
  if (abandonado) {
    jugadorStats.totalAbandonados++;
    partidaStats.abandonados++;
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
    [
      "Facil",
      jugador.partidas[0].ganados +
        jugador.partidas[0].perdidos +
        jugador.partidas[0].abandonados,
    ],
    [
      "Avanzado",
      jugador.partidas[1].ganados +
        jugador.partidas[1].perdidos +
        jugador.partidas[1].abandonados,
    ],
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
    ["Abandonadas", jugador.totalAbandonados],
  ]);

  let options2 = {
    title: "Partidas Jugadas por Resultado",
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
  let sortedJuegos = juegos.sort(
    (a, b) => b.porcentajeVictorias - a.porcentajeVictorias
  );
  let tableHtml = "";
  sortedJuegos.forEach((juego) => {
    tableHtml += `<tr>
      <td>${juego.nombre}</td>
      <td>${juego.partidasJugadas}</td>
      <td>${juego.totalGanados}</td>
      <td>${juego.totalPerdidos}</td>
      <td>${juego.totalAbandonados}</td>
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

// Eventos de la pagina
$(document).ready(function () {
  // Cargar palabras de los archivos JSON
  fetch("./assets/json/easy_words.json").then((response) =>
    response.json().then((data) => {
      palabrasFaciles = data;
    })
  );
  fetch("./assets/json/hard_words.json").then((response) =>
    response.json().then((data) => {
      palabrasAvanzadas = data;
    })
  );

  // Cargar libreria de Google Charts
  google.charts.load("current", { packages: ["corechart"] });

  // Eventos de los botones e inputs
  $("#startGame").click(function () {
    nombreJugador = $("#playerName").val();
    dificultad = $("#difficulty").val();

    if (!nombreJugador) {
      $("#errorMessage").text("Por favor, ingresa tu nombre.");
      $("#errorModal").css("display", "block");
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

  $("#giveUp").click(function () {
    $("#confirmMessage").text("¿Estás seguro que deseas abandonar la partida?");
    $("#confirmModal").css("display", "block");

    $("#confirmYes").click(function () {
      registrarEstadistica(false, true);
      resetGame();
      $("#confirmModal").css("display", "none");
      $("#confirmYes").off("click");
    });

    $("#confirmNo").click(function () {
      $("#confirmModal").css("display", "none");
      $("#confirmNo").off("click");
    });

    $("#confirmModal").click(function (e) {
      if (e.target === this) {
        $(this).css("display", "none");
      }
      $("#confirmYes").off("click");
    });
  });

  $("#guess").keypress(function (e) {
    if (e.which === 13) {
      $("#submitGuess").click();
    }
  });

  // Funciones de musica
  $("#playPause").click(function () {
    if (isPlayingSound) {
      audio.pause();
      $("#playPause").html('<i class="fas fa-play"></i>');
    }
    if (!isPlayingSound) {
      audio.loop = true;
      audio.play();
      $("#playPause").html('<i class="fas fa-pause"></i>');
    }
    isPlayingSound = !isPlayingSound;
  });

  $("#volume").change(function () {
    audio.volume = $(this).val();
  });

  $("#btnAudioPlayer").click(function () {
    $("#audioPlayer").removeClass("hidden");
    $("#btnAudioPlayer").addClass("hidden");
  });

  $("#closeAudioPlayer").click(function () {
    $("#audioPlayer").addClass("hidden");
    $("#btnAudioPlayer").removeClass("hidden");
  });

  $("#playPause").click();

  // Eventos de los modals
  $(".close").click(function () {
    $(".modal").css("display", "none");
  });

  $(".modal").click(function (e) {
    if (e.target === this) {
      $(this).css("display", "none");
    }
  });

  // Call de funciones al cargar la pagina
  actualizarTabla();
});
