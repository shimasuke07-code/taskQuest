/* ======================================================
   初期データ（ユーザー / アバター）
====================================================== */
let user = {
  points: 0
};

let avatar = {
  bodyColor: "#888",
  hairColor: "#fff",
  accessoryColor: "#f00",
  accessoryType: "none"
};

let avatarFrame = 0;


/* ======================================================
   アバター描画（宇宙背景＋ドット風）
====================================================== */
function drawAvatar() {
  const c = document.getElementById("avatar-canvas");
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  // 宇宙背景（小さな星を散らす）
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 25; i++) {
    ctx.fillStyle = "white";
    ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 1, 1);
  }

  // 体
  ctx.fillStyle = avatar.bodyColor;
  ctx.fillRect(40, 60, 40, 50);

  // 顔
  ctx.fillStyle = "#ffe0bd";
  ctx.fillRect(40, 30, 40, 30);

  // 髪
  ctx.fillStyle = avatar.hairColor;
  ctx.fillRect(35, 25, 50, 15);

  // アクセサリー（例：マント）
  if (avatar.accessoryType === "mantle") {
    ctx.fillStyle = avatar.accessoryColor;
    ctx.fillRect(35, 60, 50, 10);
  }

  // 目
  ctx.fillStyle = "#000";
  ctx.fillRect(50, 40, 5, 5);
  ctx.fillRect(65, 40, 5, 5);

  requestAnimationFrame(drawAvatar);
}

requestAnimationFrame(drawAvatar);


/* ======================================================
   UI更新（ポイント表示）
====================================================== */
function updateUI() {
  document.getElementById("points").textContent = `ポイント: ${user.points}`;
}
updateUI();


/* ======================================================
   ショップ
====================================================== */
const shopItems = [
  { id: 1, name: "赤いマント", type: "mantle", color: "#f00", price: 50 },
  { id: 2, name: "青いマント", type: "mantle", color: "#00f", price: 70 },
  { id: 3, name: "緑のマント", type: "mantle", color: "#0f0", price: 90 }
];

function openShop() {
  const shopDiv = document.getElementById("shop");
  shopDiv.innerHTML = "<h3>パーツショップ</h3>";

  shopItems.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = `${item.name} - ${item.price}pt`;

    btn.onclick = () => {
      if (user.points >= item.price) {
        user.points -= item.price;
        updateUI();

        avatar.accessoryType = item.type;
        avatar.accessoryColor = item.color;

        alert(`${item.name} を入手しました！`);
      } else {
        alert("ポイントが足りません！");
      }
    };

    shopDiv.appendChild(btn);
  });
}

document.getElementById("open-shop").onclick = openShop;


/* ======================================================
   チームボス
====================================================== */
let boss = {
  name: "巨大ボス",
  maxHP: 1000,
  hp: 1000
};

function drawBoss() {
  const c = document.getElementById("enemy-canvas");
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  // 背景
  const bg = ctx.createLinearGradient(0, 0, c.width, c.height);
  bg.addColorStop(0, "#330000");
  bg.addColorStop(1, "#550000");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);

  // ボス本体（円）
  ctx.fillStyle = "#880000";
  ctx.beginPath();
  ctx.arc(c.width / 2, c.height / 2, 50, 0, Math.PI * 2);
  ctx.fill();

  // HPバー（白の外枠）
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, 10, c.width - 20, 10);

  // HP残量（緑）
  ctx.fillStyle = "#0f0";
  ctx.fillRect(10, 10, (c.width - 20) * (boss.hp / boss.maxHP), 10);

  // HP数値
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText(`HP: ${boss.hp}/${boss.maxHP}`, 10, 35);

  requestAnimationFrame(drawBoss);
}

requestAnimationFrame(drawBoss);


function attackBoss(dmg) {
  boss.hp -= dmg;
  if (boss.hp < 0) boss.hp = 0;

  if (boss.hp === 0) {
    alert("ボスを倒した！すごい！");
    boss.hp = boss.maxHP;
  }
}


/* ======================================================
   タスク追加 → 完了でポイント＋ボス攻撃
====================================================== */
function addTask() {
  const input = document.getElementById("task-input");
  const taskName = input.value.trim();

  if (!taskName) return;

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.textContent = taskName + " ";

  const doneBtn = document.createElement("button");
  doneBtn.textContent = "完了";

  doneBtn.onclick = () => {
    user.points += 10;
    updateUI();
    attackBoss(10);
    taskDiv.remove();
  };

  taskDiv.appendChild(doneBtn);
  document.getElementById("tasks").appendChild(taskDiv);

  input.value = "";
}

document.getElementById("add-task").onclick = addTask;
