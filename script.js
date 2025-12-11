/* ======== 初期データ ======== */
let username = "ヒーロー";
let points = 50;
let level = 1;
let tasks = [];

/* ======== HTML要素取得 ======== */
const usernameDisplay = document.getElementById("username-display");
const pointsDisplay = document.getElementById("points-display");
const levelDisplay = document.getElementById("level-display");

const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const createTaskBtn = document.getElementById("create-task-btn");
const finishTaskBtn = document.getElementById("finish-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

const avatarCanvas = document.getElementById("avatar-canvas");
const ctx = avatarCanvas.getContext("2d");

/* ======== 初期描画 ======== */
function updateDisplay() {
    usernameDisplay.textContent = username;
    pointsDisplay.textContent = points;
    levelDisplay.textContent = level;

    taskList.innerHTML = "";
    tasks.forEach((task, idx) => {
        const li = document.createElement("li");
        li.textContent = task.name;
        li.dataset.idx = idx;
        taskList.appendChild(li);
    });
}

/* ======== タスク追加 ======== */
createTaskBtn.addEventListener("click", () => {
    const taskName = taskInput.value.trim();
    if (taskName) {
        tasks.push({ name: taskName, done: false });
        taskInput.value = "";
        updateDisplay();
    }
});

/* ======== タスク完了（ポイント付与） ======== */
finishTaskBtn.addEventListener("click", () => {
    const selectedIdx = getSelectedTaskIdx();
    if (selectedIdx !== null) {
        tasks[selectedIdx].done = true;
        points += 10;
        checkLevelUp();
        updateDisplay();
    }
});

/* ======== タスク削除 ======== */
deleteTaskBtn.addEventListener("click", () => {
    const selectedIdx = getSelectedTaskIdx();
    if (selectedIdx !== null) {
        tasks.splice(selectedIdx, 1);
        updateDisplay();
    }
});

/* ======== タスク選択補助 ======== */
taskList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        [...taskList.children].forEach(li => li.style.background = "");
        e.target.style.background = "#3ea7ff44";
    }
});

function getSelectedTaskIdx() {
    const selected = [...taskList.children].find(li => li.style.background !== "");
    return selected ? parseInt(selected.dataset.idx) : null;
}

/* ======== レベルアップ判定 ======== */
function checkLevelUp() {
    const newLevel = Math.floor(points / 50) + 1;
    if (newLevel > level) level = newLevel;
}

/* ======== アバター描画 ======== */
function drawAvatar() {
    ctx.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);
    ctx.fillStyle = "#0d6efd";
    ctx.fillRect(40, 40, 80, 80); // 仮ドットアバター（四角）
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(60, 60, 20, 20); // 顔っぽいドット
}

drawAvatar();

/* ======== モーダル ======== */
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

document.getElementById("open-avatar-editor").addEventListener("click", () => {
    modalContent.innerHTML = "<h2>アバター編集画面</h2><p>ここでアバターを変更できます。</p>";
    modal.style.display = "block";
});

document.getElementById("open-shop").addEventListener("click", () => {
    modalContent.innerHTML = "<h2>ショップ</h2><p>ポイントでパーツを購入できます。</p>";
    modal.style.display = "block";
});

modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

/* ======== 初期表示 ======== */
updateDisplay();

