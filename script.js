/* ================================
   TaskQuest Script（完全版）
   - タスク管理
   - アバター表示
   - ユーザー名変更
   - ポイント & レベル
   - モンスター表示
   - localStorage 保存
================================ */

/* ─────────────────────────────
   保存読み込み
──────────────────────────── */
let data = JSON.parse(localStorage.getItem("taskquest-data")) || {
    username: "ヒーロー",
    points: 50,
    level: 1,
    tasks: [],
    avatar: {
        hairColor: "#ffcc99",
        eyeColor: "#66ccff",
        bodyColor: "#ffcc66"
    }
};

/* ─────────────────────────────
   HTML要素の取得
──────────────────────────── */
const usernameDisplay = document.getElementById("username-display");
const levelDisplay = document.getElementById("level-display");
const pointsDisplay = document.getElementById("points-display");

const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const createBtn = document.getElementById("create-task-btn");
const finishBtn = document.getElementById("finish-task-btn");
const deleteBtn = document.getElementById("delete-task-btn");

const avatarCanvas = document.getElementById("avatar-canvas");
const ctx = avatarCanvas.getContext("2d");

/* モーダル */
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

/* ─────────────────────────────
   初期表示
──────────────────────────── */
function init() {
    usernameDisplay.textContent = data.username;
    levelDisplay.textContent = data.level;
    pointsDisplay.textContent = data.points;

    renderTasks();
    drawAvatar();
}
init();

/* ─────────────────────────────
   保存処理
──────────────────────────── */
function save() {
    localStorage.setItem("taskquest-data", JSON.stringify(data));
}

/* ─────────────────────────────
   タスク表示
──────────────────────────── */
function renderTasks() {
    taskList.innerHTML = "";
    data.tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.name;

        li.onclick = () => {
            selectTask(index);
        };

        if (task.selected) {
            li.style.background = "#444";
        }

        taskList.appendChild(li);
    });
}

/* タスク追加 */
createBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;

    data.tasks.push({ name: text, selected: false });
    taskInput.value = "";

    save();
    renderTasks();
};

/* タスク選択 */
function selectTask(i) {
    data.tasks.forEach(t => (t.selected = false));
    data.tasks[i].selected = true;

    finishBtn.disabled = false;
    deleteBtn.disabled = false;

    renderTasks();
}

/* タスク完了（報酬 +10） */
finishBtn.onclick = () => {
    const task = data.tasks.find(t => t.selected);
    if (!task) return;

    data.points += 10;
    pointsDisplay.textContent = data.points;

    // レベルアップ
    if (data.points >= data.level * 50) {
        data.level++;
        levelDisplay.textContent = data.level;
    }

    data.tasks = data.tasks.filter(t => !t.selected);

    save();
    renderTasks();

    finishBtn.disabled = true;
    deleteBtn.disabled = true;
};

/* タスク削除 */
deleteBtn.onclick = () => {
    data.tasks = data.tasks.filter(t => !t.selected);
    save();
    renderTasks();

    finishBtn.disabled = true;
    deleteBtn.disabled = true;
};

/* ─────────────────────────────
   アバター描画（超シンプル版）
──────────────────────────── */
function drawAvatar() {
    ctx.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);

    // 体（丸）
    ctx.fillStyle = data.avatar.bodyColor;
    ctx.beginPath();
    ctx.arc(80, 80, 55, 0, Math.PI * 2);
    ctx.fill();

    // 目
    ctx.fillStyle = data.avatar.eyeColor;
    ctx.beginPath();
    ctx.arc(60, 70, 8, 0, Math.PI * 2);
    ctx.arc(100, 70, 8, 0, Math.PI * 2);
    ctx.fill();

    // 髪
    ctx.fillStyle = data.avatar.hairColor;
    ctx.beginPath();
    ctx.arc(80, 45, 40, Math.PI, 0);
    ctx.fill();
}

/* ─────────────────────────────
   プロフィール編集（ユーザー名）
──────────────────────────── */
document.getElementById("edit-username-btn").onclick = () => {
    modalContent.innerHTML = `
        <h2>ユーザー名を変更</h2>
        <input id="new-username" class="modal-input" placeholder="新しい名前">
        <button id="save-username" class="btn">保存</button>
        <button id="close-modal" class="btn-danger">閉じる</button>
    `;
    modal.style.display = "block";

    document.getElementById("save-username").onclick = () => {
        const name = document.getElementById("new-username").value.trim();
        if (!name) return;

        data.username = name;
        usernameDisplay.textContent = name;
        save();

        modal.style.display = "none";
    };

    document.getElementById("close-modal").onclick = () => {
        modal.style.display = "none";
    };
};

/* ─────────────────────────────
   モンスター表示用
──────────────────────────── */
function renderMonster() {
    const box = document.getElementById("monster-box");
    box.innerHTML = `
        <h3>モンスター</h3>
        <p>（今はダミー）</p>
        <div style="width:80px;height:80px;background:#333;border-radius:10px;margin:auto;"></div>
    `;
}
renderMonster();

/* ─────────────────────────────
   モーダル閉じる（外クリック）
──────────────────────────── */
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// ===============================
document.getElementById("calendar-btn").onclick=()=>{alert("カレンダーは開発中");};
document.getElementById("settings-btn").onclick=()=>{alert("設定は開発中");};
