const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let money = 0;

// игрок
let player = {x:300, y:300, speed:3};

// мир
let cars = [];
let npcs = [];
let lights = [];

// 💰 деньги
setInterval(()=>{
  money += 20;
  document.getElementById("money").innerText = money;
},1000);

// 🚗 машины
for(let i=0;i<6;i++){
  cars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    dir: Math.random()*2,
    speed:2
  });
}

// 👨 NPC
for(let i=0;i<15;i++){
  npcs.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height
  });
}

// 🚦 светофоры
for(let i=0;i<5;i++){
  lights.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    state: Math.random()>0.5 ? "red":"green"
  });
}

// переключение светофора
setInterval(()=>{
  lights.forEach(l=>{
    l.state = l.state==="red" ? "green":"red";
  });
},3000);

// 🎮 джойстик
let dx=0, dy=0;
const stick = document.getElementById("stick");

document.getElementById("joy").addEventListener("touchmove", e=>{
  let t = e.touches[0];
  dx = (t.clientX-80)/20;
  dy = (t.clientY-(innerHeight-80))/20;

  stick.style.left = (20+dx*5)+"px";
  stick.style.top = (20+dy*5)+"px";
});

document.getElementById("joy").addEventListener("touchend", ()=>{
  dx=dy=0;
  stick.style.left="20px";
  stick.style.top="20px";
});

// 🎨 игра
function draw(){

  ctx.fillStyle="#5fc45f";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // дороги
  ctx.fillStyle="#888";
  for(let i=0;i<canvas.width;i+=150){
    ctx.fillRect(i,0,30,canvas.height);
  }
  for(let i=0;i<canvas.height;i+=150){
    ctx.fillRect(0,i,canvas.width,30);
  }

  // 🚦 светофоры
  lights.forEach(l=>{
    ctx.fillStyle = l.state==="red" ? "red":"lime";
    ctx.fillRect(l.x, l.y, 10,20);
  });

  // 🚗 машины
  ctx.fillStyle="black";
  cars.forEach(c=>{
    c.x += Math.cos(c.dir)*c.speed;
    c.y += Math.sin(c.dir)*c.speed;
    ctx.fillRect(c.x, c.y, 30,15);
  });

  // 👨 NPC
  ctx.fillStyle="yellow";
  npcs.forEach(n=>{
    n.x += Math.random()*2-1;
    n.y += Math.random()*2-1;
    ctx.fillRect(n.x,n.y,10,10);
  });

  // 🧍 игрок
  ctx.fillStyle="blue";
  ctx.fillRect(player.x,player.y,20,20);

  ctx.strokeStyle="white";
  ctx.beginPath();
  ctx.moveTo(player.x+10,player.y+20);
  ctx.lineTo(player.x,player.y+35);
  ctx.moveTo(player.x+10,player.y+20);
  ctx.lineTo(player.x+20,player.y+35);
  ctx.stroke();

  // движение
  player.x += dx*player.speed;
  player.y += dy*player.speed;

  requestAnimationFrame(draw);
}

draw();
