// データ管理
let data = { points: 50, level: 1 };

// モンスターデータ
let monster = { level: 1, exp: 0, nextLevelExp: 50 };

// アバターパーツ
let avatarParts = {
    head: { color: "#ffcc00", size: 30 },
    body: { color: "#00ccff", width: 40, height: 60 },
    eyes: { color: "#000", size: 5 }
};

// ショップパーツ
let shopItems = [
    { type: "head", color: "#ff0000", price: 20 },
    { type: "head", color: "#00ff00", price: 20 },
    { type: "body", color: "#0000ff", price: 30 },
    { type: "body", color: "#ffff00", price: 30 }
];

// Canvas参照
const avatarCanvas = document.getElementById("avatar-canvas");
const avatarCtx = avatarCanvas.getContext("2d");
const monsterCanvas = document.getElementById("monster-canvas");
const monsterCtx = monsterCanvas.getContext("2d");

// 描画関数
function drawAvatar() {
    avatarCtx.clearRect(0,0,avatarCanvas.width, avatarCanvas.height);
    avatarCtx.fillStyle = avatarParts.head.color;
    avatarCtx.beginPath();
    avatarCtx.arc(avatarCanvas.width/2, 40, avatarParts.head.size, 0, Math.PI*2);
    avatarCtx.fill();
    avatarCtx.fillStyle = avatarParts.eyes.color;
    avatarCtx.beginPath();
    avatarCtx.arc(avatarCanvas.width/2 -10, 40, avatarParts.eyes.size,0, Math.PI*2);
    avatarCtx.arc(avatarCanvas.width/2 +10, 40, avatarParts.eyes.size,0, Math.PI*2);
    avatarCtx.fill();
    avatarCtx.fillStyle = avatarParts.body.color;
    avatarCtx.fillRect(avatarCanvas.width/2 - avatarParts.body.width/2, 60, avatarParts.body.width, avatarParts.body.height);
}

function drawMonster() {
    monsterCtx.clearRect(0,0,monsterCanvas.width, monsterCanvas.height);
    monsterCtx.fillStyle = "#ff5555";
    const size = 50 + monster.level*5;
    monsterCtx.beginPath();
    monsterCtx.arc(monsterCanvas.width/2, monsterCanvas.height/2, size,0,Math.PI*2);
    monsterCtx.fill();
    monsterCtx.fillStyle="white";
    monsterCtx.font="16px Arial";
    monsterCtx.textAlign="center";
    monsterCtx.fillText("Lv."+monster.level, monsterCanvas.width/2, monsterCanvas.height-10);
}

// 初回描画
drawAvatar();
drawMonster();
updatePointsDisplay();

// タスク処理
const taskList = document.getElementById("task-list");
document.getElementById("create-task-btn").onclick = () => {
    const input = document.getElementById("new-task-input");
    if(input.value.trim()==="") return;
    const li = document.createElement("li");
    li.textContent = input.value;
    li.onclick = () => li.classList.toggle("selected");
    taskList.appendChild(li);
    input.value="";
    updateTaskButtons();
};

document.getElementById("finish-task-btn").onclick = () => {
    const selectedTasks = document.querySelectorAll("#task-list li.selected");
    selectedTasks.forEach(t=>t.remove());
    const gainedPoints = selectedTasks.length*10;
    data.points += gainedPoints;
    const gainedExp = selectedTasks.length*15;
    monster.exp += gainedExp;
    checkMonsterLevelUp();
    updatePointsDisplay();
    updateTaskButtons();
    drawMonster();
};

document.getElementById("delete-task-btn").onclick = () => {
    const selectedTasks = document.querySelectorAll("#task-list li.selected");
    selectedTasks.forEach(t=>t.remove());
    updateTaskButtons();
};

function updateTaskButtons(){
    const anySelected = document.querySelectorAll("#task-list li.selected").length>0;
    document.getElementById("finish-task-btn").disabled=!anySelected;
    document.getElementById("delete-task-btn").disabled=!anySelected;
}

// モンスター経験値処理
function checkMonsterLevelUp(){
    while(monster.exp >= monster.nextLevelExp){
        monster.exp -= monster.nextLevelExp;
        monster.level++;
        monster.nextLevelExp = monster.level*50;
        alert(`モンスターが成長！Lv.${monster.level}`);
    }
}

// ポイント表示更新
function updatePointsDisplay(){
    document.getElementById("points-display").textContent = data.points;
}

// ショップ処理
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
document.getElementById("open-shop").onclick = () => showShop();

function showShop(){
    modalContent.innerHTML="<h2>ショップ</h2>";
    shopItems.forEach((item,index)=>{
        const btn = document.createElement("button");
        btn.style.backgroundColor=item.color;
        btn.textContent=`${item.type} - ${item.price}P`;
        btn.onclick=()=>buyItem(index);
        modalContent.appendChild(btn);
    });
    modal.style.display="block";
}

modal.onclick=(e)=>{if(e.target===modal) modal.style.display="none";};

function buyItem(index){
    const item = shopItems[index];
    if(data.points>=item.price){
        data.points -= item.price;
        avatarParts[item.type] = { color:item.color };
        drawAvatar();
        updatePointsDisplay();
        alert(`${item.type}を購入・装備しました！`);
    } else alert("ポイントが足りません");
}

// アバター編集ボタン（ランダム変更サンプル）
document.getElementById("open-avatar-editor").onclick = ()=>{
    avatarParts.head.color = "#"+Math.floor(Math.random()*16777215).toString(16);
    avatarParts.body.color = "#"+Math.floor(Math.random()*16777215).toString(16);
    drawAvatar();
}
