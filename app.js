const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// камера
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,10,15);

// рендер
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(20,30,10);
scene.add(light);

// земля
const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(500,500),
 new THREE.MeshStandardMaterial({color:0x55aa55})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// дороги
const roadMat = new THREE.MeshStandardMaterial({color:0x333333});
for(let i=-200;i<200;i+=30){
 let r1 = new THREE.Mesh(new THREE.BoxGeometry(6,0.1,500), roadMat);
 r1.position.x = i;
 scene.add(r1);

 let r2 = new THREE.Mesh(new THREE.BoxGeometry(500,0.1,6), roadMat);
 r2.position.z = i;
 scene.add(r2);
}

// здания (башни)
let houses = [];
for(let i=0;i<40;i++){
 let h = Math.random()*40+20;
 let b = new THREE.Mesh(
  new THREE.BoxGeometry(10,h,10),
  new THREE.MeshStandardMaterial({color:0x111111})
 );
 b.position.set(Math.random()*200-100, h/2, Math.random()*200-100);
 scene.add(b);
 houses.push(b);
}

// игрок (человек)
const player = new THREE.Group();

// тело
const body = new THREE.Mesh(
 new THREE.BoxGeometry(1,2,0.5),
 new THREE.MeshStandardMaterial({color:0x0000ff})
);
body.position.y = 2;
player.add(body);

// голова
const head = new THREE.Mesh(
 new THREE.SphereGeometry(0.5),
 new THREE.MeshStandardMaterial({color:0xffcc99})
);
head.position.y = 3.5;
player.add(head);

// руки
const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.3,1,0.3), body.material);
arm1.position.set(-0.8,2.2,0);
player.add(arm1);

const arm2 = arm1.clone();
arm2.position.x = 0.8;
player.add(arm2);

// ноги
const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.4,1,0.4), body.material);
leg1.position.set(-0.3,1,0);
player.add(leg1);

const leg2 = leg1.clone();
leg2.position.x = 0.3;
player.add(leg2);

scene.add(player);

// NPC люди
let npcs = [];
for(let i=0;i<10;i++){
 let npc = player.clone();
 npc.position.set(Math.random()*100-50,0,Math.random()*100-50);
 scene.add(npc);
 npcs.push(npc);
}

// светофоры
let lights = [];
for(let i=0;i<10;i++){
 let l = new THREE.Mesh(
  new THREE.BoxGeometry(0.5,3,0.5),
  new THREE.MeshStandardMaterial({color:0xff0000})
 );
 l.position.set(Math.random()*100-50,1.5,Math.random()*100-50);
 scene.add(l);
 lights.push(l);
}

// машины
let cars = [];
let currentCar = null;

function buyCar(){
 if(money < 100) return;
 money -= 100;

 let car = new THREE.Mesh(
  new THREE.BoxGeometry(2,1,4),
  new THREE.MeshStandardMaterial({color:0xff0000})
 );
 car.position.copy(player.position);
 scene.add(car);
 cars.push(car);
}

// вход в дом
let inside = false;
function enterHouse(){
 inside = !inside;
 if(inside){
  camera.position.set(0,5,0);
 } else {
  camera.position.set(0,10,15);
 }
}

// деньги
let money = 0;
setInterval(()=>{
 money += 5;
 document.getElementById("money").innerText = money;
},1000);

// день/ночь
let t=0;
function dayNight(){
 t+=0.01;
 let val = (Math.sin(t)+1)/2;
 scene.background = new THREE.Color(val, val, val+0.2);
}
setInterval(dayNight,50);

// джойстик
let dx=0, dz=0;
const stick = document.getElementById("stick");

document.getElementById("joy").addEventListener("touchmove", e=>{
 let t = e.touches[0];
 dx = (t.clientX-80)/50;
 dz = (t.clientY-(innerHeight-80))/50;

 stick.style.left = (30+dx*20)+"px";
 stick.style.top = (30+dz*20)+"px";
});

document.getElementById("joy").addEventListener("touchend", ()=>{
 dx=0; dz=0;
 stick.style.left="30px";
 stick.style.top="30px";
});

// клик — сесть в машину
document.addEventListener("click", ()=>{
 cars.forEach(c=>{
  if(player.position.distanceTo(c.position)<3){
   currentCar = c;
  }
 });
});

// игра
function animate(){
 requestAnimationFrame(animate);

 if(currentCar){
  currentCar.position.x += dx*0.5;
  currentCar.position.z += dz*0.5;
  player.position.copy(currentCar.position);
 } else {
  player.position.x += dx*0.2;
  player.position.z += dz*0.2;
 }

 // камера
 camera.position.x = player.position.x + 10;
 camera.position.z = player.position.z + 10;
 camera.lookAt(player.position);

 renderer.render(scene,camera);
}

animate();
