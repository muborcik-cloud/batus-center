const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 2000);
camera.position.set(0,8,15);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(50,100,50);
scene.add(light);

// земля (текстура)
const tex = new THREE.TextureLoader().load("https://threejs.org/examples/textures/grasslight-big.jpg");
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(50,50);

const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(1000,1000),
 new THREE.MeshStandardMaterial({map:tex})
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

// здания (НЕ квадраты — разные)
for(let i=0;i<80;i++){
 let h = Math.random()*80+20;
 let geo = new THREE.BoxGeometry(10, h, 10);
 let mat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(Math.random(),Math.random(),Math.random())
 });
 let b = new THREE.Mesh(geo, mat);
 b.position.set(Math.random()*400-200, h/2, Math.random()*400-200);
 scene.add(b);
}

// игрок (нормальный вид)
const player = new THREE.Group();

const body = new THREE.Mesh(
 new THREE.CapsuleGeometry(0.5,1.5),
 new THREE.MeshStandardMaterial({color:0x0066ff})
);
body.position.y = 2;
player.add(body);

const head = new THREE.Mesh(
 new THREE.SphereGeometry(0.4),
 new THREE.MeshStandardMaterial({color:0xffcc99})
);
head.position.y = 3.2;
player.add(head);

scene.add(player);

// машина (более похожа)
let car = new THREE.Group();

let base = new THREE.Mesh(
 new THREE.BoxGeometry(2,0.6,4),
 new THREE.MeshStandardMaterial({color:0xff0000})
);
base.position.y = 0.5;
car.add(base);

let top = new THREE.Mesh(
 new THREE.BoxGeometry(1.5,0.7,2),
 new THREE.MeshStandardMaterial({color:0xaa0000})
);
top.position.y = 1.1;
car.add(top);

car.visible = false;
scene.add(car);

let inCar = false;

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

// сесть в машину
document.addEventListener("click", ()=>{
 if(car.visible && player.position.distanceTo(car.position)<3){
  inCar = !inCar;
 }
});

// день/ночь
let t=0;
function dayNight(){
 t+=0.002;
 let v = (Math.sin(t)+1)/2;
 scene.background = new THREE.Color(v*0.5+0.2, v*0.7+0.3, v+0.5);
}
setInterval(dayNight,50);

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

 camera.position.x = player.position.x + 10;
 camera.position.z = player.position.z + 10;
 camera.lookAt(player.position);

 renderer.render(scene,camera);
}
animate();
