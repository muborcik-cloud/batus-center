const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.UniversalCamera("cam",
        new BABYLON.Vector3(0, 3, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(0, 1, 0), scene);

    // Земля
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 200, height: 200
    }, scene);

    // Город (здания)
    for (let i = 0; i < 50; i++) {
        let box = BABYLON.MeshBuilder.CreateBox("b", {
            height: Math.random() * 10 + 2
        }, scene);

        box.position.x = Math.random() * 100 - 50;
        box.position.z = Math.random() * 100 - 50;
        box.position.y = box.scaling.y / 2;
    }

    // Игрок
    const player = BABYLON.MeshBuilder.CreateBox("player", {height:2}, scene);
    player.position.y = 1;

    // Голова
    const head = BABYLON.MeshBuilder.CreateSphere("head", {diameter:1}, scene);
    head.position.y = 2.2;

    // Управление
    let input = {};
    window.addEventListener("keydown", e => input[e.key] = true);
    window.addEventListener("keyup", e => input[e.key] = false);

    scene.onBeforeRenderObservable.add(() => {
        if (input["w"]) player.position.z += 0.2;
        if (input["s"]) player.position.z -= 0.2;
        if (input["a"]) player.position.x -= 0.2;
        if (input["d"]) player.position.x += 0.2;

        head.position.x = player.position.x;
        head.position.z = player.position.z;

        camera.position.x = player.position.x;
        camera.position.z = player.position.z - 10;
    });

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});
