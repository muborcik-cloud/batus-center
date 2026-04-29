const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x87ceeb, 50, 800);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 3000);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const sun = new THREE.DirectionalLight(0xffffff,1);
sun.position.set(200,300,200);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff,0.3));

// земля
const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(3000,3000),
 new THREE.MeshStandardMaterial({color:0x2ecc71})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// город
for(let i=0;i<300;i++){
 let h = Math.random()*150+20;
 let b = new THREE.Mesh(
  new THREE.BoxGeometry(12,h,12),
  new THREE.MeshStandardMaterial({
   color:new THREE.Color().setHSL(Math.random(),0.5,0.5)
  })
 );
 b.position.set(Math.random()*1000-500, h/2, Math.random()*1000-500);
 scene.add(b);
}

// игрок
const player = new THREE.Mesh(
 new THREE.CapsuleGeometry(0.6,2),
 new THREE.MeshStandardMaterial({color:0x0077ff})
);
player.position.y = 2;
scene.add(player);

// физика
let vel = new THREE.Vector3();
let angle = 0;

// управление
let dx=0,dz=0;

document.getElementById("joy").addEventListener("touchmove", e=>{
 let t=e.touches[0];
 dx=(t.clientX-100)/80;
 dz=(t.clientY-(innerHeight-100))/80;
});

document.addEventListener("mousemove", e=>{
 angle += e.movementX*0.002;
});

// NPC
let npcs=[];
for(let i=0;i<60;i++){
 let n = player.clone();
 n.material = new THREE.MeshStandardMaterial({color:0x00ff00});
 n.position.set(Math.random()*500-250,2,Math.random()*500-250);
 scene.add(n);
 npcs.push(n);
}

// полиция
let police=[];
for(let i=0;i<10;i++){
 let p = new THREE.Mesh(
  new THREE.BoxGeometry(2,1,4),
  new THREE.MeshStandardMaterial({color:0x0000ff})
 );
 p.position.set(Math.random()*500-250,0,Math.random()*500-250);
 scene.add(p);
 police.push(p);
}

// машина
const car = new THREE.Mesh(
 new THREE.BoxGeometry(2,1,4),
 new THREE.MeshStandardMaterial({color:0xff0000})
);
car.position.set(5,0,5);
scene.add(car);

let inCar=false;
let carVel=0;

// стрельба
let bullets=[];
document.addEventListener("click", ()=>{
 let b = new THREE.Mesh(
  new THREE.SphereGeometry(0.2),
  new THREE.MeshBasicMaterial({color:0xffff00})
 );
 b.position.copy(player.position);
 b.vel = new THREE.Vector3(Math.sin(angle),0,Math.cos(angle)).multiplyScalar(2);
 scene.add(b);
 bullets.push(b);
});

// вход в машину
document.addEventListener("dblclick", ()=>{
 if(player.position.distanceTo(car.position)<4){
  inCar=!inCar;
 }
});

// параметры
let hp=100;
let money=0;
let wanted=0;

setInterval(()=>{
 money+=10;
 document.getElementById("money").innerText=money;
},1000);

// цикл
function update(){

 if(!inCar){
  vel.x += Math.sin(angle)*dx*0.05;
  vel.z += Math.cos(angle)*dx*0.05;

  player.position.add(vel);
  vel.multiplyScalar(0.9);

 }else{
  carVel += dz*0.05;
  carVel *= 0.95;

  car.position.x += Math.sin(angle)*carVel;
  car.position.z += Math.cos(angle)*carVel;

  player.position.copy(car.position);

  if(Math.abs(carVel)>0.3) wanted+=0.02;
 }

 // NPC идут к игроку
 npcs.forEach(n=>{
  let dir = new THREE.Vector3().subVectors(player.position,n.position).normalize();
  n.position.add(dir.multiplyScalar(0.03));
 });

 // полиция
 police.forEach(p=>{
  p.position.lerp(player.position,0.02);

  if(p.position.distanceTo(player.position)<3){
   player.position.set(0,2,0);
   wanted=0;
  }
 });

 // пули
 bullets.forEach(b=>{
  b.position.add(b.vel);
 });

 // урон
 if(vel.length()>0.8){
  hp-=0.2;
  if(hp<=0){
   hp=100;
   player.position.set(0,2,0);
  }
 }

 document.getElementById("hp").innerText=Math.floor(hp);
 document.getElementById("wanted").innerText=wanted.toFixed(1);

 // камера
 camera.position.x = player.position.x + Math.sin(angle+1)*15;
 camera.position.z = player.position.z + Math.cos(angle+1)*15;
 camera.position.y = player.position.y + 8;
 camera.lookAt(player.position);
}

// рендер
function animate(){
 requestAnimationFrame(animate);
 update();
 renderer.render(scene,camera);
}

animate();
