const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let money = 0;

// камера
let camera = {x:0,y:0};

// игрок
let player = {
  x:200,
  y:200,
  inCar:false
};

// машины
let cars = [];

// объекты
let objects = [];

// деньги
setInterval(()=>{
  money += 10;
  document.getElementById("money").innerText = money;
},1000);

// картинки
const imgs = {
  house: new Image(),
  car: new Image(),
  hospital: new Image(),
  shop: new Image()
};

imgs.house.src = "https://cdn-icons-png.flaticon.com/128/69/69524.png";
imgs.car.src = "https://cdn-icons-png.flaticon.com/128/743/743922.png";
imgs.hospital.src = "https://cdn-icons-png.flaticon.com/128/2967/2967350.png";
imgs.shop.src = "https://cdn-icons-png.flaticon.com/128/3081/3081559.png";

// покупка
function buy(type){
  if(money < 100) return;
  money -= 100;

  let obj = {
    type,
    x: player.x + 100,
    y: player.y
  };

  objects.push(obj);

  if(type === "car"){
    cars.push(obj);
  }
}

// джойстик
let joy = {x:0,y:0};
const stick = document.getElementById("stick");

document.getElementById("joystick").addEventListener("touchmove",(e)=>{
  let t = e.touches[0];
  joy.x = (t.clientX - 70)/30;
  joy.y = (t.clientY - (innerHeight-70))/30;

  stick.style.left = (30 + joy.x*20)+"px";
  stick.style.top = (30 + joy.y*20)+"px";
});

// вход в машину
function tryEnterCar(){
  cars.forEach(car=>{
    let dx = player.x - car.x;
    let dy = player.y - car.y;

    if(Math.abs(dx)<40 && Math.abs(dy)<40){
      player.inCar = true;
      player.car = car;
    }
  });
}

document.addEventListener("click", tryEnterCar);

// обновление
function update(){
  if(player.inCar){
    player.car.x += joy.x*5;
    player.car.y += joy.y*5;
    player.x = player.car.x;
    player.y = player.car.y;
  } else {
    player.x += joy.x*3;
    player.y += joy.y*3;
  }

  // камера следует
  camera.x = player.x - canvas.width/2;
  camera.y = player.y - canvas.height/2;
}

// рисование
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // дороги (сеткой)
  ctx.fillStyle="#999";
  for(let i=-1000;i<2000;i+=200){
    ctx.fillRect(i-camera.x, -1000-camera.y, 40, 3000);
    ctx.fillRect(-1000-camera.x, i-camera.y, 3000, 40);
  }

  // объекты
  objects.forEach(o=>{
    ctx.drawImage(imgs[o.type], o.x-camera.x, o.y-camera.y, 40,40);
  });

  // игрок
  if(!player.inCar){
    ctx.fillStyle="blue";
    ctx.fillRect(player.x-camera.x,player.y-camera.y,20,20);

    ctx.fillStyle="peachpuff";
    ctx.beginPath();
    ctx.arc(player.x-camera.x+10,player.y-camera.y-5,6,0,Math.PI*2);
    ctx.fill();
  }
}

// цикл
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
