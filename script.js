// ===============================
// タスク管理 & ポイント管理
// ===============================
let points = 50;
let level = 1;
let exp = 0;
let selectedTask = null;

const taskList = document.getElementById("task-list");
const pointsDisplay = document.getElementById("points-display");
const levelDisplay = document.getElementById("level-display");
const expBar = document.getElementById("exp-bar");

const createTaskBtn = document.getElementById("create-task-btn");
const finishTaskBtn = document.getElementById("finish-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

createTaskBtn.onclick = () => {
    const taskName = prompt("新しいタスク名を入力:");
    if(taskName) {
        const li = document.createElement("li");
        li.textContent = taskName;
        li.onclick = () => selectTask(li);
        taskList.appendChild(li);
    }
};

function selectTask(li) {
    if(selectedTask) selectedTask.style.backgroundColor = "#1a1a2e";
    selectedTask = li;
    li.style.backgroundColor = "#4444aa";
    finishTaskBtn.disabled = false;
    deleteTaskBtn.disabled = false;
}

finishTaskBtn.onclick = () => {
    if(selectedTask) {
        alert(`「${selectedTask.textContent}」を完了！ポイント+10`);
        points += 10;
        exp += 10;
        if(exp >= 100) {
            level++;
            exp = 0;
            alert(`レベルアップ！Lv.${level}`);
        }
        pointsDisplay.textContent = points;
        levelDisplay.textContent = level;
        taskList.removeChild(selectedTask);
        selectedTask = null;
        finishTaskBtn.disabled = true;
        deleteTaskBtn.disabled = true;
    }
};

deleteTaskBtn.onclick = () => {
    if(selectedTask) {
        if(confirm(`「${selectedTask.textContent}」を削除しますか？`)) {
            taskList.removeChild(selectedTask);
            selectedTask = null;
            finishTaskBtn.disabled = true;
            deleteTaskBtn.disabled = true;
        }
    }
};

// ===============================
// ユーザー名変更
// ===============================
const usernameDisplay = document.getElementById("username-display");
usernameDisplay.onclick = () => {
    const newName = prompt("ユーザー名を入力:");
    if(newName) usernameDisplay.textContent = newName;
};

// ===============================
// アバター構造
// ===============================
const avatarCanvas = document.getElementById("avatar-canvas");
const avatarCtx = avatarCanvas.getContext("2d");

let avatarParts = {hair:0, eyes:0, shirt:0, accessory:0};
const hairColors = ["#ffcc00","#ff6600","#66ccff"];
const eyeColors = ["#000","#663300","#3333ff"];
const shirtColors = ["#f00","#0f0","#00f"];
const accessoryColors = ["#fff","#f0f"];

function drawAvatar() {
    avatarCtx.clearRect(0,0,avatarCanvas.width,avatarCanvas.height);
    // 髪
    avatarCtx.fillStyle = hairColors[avatarParts.hair];
    avatarCtx.fillRect(40,20,70,30);
    // 顔
    avatarCtx.fillStyle = "#ffe0bd";
    avatarCtx.fillRect(50,50,50,50);
    // 目
    avatarCtx.fillStyle = eyeColors[avatarParts.eyes];
    avatarCtx.fillRect(60,60,10,10);
    avatarCtx.fillRect(80,60,10,10);
    // 口
    avatarCtx.fillStyle = "#f00";
    avatarCtx.fillRect(65,80,20,10);
    // シャツ
    avatarCtx.fillStyle = shirtColors[avatarParts.shirt];
    avatarCtx.fillRect(50,100,50,50);
    // アクセサリ
    avatarCtx.fillStyle = accessoryColors[avatarParts.accessory];
    avatarCtx.fillRect(75,55,10,10);
}
drawAvatar();

// ===============================
// モーダル表示・編集
// ===============================
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

document.getElementById("open-avatar-editor").onclick = () => {
    showAvatarEditor();
};
document.getElementById("open-shop").onclick = () => {
    showShop();
};

function showAvatarEditor() {
    modal.style.display = "block";
    modalContent.innerHTML = "<h2>アバター編集</h2>";
    ["hair","eyes","shirt","accessory"].forEach(part => {
        const div = document.createElement("div");
        div.textContent = part + ": ";
        const maxIndex = {
            hair: hairColors.length,
            eyes: eyeColors.length,
            shirt: shirtColors.length,
            accessory: accessoryColors.length
        }[part];
        for(let i=0;i<maxIndex;i++){
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.onclick = () => {avatarParts[part]=i; drawAvatar();}
            div.appendChild(btn);
        }
        modalContent.appendChild(div);
    });
    const closeBtn = document.createElement("button");
    closeBtn.textContent="閉じる";
    closeBtn.onclick=()=>{modal.style.display="none";}
    modalContent.appendChild(closeBtn);
}

function showShop() {
    modal.style.display="block";
    modalContent.innerHTML="<h2>ショップ</h2>";
    ["hair","eyes","shirt","accessory"].forEach(part=>{
        const div=document.createElement("div");
        div.textContent=part+": ";
        const maxIndex={hair:3,eyes:3,shirt:3,accessory:2}[part];
        for(let i=0;i<maxIndex;i++){
            const btn=document.createElement("button");
            const price=20;
            btn.textContent=`購入 ${price}P`;
            btn.onclick=()=>{
                if(points>=price){
                    points-=price;
                    pointsDisplay.textContent=points;
                    alert(`${part}のパーツを購入しました`);
                }else{alert("ポイントが足りません");}
            }
            div.appendChild(btn);
        }
        modalContent.appendChild(div);
    });
    const closeBtn=document.createElement("button");
    closeBtn.textContent="閉じる";
    closeBtn.onclick=()=>{modal.style.display="none";}
    modalContent.appendChild(closeBtn);
}

// ===============================
// カレンダー・設定ボタン
// ===============================
document.getElementById("calendar-btn").onclick=()=>{alert("カレンダーは開発中");};
document.getElementById("settings-btn").onclick=()=>{alert("設定は開発中");};
