const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let money = 0;

setInterval(()=>{
  money += 10;
  document.getElementById("money").innerText = money;
},1000);

// игрок (человечек)
let player = {x:200, y:200};

// объекты
let objects = [];

// картинки (реальные)
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

  objects.push({
    type,
    x: player.x + 60,
    y: player.y
  });
}

// 🎮 джойстик
let joy = {x:0,y:0};
const stick = document.getElementById("stick");

document.getElementById("joystick").addEventListener("touchmove",(e)=>{
  let t = e.touches[0];
  joy.x = (t.clientX - 70)/30;
  joy.y = (t.clientY - (innerHeight-70))/30;

  stick.style.left = (30 + joy.x*20)+"px";
  stick.style.top = (30 + joy.y*20)+"px";
});

// движение
function update(){
  player.x += joy.x*3;
  player.y += joy.y*3;
}

// рисование
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // объекты
  objects.forEach(o=>{
    ctx.drawImage(imgs[o.type], o.x, o.y, 40,40);
  });

  // человечек
  // тело
  ctx.fillStyle="blue";
  ctx.fillRect(player.x,player.y,20,20);

  // голова
  ctx.fillStyle="peachpuff";
  ctx.beginPath();
  ctx.arc(player.x+10,player.y-5,6,0,Math.PI*2);
  ctx.fill();

  // руки
  ctx.strokeStyle="black";
  ctx.beginPath();
  ctx.moveTo(player.x,player.y+5);
  ctx.lineTo(player.x-10,player.y+15);
  ctx.moveTo(player.x+20,player.y+5);
  ctx.lineTo(player.x+30,player.y+15);
  ctx.stroke();

  // ноги
  ctx.beginPath();
  ctx.moveTo(player.x+5,player.y+20);
  ctx.lineTo(player.x,player.y+30);
  ctx.moveTo(player.x+15,player.y+20);
  ctx.lineTo(player.x+20,player.y+30);
  ctx.stroke();
}

// цикл
function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
