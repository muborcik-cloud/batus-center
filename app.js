const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,10,15);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(20,30,10);
scene.add(light);

// земля
const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(500,500),
 new THREE.MeshStandardMaterial({color:0x228B22})
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

// небоскрёбы
for(let i=0;i<40;i++){
 let h = Math.random()*40+20;
 let b = new THREE.Mesh(
  new THREE.BoxGeometry(10,h,10),
  new THREE.MeshStandardMaterial({color:0x111111})
 );
 b.position.set(
  Math.random()*200-100,
  h/2,
  Math.random()*200-100
 );
 scene.add(b);
}

// загрузчик моделей
const loader = new THREE.GLTFLoader();

let player, car;

// 🧍 игрок модель
loader.load(
 "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
 (gltf)=>{
   player = gltf.scene;
   player.scale.set(0.5,0.5,0.5);
   player.position.set(0,0,0);
   scene.add(player);
 }
);

// 🚗 машина модель
function spawnCar(){
 loader.load(
  "https://threejs.org/examples/models/gltf/Flamingo.glb",
  (gltf)=>{
    car = gltf.scene;
    car.scale.set(0.05,0.05,0.05);
    car.position.set(5,0,5);
    scene.add(car);
  }
 );
}

// деньги
let money = 0;
setInterval(()=>{
 money += 5;
 document.getElementById("money").innerText = money;
},1000);

// покупка машины
function buyCar(){
 if(money < 100) return;
 money -= 100;
 spawnCar();
}

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

// вход в дом (простая система)
let inside = false;

document.addEventListener("click", ()=>{
 if(!inside){
   camera.position.set(0,5,0);
   inside = true;
 } else {
   camera.position.set(0,10,15);
   inside = false;
 }
});

// игра
function animate(){
 requestAnimationFrame(animate);

 if(player){
   player.position.x += dx*0.2;
   player.position.z += dz*0.2;

   camera.position.x = player.position.x + 10;
   camera.position.z = player.position.z + 10;
   camera.lookAt(player.position);
 }

 if(car){
   car.position.x += dx*0.5;
   car.position.z += dz*0.5;
 }

 renderer.render(scene, camera);
}

animate();
