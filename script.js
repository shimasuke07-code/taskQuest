// ---------- ユーザー情報 ----------
let username = localStorage.getItem('username') || 'ヒーロー';
let points = parseInt(localStorage.getItem('points')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;

document.getElementById('username-display').textContent = username;
document.getElementById('points-display').textContent = points;
document.getElementById('level-display').textContent = level;

// ---------- タスク管理 ----------
const taskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const createTaskBtn = document.getElementById('create-task-btn');
let selectedTask = null;

// タスクを localStorage から読み込む
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(task => addTaskToList(task));

createTaskBtn.addEventListener('click', () => {
    const taskName = taskInput.value.trim();
    if(taskName === '') return;
    const task = { name: taskName, done: false };
    tasks.push(task);
    saveTasks();
    addTaskToList(task);
    taskInput.value = '';
});

function addTaskToList(task) {
    const li = document.createElement('li');
    li.textContent = task.name;
    li.addEventListener('click', () => {
        Array.from(taskList.children).forEach(c => c.classList.remove('selected'));
        li.classList.add('selected');
        selectedTask = li;
        document.getElementById('finish-task-btn').disabled = false;
        document.getElementById('delete-task-btn').disabled = false;
    });
    taskList.appendChild(li);
}

document.getElementById('finish-task-btn').addEventListener('click', () => {
    if(!selectedTask) return;
    points += 10;
    localStorage.setItem('points', points);
    document.getElementById('points-display').textContent = points;
});

document.getElementById('delete-task-btn').addEventListener('click', () => {
    if(!selectedTask) return;
    const index = Array.from(taskList.children).indexOf(selectedTask);
    tasks.splice(index,1);
    saveTasks();
    selectedTask.remove();
    selectedTask = null;
    document.getElementById('finish-task-btn').disabled = true;
    document.getElementById('delete-task-btn').disabled = true;
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ---------- アバター描画 ----------
const canvas = document.getElementById('avatar-canvas');
const ctx = canvas.getContext('2d');

function drawAvatar() {
    // ドット絵例（本格的にパーツ増やして拡張可能）
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // 顔
    ctx.fillStyle = '#FFD1A4';
    ctx.fillRect(60,40,40,40);
    // 目
    ctx.fillStyle = '#000';
    ctx.fillRect(70,50,5,5);
    ctx.fillRect(85,50,5,5);
    // 口
    ctx.fillStyle = '#900';
    ctx.fillRect(75,70,10,5);
}

drawAvatar();

