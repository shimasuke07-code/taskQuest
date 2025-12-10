/* ======================================================
    TaskQuest 完全版 script.js（パート1）
    - 画面切り替え
    - localStorage 初期化
    - ユーザー名保存/表示
====================================================== */

/* ------------------------------
   画面管理
------------------------------ */
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* ------------------------------
   データ初期値
------------------------------ */
let data = {
    username: "ヒーロー",
    points: 0,
    level: 1,
    exp: 0,
    expMax: 100,
    avatar: {
        bodyColor: "#888888",
        hairColor: "#ffffff",
        accessory: "none",
        accessoryColor: "#ff0000"
    },
    tasks: [],
    routines: [],
    missions: [],
    diary: {},
    theme: "space",
    boss: {
        hp: 1000,
        max: 1000
    }
};

/* ------------------------------
   データ読み込み
------------------------------ */
function loadData() {
    const saved = localStorage.getItem("taskquest");
    if (saved) {
        data = JSON.parse(saved);
    }
}
loadData();

/* ------------------------------
   データ保存
------------------------------ */
function saveData() {
    localStorage.setItem("taskquest", JSON.stringify(data));
}

/* ------------------------------
   ホーム → サインイン
------------------------------ */
document.getElementById("start-button").onclick = () => {
    showScreen("signin-screen");
};

/* ------------------------------
   サインイン
------------------------------ */
document.getElementById("save-username").onclick = () => {
    const name = document.getElementById("username-input").value.trim();
    if (name !== "") {
        data.username = name;
        saveData();
    }
    updateUI();
    showScreen("main-screen");
};

/* ------------------------------
   ユーザー名表示更新
------------------------------ */
function updateUI() {
    document.getElementById("username-display").textContent = data.username;
    document.getElementById("points").textContent = data.points;
    document.getElementById("level").textContent = data.level;
    document.getElementById("exp").textContent = data.exp;
    document.getElementById("exp-max").textContent = data.expMax;

    let percent = (data.exp / data.expMax) * 100;
    document.getElementById("exp-fill").style.width = percent + "%";
}

updateUI();

/* ------------------------------
   設定画面の開閉
------------------------------ */
document.getElementById("open-settings").onclick = () => {
    showScreen("settings-screen");
};
document.getElementById("close-settings").onclick = () => {
    showScreen("main-screen");
};

/* ------------------------------
   名前変更
------------------------------ */
document.getElementById("edit-username").onclick = () => {
    const newName = prompt("新しい名前を入力", data.username);
    if (newName && newName.trim() !== "") {
        data.username = newName;
        saveData();
        updateUI();
    }
};

/* ------------------------------
   データ削除
------------------------------ */
document.getElementById("reset-data").onclick = () => {
    if (confirm("本当に全部消しますか？")) {
        localStorage.removeItem("taskquest");
        location.reload();
    }
};

/* ======================================================
   テーマ切り替え
====================================================== */
function applyTheme() {
    document.body.classList.remove("theme-space", "theme-dark", "theme-neon");
    document.body.classList.add("theme-" + data.theme);
}

applyTheme();

document.querySelectorAll(".theme-button").forEach(btn => {
    btn.onclick = () => {
        data.theme = btn.dataset.theme;
        saveData();
        applyTheme();
    };
});

/* ======================================================
    アバター描画（ドット絵 + アニメーション + 宇宙背景）
====================================================== */

const avatarCanvas = document.getElementById("avatar-canvas");
const actx = avatarCanvas.getContext("2d");

let avatarAnimFrame = 0;

function drawAvatar() {
    const ctx = actx;
    ctx.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);

    /* ---- 宇宙背景 ---- */
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, avatarCanvas.width, avatarCanvas.height);
    for (let i = 0; i < 15; i++) {
        ctx.fillStyle = "white";
        ctx.fillRect(Math.random() * 150, Math.random() * 180, 1, 1);
    }

    /* ---- ドット風キャラ ---- */
    // 顔
    ctx.fillStyle = "#ffe0b5";
    ctx.fillRect(50, 20, 50, 50);

    // 目（アニメ：まばたき）
    let eyeSize = (avatarAnimFrame % 60 < 5) ? 2 : 5;
    ctx.fillStyle = "#000";
    ctx.fillRect(65, 40, 5, eyeSize);
    ctx.fillRect(80, 40, 5, eyeSize);

    // 髪
    ctx.fillStyle = data.avatar.hairColor;
    ctx.fillRect(45, 10, 60, 20);

    // 体
    ctx.fillStyle = data.avatar.bodyColor;
    ctx.fillRect(50, 70, 50, 70);

    /* ---- アクセサリー ---- */
    if (data.avatar.accessory.includes("mantle")) {
        // マント揺れアニメーション
        let sway = Math.sin(avatarAnimFrame / 10) * 3;

        let color = "#ff0000";
        if (data.avatar.accessory === "mantle-blue") color = "#00aaff";
        if (data.avatar.accessory === "mantle-green") color = "#00ff55";

        ctx.fillStyle = color;
        ctx.fillRect(45 + sway, 70, 60, 20);
    }

    avatarAnimFrame++;
    requestAnimationFrame(drawAvatar);
}

requestAnimationFrame(drawAvatar);

/* ======================================================
    ショップ生成
====================================================== */

const shopData = [
    { id: 1, name: "赤いマント", price: 50, accessory: "mantle-red" },
    { id: 2, name: "青いマント", price: 70, accessory: "mantle-blue" },
    { id: 3, name: "緑のマント", price: 90, accessory: "mantle-green" },
];

document.getElementById("open-shop").onclick = () => {
    const shop = document.getElementById("shop-items");
    shop.innerHTML = "";

    shopData.forEach(item => {
        let btn = document.createElement("button");
        btn.textContent = `${item.name} - ${item.price}pt`;

        btn.onclick = () => {
            if (data.points >= item.price) {
                data.points -= item.price;
                data.avatar.accessory = item.accessory;
                saveData();
                updateUI();
                alert(item.name + " を買いました！");
            } else {
                alert("ポイントが足りません！");
            }
        };

        shop.appendChild(btn);
    });

    showScreen("shop-screen");
};

document.getElementById("close-shop").onclick = () => {
    showScreen("main-screen");
};

/* ======================================================
    アバターエディタ（色変更）
====================================================== */
document.getElementById("open-avatar-editor").onclick = () => {
    document.getElementById("body-color").value = data.avatar.bodyColor;
    document.getElementById("hair-color").value = data.avatar.hairColor;
    document.getElementById("accessory-select").value = data.avatar.accessory;

    showScreen("avatar-editor-screen");
};

document.getElementById("close-avatar-editor").onclick = () => {
    data.avatar.bodyColor = document.getElementById("body-color").value;
    data.avatar.hairColor = document.getElementById("hair-color").value;
    data.avatar.accessory = document.getElementById("accessory-select").value;

    saveData();
    showScreen("main-screen");
};

/* ======================================================
    ▼ タスク管理（追加・完了・削除）
====================================================== */

const taskList = document.getElementById("task-list");
const finishTaskBtn = document.getElementById("finish-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");
let selectedTaskId = null;

function renderTasks() {
    taskList.innerHTML = "";

    data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title;
        li.dataset.id = task.id;

        li.onclick = () => {
            selectedTaskId = task.id;
            finishTaskBtn.disabled = false;
            deleteTaskBtn.disabled = false;
        };

        taskList.appendChild(li);
    });
}

document.getElementById("create-task-btn").onclick = () => {
    const title = prompt("タスク名を入力してください：");
    if (!title) return;

    data.tasks.push({
        id: Date.now(),
        title,
        done: false
    });

    saveData();
    renderTasks();
};

finishTaskBtn.onclick = () => {
    if (!selectedTaskId) return;

    const task = data.tasks.find(t => t.id === selectedTaskId);
    task.done = true;

    gainReward();
    doDamageToBoss();

    data.tasks = data.tasks.filter(t => t.id !== selectedTaskId);
    saveData();
    renderTasks();

    selectedTaskId = null;
    finishTaskBtn.disabled = true;
    deleteTaskBtn.disabled = true;
};

deleteTaskBtn.onclick = () => {
    if (!selectedTaskId) return;

    data.tasks = data.tasks.filter(t => t.id !== selectedTaskId);
    saveData();
    renderTasks();

    selectedTaskId = null;
    finishTaskBtn.disabled = true;
    deleteTaskBtn.disabled = true;
};

/* ======================================================
    ▼ 報酬（ポイント + EXP）
====================================================== */
function gainReward() {
    const getPt = 10;
    const getExp = 20;

    data.points += getPt;
    data.exp += getExp;

    levelCheck();
    saveData();
    updateUI();
}

/* ======================================================
    ▼ レベルアップ
====================================================== */
function levelCheck() {
    const needExp = data.level * 100;

    if (data.exp >= needExp) {
        data.exp -= needExp;
        data.level++;

        alert(`レベルアップ！ Lv.${data.level} になった！`);
    }
}

/* ======================================================
    ▼ ボス戦
====================================================== */

const enemies = [
    { id: 1, name: "スライム", maxHP: 50 },
    { id: 2, name: "ゴーレム", maxHP: 80 },
    { id: 3, name: "暗黒竜", maxHP: 150 },
];

function startBossBattle(bossId) {
    const boss = enemies.find(b => b.id === bossId);

    data.boss = {
        id: boss.id,
        name: boss.name,
        maxHP: boss.maxHP,
        hp: boss.maxHP
    };

    saveData();
    updateBossUI();
    showScreen("battle-screen");
}

function updateBossUI() {
    const boss = data.boss;
    if (!boss) return;

    const bar = document.getElementById("boss-hp-bar");
    const label = document.getElementById("boss-name");

    bar.max = boss.maxHP;
    bar.value = boss.hp;
    label.textContent = `${boss.name}（HP: ${boss.hp}/${boss.maxHP}）`;
}

function doDamageToBoss() {
    if (!data.boss) return;

    const damage = 10;
    data.boss.hp -= damage;

    if (data.boss.hp <= 0) {
        alert(`${data.boss.name} を倒した！`);
        data.boss = null;
    }

    saveData();
    updateBossUI();
}

document.getElementById("back-main-screen").onclick = () => {
    showScreen("main-screen");
};

/* ======================================================
    ▼ カレンダー機能
====================================================== */

const calendarDays = document.getElementById("calendar-days");

function buildCalendar(year, month) {
    calendarDays.innerHTML = "";

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay();
    const totalDay = last.getDate();

    // 空白
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        calendarDays.appendChild(empty);
    }

    // 日付
    for (let day = 1; day <= totalDay; day++) {
        const d = document.createElement("div");
        d.className = "calendar-day";

        d.textContent = day;

        // 達成マーク
        const key = `${year}-${month + 1}-${day}`;
        if (data.calendar[key]) {
            const mark = document.createElement("span");
            mark.className = "success-mark";
            mark.textContent = "●";
            d.appendChild(mark);
        }

        d.onclick = () => openDiary(year, month + 1, day);
        calendarDays.appendChild(d);
    }
}

let now = new Date();
buildCalendar(now.getFullYear(), now.getMonth());

document.getElementById("calendar-btn").onclick = () => {
    showScreen("calendar-screen");
    buildCalendar(now.getFullYear(), now.getMonth());
};

document.getElementById("close-calendar").onclick = () => {
    showScreen("main-screen");
};

/* ======================================================
    ▼ 日記
====================================================== */

const diaryText = document.getElementById("diary-text");
const diaryDateLabel = document.getElementById("diary-date");

let currentDiaryKey = null;

function openDiary(y, m, d) {
    currentDiaryKey = `${y}-${m}-${d}`;
    diaryDateLabel.textContent = `${y}/${m}/${d}`;

    diaryText.value = data.diary[currentDiaryKey] || "";

    showScreen("diary-screen");
}

document.getElementById("save-diary").onclick = () => {
    data.diary[currentDiaryKey] = diaryText.value;
    data.calendar[currentDiaryKey] = true; // 成功マーク

    saveData();
    alert("保存しました！");
};

document.getElementById("close-diary").onclick = () => {
    showScreen("calendar-screen");
    buildCalendar(now.getFullYear(), now.getMonth());
};

/* ======================================================
    ▼ 設定画面
====================================================== */

document.getElementById("settings-btn").onclick = () => {
    document.getElementById("username-input").value = data.username;
    showScreen("settings-screen");
};

document.getElementById("close-settings").onclick = () => {
    showScreen("main-screen");
};

/* ▼ ユーザー名変更 */
document.getElementById("save-username").onclick = () => {
    const name = document.getElementById("username-input").value;
    if (!name) return alert("名前を入力してください");

    data.username = name;
    saveData();
    updateUI();

    alert("保存しました！");
};

/* ▼ データ削除 */
document.getElementById("delete-data").onclick = () => {
    if (!confirm("本当に全データを削除しますか？")) return;

    localStorage.removeItem("taskquest-data");
    location.reload();
};

/* ======================================================
    ▼ UI更新
====================================================== */
function updateUI() {
    document.getElementById("username-display").textContent = data.username;
    document.getElementById("points-display").textContent = data.points;
    document.getElementById("level-display").textContent = data.level;
    document.getElementById("exp-bar").value = data.exp;
    document.getElementById("exp-bar").max = data.level * 100;

    updateBossUI();
    renderTasks();
}

/* ======================================================
    ▼ 初期化
====================================================== */
updateUI();
drawAvatar();
