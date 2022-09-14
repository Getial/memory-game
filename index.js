//apuntadores HTML
const home_screen = document.getElementById("home-screen");
const btns_dificulty_container = document.getElementById("btns-dificulty-container");
const alert_screen_ng = document.getElementById("alert-screen-ng");
const alert_screen_dificulty = document.getElementById("alert-screen-dificulty");
const game_container = document.getElementById("game-container");
const cards_container = document.getElementById("cards-container");
const finished_screen = document.getElementById("finished-screen");
const timekeeper = document.getElementById("timekeeper");
const btn_start = document.getElementById("btn-empezar");
const btn_yes_ng = document.getElementById("btn-yes-ng");
const btn_no_ng = document.getElementById("btn-no-dificulty");
const btn_yes_dificulty = document.getElementById("btn-yes-dificulty");
const btn_no_dificulty = document.getElementById("btn-no-ng");
const btn_play = document.getElementById("buttonPlay");
const btn_restart = document.getElementById("buttonRestart");
const btn_gth = document.getElementById("buttonGoToHome");
const btn_new_game = document.getElementById("btn-new-game");
const btn_set_dificulty = document.getElementById("btn-set-dificulty");
const btn_close_set = document.getElementById("close-set-dificulty");
const btn_dificulty_easy = document.getElementById("btn-dificulty-easy");
const btn_dificulty_normal = document.getElementById("btn-dificulty-normal");
const btn_dificulty_hard = document.getElementById("btn-dificulty-hard");
const btn_continue = document.getElementById("btn-continue");
const btn_continue_last = document.getElementById("btn-continue-last");
const icon_pause = document.getElementById("pause");
const icon_play = document.getElementById("play");
const txtMoves = document.getElementById("moves");
const txtTimeTotal = document.getElementById("txt-time-total");
const txtMovesTotal = document.getElementById("txt-moves-total");
const txt_dificulty_home = document.getElementById("txt-dificulty-home");
const txt_dificulty_finished = document.getElementById("txt-dificulty-finished");

//listteners 
btn_start.addEventListener("click", startGame); //boton de empezar partida
btn_set_dificulty.addEventListener("click", showSetDificulty) // boton para mostrar el menu de dificultad
btn_close_set.addEventListener('click', closeSetDificulty)
btn_dificulty_easy.addEventListener("click", setDificultyEasy) // boton ajustar dificultad facil
btn_dificulty_normal.addEventListener("click", setDificultyNormal) // boton ajustar dificultad normal
btn_dificulty_hard.addEventListener("click", setDificultyHard) // boton ajustar dificultad dificil
btn_play.addEventListener("click", pauseGame) //boton para pausar partida
btn_restart.addEventListener('click', restartGame) //boton para reiniciar la partida
btn_gth.addEventListener('click', goToHome); // ir al home screen
btn_new_game.addEventListener('click', newGame) //boton para empezar una nueva partida
btn_continue.addEventListener('click', pauseGame) // continuar juego
btn_continue_last.addEventListener('click', continueLastGame) // continuar juego en curso
btn_yes_ng.addEventListener('click', restartGame) // cerrar ultimo juego e iniciar uno nuevo
btn_no_ng.addEventListener('click', closeAlertScreen) // no iniciar nueva partida
btn_yes_dificulty.addEventListener('click', changeDificulty) // cerrar ultimo juego e iniciar uno nuevo
btn_no_dificulty.addEventListener('click', closeAlertScreen) // no iniciar nueva partida

//variables para hacer la comparacion
var flag = 0;
var first_uid = 0;
var first_img;
var first_element;

//variables para el cronometro
var sec = 0;
var min = 0;
var t;

//otras variables
var couples = 0;
var runGame = false;
var moves = 0;
var dificulty = "easy"
var poss_dificulty = ""; 
var list;

//generar secuencia
function generarSecuencia () {
  const secuencia = [];
  for (let index = 0; index < 16; index++) {
    secuencia.push(index);
  }
  const unorderedList = secuencia.sort(function() {return Math.random() - 0.5})
  return unorderedList
}

async function getImages() {
  const unorderedList = generarSecuencia();
  const response = await fetch('./list.json')
  const list = await response.json();
  couples = await list.length;
  const orderList = [];
  list.map(item => {
    orderList.push({
      ...item,
      position: unorderedList.shift()
    })
  })
  list.map(item => {
    orderList.push({
      ...item,
      position: unorderedList.shift()
    })
  })

  orderList.sort((a,b) => {
    return a.position - b.position
  })
  // dibujar(orderList)
  return orderList
}

function dibujar(orderList) {
  cards_container.innerHTML = '';
  let html = '';
  orderList.map ( item => {
    html += `
    <div id=${item.position} onClick="girar(${item.position}, ${item.uid})"> 
      <img src=${item.url} alt=${item.name} class="invisible" />
    </div>
    `

  })
  cards_container.innerHTML = html;
}

function tick() {
  sec++;
  if(sec >= 60) {
    sec = 0;
    min++;
  }
}

function add() {
  tick();
  timekeeper.textContent = (min > 9 ? min : "0" + min)
                   + ":" + (sec > 9 ? sec : "0" + sec)
  timer();
}
function timer() {
  t = setTimeout(add, 1000);
  runGame = true;
}

async function startGame() {
  if(runGame) {
    alert_screen_ng.classList.remove("disabled-screen");
    home_screen.classList.add("disabled-screen");
  } else {
    home_screen.classList.add("disabled-screen");
    alert_screen_ng.classList.add("disabled-screen");
    game_container.classList.remove("disabled-screen");
    icon_pause.style.display = "flex";
    icon_play.style.display = "none";
    // btn_continue.classList.add("disabled-screen");
    // cards_container.classList.remove("disabled-screen");
    list = await getImages()
    dibujar(list)
    timer()
  }
}

function pauseGame() {
  if(runGame) {
    clearInterval(t);
    runGame = false;
    icon_pause.style.display = "none";
    icon_play.style.display = "flex";
    btn_continue.classList.remove("disabled-screen");
    cards_container.classList.add("disabled-screen");
  } else {
    timer()
    icon_pause.style.display = "flex";
    icon_play.style.display = "none";
    btn_continue.classList.add("disabled-screen");
    cards_container.classList.remove("disabled-screen");
  }
}

function restartGame() {
  clearInterval(t)
  sec = 0;
  min = 0;
  moves = 0;
  timekeeper.textContent = "00:00"
  txtMoves.textContent = "0"
  runGame = false;
  startGame();
}

function newGame() {
  game_container.classList.remove("disabled-screen");
  finished_screen.classList.add("disabled-screen");
  restartGame();
}

function girar(position, uid){
  const element = document.getElementById(position)
  const img = element.children[0]
  img.classList.remove("invisible")
  element.classList.add("disabledbutton")

  if(flag === 0) {
    first_uid = uid;
    first_img = img;
    first_element = element
  }
  else if(flag === 1) {
    if(first_uid === uid) { // si la carta era el par
      first_img.classList.add("found-pair")
      img.classList.add("found-pair")
      couples--;
      if(couples === 0){  //si gano y/o termino el juego
        clearInterval(t);
        game_container.classList.add("disabled-screen");
        txtTimeTotal.textContent = (min > 9 ? min : "0" + min)
                   + ":" + (sec > 9 ? sec : "0" + sec)
        txtMovesTotal.textContent = moves;
        txt_dificulty_finished.textContent = dificulty;
        finished_screen.classList.remove("disabled-screen");
      }
    }
    else {  // si la carta no era el par

      cards_container.classList.add('disabledbutton')

      switch (dificulty) {
        case "easy":
          setTimeout(() => {
            img.classList.add("invisible")
            first_img.classList.add("invisible")
            element.classList.remove("disabledbutton")
            first_element.classList.remove("disabledbutton")
            cards_container.classList.remove('disabledbutton')
          }, 500);
          break;

        case "normal":
          couples = list.length/2
          setTimeout(() => {
            element.classList.remove("disabledbutton")
            first_element.classList.remove("disabledbutton")
            cards_container.classList.remove('disabledbutton')
            dibujar(list)
          }, 500);
          break;

        case "hard":
          couples = list.length/2
          element.classList.remove("disabledbutton")
          first_element.classList.remove("disabledbutton")
          cards_container.classList.remove('disabledbutton')
          dibujar(list)
          break;
      }
      
    }
    flag = -1;
    moves++;
    txtMoves.textContent = moves;
  }
  flag ++;
}

function showSetDificulty() {
  home_screen.classList.add("disabled-screen");
  btns_dificulty_container.classList.remove("disabled-screen");
}
function closeSetDificulty() {
  home_screen.classList.remove("disabled-screen");
  btns_dificulty_container.classList.add("disabled-screen");
}

function setDificulty(dif) {
  if(runGame) {
    showAlertSetDificulty();
    poss_dificulty = dif;
  } else {
    home_screen.classList.remove("disabled-screen");
    btns_dificulty_container.classList.add("disabled-screen");
    dificulty = dif;
    txt_dificulty_home.textContent = dificulty
  }
}
function changeDificulty() {
  dificulty = poss_dificulty;
  runGame = false;
  moves = 0;
  sec = 0;
  min = 0;
  timekeeper.textContent = "00:00"
  txtMoves.textContent = "0"
  home_screen.classList.remove("disabled-screen");
  btns_dificulty_container.classList.add("disabled-screen");
  alert_screen_dificulty.classList.add("disabled-screen");
  btn_continue_last.style.display = "none";
  txt_dificulty_home.textContent = dificulty;
}
function setDificultyEasy(){
  setDificulty("easy")
}
function setDificultyNormal(){
  setDificulty("normal")
}
function setDificultyHard(){
  setDificulty("hard")
}

function showAlertSetDificulty() {
  alert_screen_dificulty.classList.remove("disabled-screen");
  btns_dificulty_container.classList.add("disabled-screen")
}

function goToHome() {
  runGame = true;
  btn_continue_last.style.display = "initial";
  clearInterval(t);
  btn_continue.classList.add("disabled-screen");
  game_container.classList.add("disabled-screen");
  home_screen.classList.remove("disabled-screen");
}

function continueLastGame() {
  game_container.classList.remove("disabled-screen");
  home_screen.classList.add("disabled-screen");
  runGame = false;
  pauseGame();
}

function closeAlertScreen() {
  alert_screen_ng.classList.add("disabled-screen");
  alert_screen_dificulty.classList.add("disabled-screen");
  home_screen.classList.remove("disabled-screen");
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === 'visible' && runGame && !(game_container.classList.contains("disabled-screen"))) {
    timer();
  } 
  else {
    clearInterval(t);
  }
});