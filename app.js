// защита от ошибок
window.onerror = function(e){
 console.log("Ошибка:", e);
};

// сцена
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

// здания
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

// fallback игрок (если модель не загрузится)
let player = new THREE.Mesh(
 new THREE.BoxGeometry(1,2,1),
 new THREE.MeshStandardMaterial({color:0x0000ff})
);
player.position.y = 1;
scene.add(player);

// машина
let car = null;

function buyCar(){
 if(money < 100) return;
 money -= 100;

 car = new THREE.Mesh(
  new THREE.BoxGeometry(2,1,4),
  new THREE.MeshStandardMaterial({color:0xff0000})
 );
 car.position.set(player.position.x,1,player.position.z);
 scene.add(car);
}

// деньги
let money = 0;
setInterval(()=>{
 money += 5;
 document.getElementById("money").innerText = money;
},1000);

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

// движение
function animate(){
 requestAnimationFrame(animate);

 if(car){
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

 renderer.render(scene, camera);
}

animate();
