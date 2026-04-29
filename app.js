const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let money = 0;

// игрок
let player = {
  x:200,
  y:200,
  inCar:false,
  car:null
};

// объекты
let objects = [];
let cars = [];

// 💰 деньги
setInterval(()=>{
  money += 10;
  document.getElementById("money").innerText = money;
},1000);

// картинки
const imgs = {
 house:"https://cdn-icons-png.flaticon.com/512/69/69524.png",
 shop:"https://cdn-icons-png.flaticon.com/512/34/34627.png",
 hospital:"https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
 car:"https://cdn-icons-png.flaticon.com/512/743/743922.png"
};

// покупка
function buy(type){
 if(money < 100) return;
 money -= 100;

 let obj = {
   type,
   x: player.x+60,
   y: player.y
 };

 objects.push(obj);

 if(type==="car") cars.push(obj);
}

// 🎮 джойстик
let dx=0, dy=0;
const stick = document.getElementById("stick");

document.getElementById("joy").addEventListener("touchmove", e=>{
 let t = e.touches[0];

 dx = (t.clientX-80)/20;
 dy = (t.clientY-(innerHeight-80))/20;

 stick.style.left = (30+dx*10)+"px";
 stick.style.top = (30+dy*10)+"px";
});

document.getElementById("joy").addEventListener("touchend", ()=>{
 dx=0; dy=0;
 stick.style.left="30px";
 stick.style.top="30px";
});

// сесть в машину
document.addEventListener("click", ()=>{
 cars.forEach(c=>{
   if(Math.abs(player.x-c.x)<40 && Math.abs(player.y-c.y)<40){
     player.inCar = true;
     player.car = c;
   }
 });
});

// движение
function update(){
 if(player.inCar){
   player.car.x += dx*5;
   player.car.y += dy*5;
   player.x = player.car.x;
   player.y = player.car.y;
 } else {
   player.x += dx*3;
   player.y += dy*3;
 }
}

// рисование
function draw(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

 // дороги
 ctx.fillStyle="#888";
 for(let i=0;i<canvas.width;i+=150){
   ctx.fillRect(i,0,40,canvas.height);
 }
 for(let i=0;i<canvas.height;i+=150){
   ctx.fillRect(0,i,canvas.width,40);
 }

 // объекты
 objects.forEach(o=>{
   let img = new Image();
   img.src = imgs[o.type];
   ctx.drawImage(img, o.x, o.y, 50,50);
 });

 // игрок (человечек)
 if(!player.inCar){
   ctx.fillStyle="blue";
   ctx.fillRect(player.x,player.y,20,20);

   ctx.fillStyle="peachpuff";
   ctx.beginPath();
   ctx.arc(player.x+10,player.y-5,6,0,Math.PI*2);
   ctx.fill();

   ctx.strokeStyle="black";
   ctx.beginPath();
   ctx.moveTo(player.x,player.y+10);
   ctx.lineTo(player.x-10,player.y+20);
   ctx.moveTo(player.x+20,player.y+10);
   ctx.lineTo(player.x+30,player.y+20);
   ctx.moveTo(player.x+5,player.y+20);
   ctx.lineTo(player.x,player.y+30);
   ctx.moveTo(player.x+15,player.y+20);
   ctx.lineTo(player.x+20,player.y+30);
   ctx.stroke();
 }

 requestAnimationFrame(loop);
}

function loop(){
 update();
 draw();
}
loop();
