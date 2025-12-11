// ユーザー情報
let username = "ヒーロー";
let points = 50;
let level = 1;

const usernameDisplay = document.getElementById("username-display");
const pointsDisplay = document.getElementById("points-display");
const levelDisplay = document.getElementById("level-display");

function updateProfile() {
    usernameDisplay.textContent = username;
    pointsDisplay.textContent = points;
    levelDisplay.textContent = level;
}

updateProfile();

// タスク管理
const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task-input");
const createTaskBtn = document.getElementById("create-task-btn");
const finishTaskBtn = document.getElementById("finish-task-btn");
const deleteTaskBtn = document.getElementById("delete-task-btn");

createTaskBtn.addEventListener("click", () => {
    const taskText = newTaskInput.value.trim();
    if (!taskText) return;
    const li = document.createElement("li");
    li.textContent = taskText;
    li.addEventListener("click", () => {
        li.classList.toggle("selected");
        finishTaskBtn.disabled = !taskList.querySelector(".selected");
        deleteTaskBtn.disabled = !taskList.querySelector(".selected");
    });
    taskList.appendChild(li);
    newTaskInput.value = "";
});

finishTaskBtn.addEventListener("click", () => {
    const selected = taskList.querySelectorAll(".selected");
    selected.forEach(li => {
        li.remove();
        points += 10;
    });
    updateProfile();
    finishTaskBtn.disabled = true;
    deleteTaskBtn.disabled = true;
});

deleteTaskBtn.addEventListener("click", () => {
    const selected = taskList.querySelectorAll(".selected");
    selected.forEach(li => li.remove());
    finishTaskBtn.disabled = true;
    deleteTaskBtn.disabled = true;
});

// アバター
const canvas = document.getElementById("avatar-canvas");
const ctx = canvas.getContext("2d");

function drawAvatar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(40, 40, 80, 80); // 仮のドット絵
}

drawAvatar();
