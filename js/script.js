// ===============================
// タスク管理 & ポイント管理
// ===============================

let points = 0;
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

// タスク作成
createTaskBtn.onclick = () => {
    const taskName = prompt("新しいタスク名を入力:");
    if(taskName) {
        const li = document.createElement("li");
        li.textContent = taskName;
        li.onclick = () => selectTask(li);
        taskList.appendChild(li);
    }
};

// タスク選択
function selectTask(li) {
    if(selectedTask) selectedTask.style.backgroundColor = "#1a1a2e";
    selectedTask = li;
    li.style.backgroundColor = "#4444aa";
    finishTaskBtn.disabled = false;
    deleteTaskBtn.disabled = false;
}

// タスク完了
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
        expBar.value = exp;
        taskList.removeChild(selectedTask);
        selectedTask = null;
        finishTaskBtn.disabled = true;
        deleteTaskBtn.disabled = true;
    }
};

// タスク削除
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
// アバター簡易描画
// ===============================
const avatarCanvas = document.getElementById("avatar-canvas");
const avatarCtx = avatarCanvas.getContext("2d");

function drawAvatar() {
    avatarCtx.fillStyle = "#ffcc00";
    avatarCtx.fillRect(50, 50, 50, 50); // 顔
    avatarCtx.fillStyle = "#000000";
    avatarCtx.fillRect(60, 60, 10, 10); // 左目
    avatarCtx.fillRect(80, 60, 10, 10); // 右目
    avatarCtx.fillStyle = "#ff0000";
    avatarCtx.fillRect(65, 80, 20, 10); // 口
}

drawAvatar();

// ===============================
// ショップボタン（簡易表示）
// ===============================
document.getElementById("open-shop").onclick = () => {
    alert("ショップ機能はまだ開発中です。ポイントでパーツを交換できるようになります！");
};

// ===============================
// アバター編集ボタン（簡易表示）
// ===============================
document.getElementById("open-avatar-editor").onclick = () => {
    alert("アバター編集機能はまだ開発中です。ドット絵パーツで自分だけのキャラを作れます！");
};

// ===============================
// カレンダー・設定ボタン（簡易表示）
// ===============================
document.getElementById("calendar-btn").onclick = () => {
    alert("カレンダー機能はまだ開発中です。タスク達成や予定を管理できます！");
};

document.getElementById("settings-btn").onclick = () => {
    alert("設定機能はまだ開発中です。ここからテーマや通知を変更できます！");
};
