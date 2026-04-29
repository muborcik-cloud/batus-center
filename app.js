let money = 0;

const player = document.createElement("div");
player.style.position = "absolute";
player.style.width = "30px";
player.style.height = "40px";
player.style.background = "blue";
player.style.top = "200px";
player.style.left = "200px";
document.body.appendChild(player);

let houses = [];
let cars = [];
let coins = [];

setInterval(() => {
  money += 20;
  document.getElementById("money").innerText = money;
}, 2000);

document.addEventListener("keydown", (e) => {
  let x = player.offsetLeft;
  let y = player.offsetTop;

  if (e.key === "ArrowUp") player.style.top = (y - 10) + "px";
  if (e.key === "ArrowDown") player.style.top = (y + 10) + "px";
  if (e.key === "ArrowLeft") player.style.left = (x - 10) + "px";
  if (e.key === "ArrowRight") player.style.left = (x + 10) + "px";
});

function spawnCoin(){
  const coin = document.createElement("div");
  coin.style.position = "absolute";
  coin.style.width = "20px";
  coin.style.height = "20px";
  coin.style.background = "yellow";
  coin.style.borderRadius = "50%";
  coin.style.left = Math.random()*600 + "px";
  coin.style.top = Math.random()*400 + "px";

  document.body.appendChild(coin);
  coins.push(coin);
}

setInterval(spawnCoin, 2000);

setInterval(() => {
  coins.forEach((coin, index) => {
    let dx = player.offsetLeft - coin.offsetLeft;
    let dy = player.offsetTop - coin.offsetTop;

    if(Math.abs(dx) < 30 && Math.abs(dy) < 30){
      money += 100;
      coin.remove();
      coins.splice(index,1);
    }
  });
}, 100);

document.getElementById("buyHouse").onclick = () => {
  if (money >= 200) {
    money -= 200;

    const house = document.createElement("div");
    house.style.position = "absolute";
    house.style.width = "50px";
    house.style.height = "50px";
    house.style.background = "brown";
    house.style.left = Math.random()*600 + "px";
    house.style.top = Math.random()*400 + "px";

    document.body.appendChild(house);
    houses.push(house);
  }
};

document.getElementById("buyCar").onclick = () => {
  if (money >= 300) {
    money -= 300;

    const car = document.createElement("div");
    car.style.position = "absolute";
    car.style.width = "60px";
    car.style.height = "30px";
    car.style.background = "red";
    car.style.left = Math.random()*600 + "px";
    car.style.top = Math.random()*400 + "px";

    document.body.appendChild(car);
    cars.push(car);
  }
};
