// сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// камера
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.set(0,10,15);

// рендер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,20,10);
scene.add(light);

// земля
const ground = new THREE.Mesh(
 new THREE.PlaneGeometry(200,200),
 new THREE.MeshLambertMaterial({color:0x55aa55})
);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// дороги
const roadMat = new THREE.MeshBasicMaterial({color:0x444444});
for(let i=-100;i<100;i+=20){
 let road = new THREE.Mesh(new THREE.BoxGeometry(5,0.1,200), roadMat);
 road.position.x = i;
 scene.add(road);

 let road2 = new THREE.Mesh(new THREE.BoxGeometry(200,0.1,5), roadMat);
 road2.position.z = i;
 scene.add(road2);
}

// здания
for(let i=0;i<30;i++){
 let b = new THREE.Mesh(
  new THREE.BoxGeometry(5,Math.random()*10+5,5),
  new THREE.MeshLambertMaterial({color:0x8888ff})
 );
 b.position.set(
  Math.random()*100-50,
  b.geometry.parameters.height/2,
  Math.random()*100-50
 );
 scene.add(b);
}

// игрок
const player = new THREE.Mesh(
 new THREE.BoxGeometry(1,2,1),
 new THREE.MeshLambertMaterial({color:0x0000ff})
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
  new THREE.MeshLambertMaterial({color:0xff0000})
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

// игра
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

 // камера за игроком
 camera.position.x = player.position.x + 10;
 camera.position.z = player.position.z + 10;
 camera.lookAt(player.position);

 renderer.render(scene, camera);
}

animate();
