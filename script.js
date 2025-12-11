// プレイヤーデータ
let data = {
  points: 50,
  level: 1,
  username: "ヒーロー"
};

// タスク管理
const taskList = document.getElementById("task-list");
document.getElementById("create-task-btn").onclick = () => {
  const input = document.getElementById("new-task");
  if (!input.value) return;
  const li = document.createElement("li");
  li.textContent = input.value;
  taskList.appendChild(li);
  input.value = "";
  data.points += 5; // タスク追加でポイント
  updatePointsDisplay();
};

// ポイント更新
function updatePointsDisplay() {
  document.getElementById("points-display").textContent = data.points;
  document.getElementById("shop-points").textContent = data.points;
}

// アバター編集
const avatarParts = [];
const editAvatarCanvas = document.getElementById("edit-avatar-canvas");
const editCtx = editAvatarCanvas.getContext("2d");
const partsContainer = document.getElementById("parts-container");

// パーツ例
const parts = [
  { name: "髪1", color: "yellow" },
  { name: "髪2", color: "orange" },
  { name: "服1", color: "red" },
  { name: "服2", color: "blue" }
];

parts.forEach((part) => {
  const btn = document.createElement("button");
  btn.className = "part-btn";
  btn.style.backgroundColor = part.color;
  btn.title = part.name;
  btn.onclick = () => {
    avatarParts.push(part);
    drawAvatar(editCtx, avatarParts);
  };
  partsContainer.appendChild(btn);
});

function drawAvatar(ctx, partsArray) {
  ctx.clearRect(0,0,160,160);
  ctx.beginPath();
  ctx.arc(80,80,80,0,Math.PI*2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = "#111";
  ctx.fillRect(0,0,160,160);
  partsArray.forEach((p,i)=>{
    ctx.fillStyle = p.color;
    ctx.fillRect(20, 20 + i*30, 120, 20);
  });
}

// モーダル開閉
const avatarModal = document.getElementById("avatar-modal");
document.getElementById("open-avatar-editor").onclick = () => avatarModal.style.display = "block";
document.getElementById("close-avatar-btn").onclick = () => avatarModal.style.display = "none";
document.getElementById("save-avatar-btn").onclick = () => {
  const mainCanvas = document.getElementById("avatar-canvas");
  drawAvatar(mainCanvas.getContext("2d"), avatarParts);
  avatarModal.style.display = "none";
};

// ショップ機能
const shopItems = [
  { name: "髪1", color: "yellow", cost: 10 },
  { name: "髪2", color: "orange", cost: 15 },
  { name: "服1", color: "red", cost: 20 },
  { name: "服2", color: "blue", cost: 25 }
];

const shopModal = document.getElementById("shop-modal");
const shopContainer = document.getElementById("shop-items-container");

document.getElementById("open-shop").onclick = () => {
  shopModal.style.display = "block";
  updatePointsDisplay();
  renderShopItems();
};
document.getElementById("close-shop-btn").onclick = () => shopModal.style.display = "none";

function renderShopItems() {
  shopContainer.innerHTML = "";
  shopItems.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "shop-item-btn";
    btn.style.backgroundColor = item.color;
    btn.title = `${item.name} - ${item.cost}pt`;
    btn.onclick = () => purchaseItem(item);
    shopContainer.appendChild(btn);
  });
}

function purchaseItem(item) {
  if (data.points >= item.cost) {
    data.points -= item.cost;
    avatarParts.push(item);
    drawAvatar(document.getElementById("avatar-canvas").getContext("2d"), avatarParts);
    updatePointsDisplay();
    alert(`${item.name} を購入しました！`);
  } else {
    alert("ポイントが足りません！");
  }
}
