//apuntadores HTML
const home_container = document.getElementById("home-container");
const game_container = document.getElementById("game-container");
const cards_container = document.getElementById("cards-container");
const timekeeper = document.getElementById("timekeeper");
const btn_empezar = document.getElementById("btn-empezar");
const btn_play = document.getElementById("buttonPlay");
const btn_restart = document.getElementById("buttonRestart")
const puase = document.getElementById("pause");
const play = document.getElementById("play");
const txtMoves = document.getElementById("moves");
const txtPause = document.getElementById("txt_pause");

//listteners 
btn_empezar.addEventListener("click", startGame); //boton de empezar partida
btn_play.addEventListener("click", pauseGame) //boton para pausar partida
btn_restart.addEventListener('click', restartGame) //boton para reiniciar la partida

//generar secuencia
function generarSecuencia () {
  const secuencia = [];
  for (let index = 0; index < 16; index++) {
    secuencia.push(index);
  }
  const unorderedList = secuencia.sort(function() {return Math.random() - 0.5})
  return unorderedList
}

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
  dibujar(orderList)
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
    if(first_uid === uid) {
      first_img.classList.add("found-pair")
      img.classList.add("found-pair")
      couples--;
      if(couples === 0){
        clearInterval(t)
      }
    }
    else { 
      cards_container.classList.add('disabledbutton')
      setTimeout(() => {
        img.classList.add("invisible")
        first_img.classList.add("invisible")
        element.classList.remove("disabledbutton")
        first_element.classList.remove("disabledbutton")
        cards_container.classList.remove('disabledbutton')
      }, 500);
    }
    flag = -1;
    moves++;
    txtMoves.textContent = moves;
  }
  flag ++;
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

function startGame() {
  home_container.classList.add("disabled-screen");
  game_container.classList.remove("disabled-screen");
  puase.style.display = "flex";
  play.style.display = "none";
  txtPause.classList.add("disabled-screen");
  cards_container.classList.remove("disabled-screen");
  getImages()
  timer()
}

function pauseGame() {
  if(runGame) {
    clearInterval(t);
    runGame = false;
    puase.style.display = "none";
    play.style.display = "flex";
    txtPause.classList.remove("disabled-screen");
    cards_container.classList.add("disabled-screen");
  } else {
    timer()
    puase.style.display = "flex";
    play.style.display = "none";
    txtPause.classList.add("disabled-screen");
    cards_container.classList.remove("disabled-screen");
  }
}

function restartGame() {
  clearInterval(t)
  timekeeper.textContent = "00:00"
  sec = 0;
  min = 0;
  moves = 0;
  txtMoves.textContent = "0"
  startGame();
}