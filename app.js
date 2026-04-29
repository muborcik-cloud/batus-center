const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 2000);
camera.position.set(0,6,10);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,100,50);
scene.add(light);

// земля
const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(1000,1000),
 new THREE.MeshStandardMaterial({color:0x228B22})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// дороги
const roadMat = new THREE.MeshStandardMaterial({color:0x222222});
for(let i=-200;i<200;i+=40){
 let r1 = new THREE.Mesh(new THREE.BoxGeometry(8,0.1,1000), roadMat);
 r1.position.x = i;
 scene.add(r1);

 let r2 = new THREE.Mesh(new THREE.BoxGeometry(1000,0.1,8), roadMat);
 r2.position.z = i;
 scene.add(r2);
}

// здания
for(let i=0;i<60;i++){
 let h = Math.random()*60+20;
 let b = new THREE.Mesh(
  new THREE.BoxGeometry(10,h,10),
  new THREE.MeshStandardMaterial({color:0x333333})
 );
 b.position.set(Math.random()*400-200, h/2, Math.random()*400-200);
 scene.add(b);
}

// ЗДОРОВЬЕ
let hp = 100;
function updateHP(){
 document.getElementById("hp").innerText = hp;
}
updateHP();

// БОЛЬНИЦА
const hospital = new THREE.Mesh(
 new THREE.BoxGeometry(20,10,20),
 new THREE.MeshStandardMaterial({color:0xffffff})
);
hospital.position.set(0,5,0);
scene.add(hospital);

// ИГРОК (модель)
let player = new THREE.Group();
scene.add(player);

const loader = new THREE.GLTFLoader();

// модель человека
loader.load(
 "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
 (gltf)=>{
  player.add(gltf.scene);
  gltf.scene.scale.set(0.5,0.5,0.5);
 }
);

// МАШИНА
let car = new THREE.Mesh(
 new THREE.BoxGeometry(2,1,4),
 new THREE.MeshStandardMaterial({color:0xff0000})
);
car.visible = false;
scene.add(car);

let inCar = false;

// ПОЛИЦИЯ
let police = [];
for(let i=0;i<3;i++){
 let p = new THREE.Mesh(
  new THREE.BoxGeometry(1,2,1),
  new THREE.MeshStandardMaterial({color:0x0000ff})
 );
 p.position.set(Math.random()*50,1,Math.random()*50);
 scene.add(p);
 police.push(p);
}

// деньги
let money = 0;
setInterval(()=>{
 money+=5;
 document.getElementById("money").innerText = money;
},1000);

// купить машину
function buyCar(){
 if(money < 100) return;
 money -= 100;
 car.visible = true;
 car.position.copy(player.position);
}

// управление
let dx=0,dz=0;

document.getElementById("joy").addEventListener("touchmove", e=>{
 let t = e.touches[0];
 dx = (t.clientX-80)/50;
 dz = (t.clientY-(innerHeight-80))/50;
});

document.getElementById("joy").addEventListener("touchend", ()=>{
 dx=0; dz=0;
});

// посадка в машину
document.addEventListener("click", ()=>{
 if(car.visible && player.position.distanceTo(car.position)<3){
  inCar = !inCar;
 }
});

// урон при движении
function damage(){
 if(Math.abs(dx)+Math.abs(dz) > 1.5){
  hp -= 0.2;
  if(hp <= 0){
   // телепорт в больницу
   player.position.set(0,0,0);
   hp = 100;
  }
  updateHP();
 }
}

// полиция ловит
function policeAI(){
 police.forEach(p=>{
  let d = p.position.distanceTo(player.position);
  if(d < 5){
   player.position.set(0,0,0); // тюрьма (центр)
  }
 });
}

// игра
function animate(){
 requestAnimationFrame(animate);

 if(inCar){
  car.position.x += dx*0.5;
  car.position.z += dz*0.5;
  player.position.copy(car.position);
 } else {
  player.position.x += dx*0.2;
  player.position.z += dz*0.2;
 }

 damage();
 policeAI();

 camera.position.x = player.position.x + 8;
 camera.position.z = player.position.z + 8;
 camera.lookAt(player.position);

 renderer.render(scene,camera);
}
animate();
