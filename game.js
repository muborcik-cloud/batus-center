// Получаем canvas
const canvas = document.getElementById("renderCanvas");

// Инициализируем Babylon.js
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
const scene = new BABYLON.Scene(engine);

// Добавляем камеру (вид от третьего лица)  
const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), scene);  
camera.attachControl(canvas, true);  

// Добавляем свет  
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);  

// Добавляем "землю" (как основу города)  
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);  

// Добавляем "персонажа" (Box для начала)  
const player = BABYLON.MeshBuilder.CreateBox("player", {height: 2}, scene);  
player.position.y = 1;  

// --- Сюда добавлять логику управления и загрузку моделей (.glb/.gltf) ---  

return scene;

};

const scene = createScene();

// Цикл рендеринга (60 FPS)
engine.runRenderLoop(function () {
scene.render();
});

// Адаптация под размер экрана
window.addEventListener("resize", function () {
engine.resize();
});
