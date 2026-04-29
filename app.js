const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let money = 0;
let houses = [];
let cars = [];
let coins = [];

const player = {
  x: 200,
  y: 200,
  size: 20,
  speed: 3
};

// управление
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// деньги
setInterval(() => {
  money += 10;
  updateUI();
}, 1000);

// монеты
function spawnCoin(){
  coins.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height
  });
}
setInterval(spawnCoin, 1500);

// покупки
function buyHouse(){
  if(money >= 200){
    money -= 200;
    houses.push({x:player.x+50, y:player.y});
  }
}
function buyCar(){
  if(money >= 300){
    money -= 300;
    cars.push({x:player.x+50, y:player.y});
  }
}

// обновление UI
function updateUI(){
  document.getElementById("money").innerText = money;
  document.getElementById("houses").innerText = houses.length;
  document.getElementById("cars").innerText = cars.length;
}

// логика
function update(){
  if(keys["ArrowUp"]) player.y -= player.speed;
  if(keys["ArrowDown"]) player.y += player.speed;
  if(keys["ArrowLeft"]) player.x -= player.speed;
  if(keys["ArrowRight"]) player.x += player.speed;

  // сбор монет
  coins = coins.filter(c => {
    let dx = player.x - c.x;
    let dy = player.y - c.y;
    if(Math.abs(dx)<20 && Math.abs(dy)<20){
      money += 50;
      return false;
    }
    return true;
  });
}

// рисование
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // монеты
  ctx.fillStyle = "yellow";
  coins.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 8, 0, Math.PI*2);
    ctx.fill();
  });

  // дома
  ctx.fillStyle = "brown";
  houses.forEach(h => {
    ctx.fillRect(h.x, h.y, 30, 30);
  });

  // машины
  ctx.fillStyle = "red";
  cars.forEach(c => {
    ctx.fillRect(c.x, c.y, 40, 20);
  });

  // игрок (уже как человечек)
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, 20, 20);

  // голова
  ctx.fillStyle = "peachpuff";
  ctx.beginPath();
  ctx.arc(player.x+10, player.y-5, 6, 0, Math.PI*2);
  ctx.fill();
}

// главный цикл
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
