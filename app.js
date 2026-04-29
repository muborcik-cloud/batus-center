// СЦЕНА
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// КАМЕРА
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

// РЕНДЕР
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// СВЕТ
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// ЗЕМЛЯ
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({color:0x228B22})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// ДОРОГИ
for (let i=-100;i<100;i+=10){
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(200, 0.1, 2),
    new THREE.MeshStandardMaterial({color:0x333333})
  );
  road.position.z = i;
  scene.add(road);

  const road2 = road.clone();
  road2.rotation.y = Math.PI/2;
  road2.position.x = i;
  scene.add(road2);
}

// ПЕРСОНАЖ (УЖЕ НЕ ПРОСТО КУБ!)
const player = new THREE.Group();

// тело
const body = new THREE.Mesh(
  new THREE.BoxGeometry(1,2,0.5),
  new THREE.MeshStandardMaterial({color:0x0000ff})
);
body.position.y = 1;
player.add(body);

// голова
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  new THREE.MeshStandardMaterial({color:0xffcc99})
);
head.position.y = 2.5;
player.add(head);

// руки
const arm = new THREE.Mesh(
  new THREE.BoxGeometry(0.3,1,0.3),
  new THREE.MeshStandardMaterial({color:0x0000ff})
);
arm.position.set(-0.8,1.2,0);
player.add(arm);

const arm2 = arm.clone();
arm2.position.x = 0.8;
player.add(arm2);

// ноги
const leg = new THREE.Mesh(
  new THREE.BoxGeometry(0.4,1,0.4),
  new THREE.MeshStandardMaterial({color:0x0000ff})
);
leg.position.set(-0.3,0,0);
player.add(leg);

const leg2 = leg.clone();
leg2.position.x = 0.3;
player.add(leg2);

scene.add(player);

// МАШИНА (уже форма машины)
const car = new THREE.Mesh(
  new THREE.BoxGeometry(3,1,2),
  new THREE.MeshStandardMaterial({color:0xff0000})
);
car.position.set(5,0.5,5);
scene.add(car);

// ДОМА
for (let i=0;i<10;i++){
  const house = new THREE.Mesh(
    new THREE.BoxGeometry(3,5,3),
    new THREE.MeshStandardMaterial({color:0x444444})
  );
  house.position.set(Math.random()*50-25,2.5,Math.random()*50-25);
  scene.add(house);
}

// ДЕНЬГИ
let money = 0;
setInterval(()=>{
  money++;
  document.getElementById("money").innerText = money;
},1000);

// УПРАВЛЕНИЕ
let keys = {};

window.addEventListener("keydown", e=>keys[e.key]=true);
window.addEventListener("keyup", e=>keys[e.key]=false);

// ДВИЖЕНИЕ
function update(){
  if(keys["w"]) player.position.z -= 0.2;
  if(keys["s"]) player.position.z += 0.2;
  if(keys["a"]) player.position.x -= 0.2;
  if(keys["d"]) player.position.x += 0.2;

  // камера за игроком
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 8;
  camera.lookAt(player.position);
}

// АНИМАЦИЯ
function animate(){
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}
animate();
