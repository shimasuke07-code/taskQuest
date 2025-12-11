let points = 50;
let level = 1;

const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const createTaskBtn = document.getElementById('create-task-btn');
const finishTaskBtn = document.getElementById('finish-task-btn');
const deleteTaskBtn = document.getElementById('delete-task-btn');
const pointsDisplay = document.getElementById('points-display');
const levelDisplay = document.getElementById('level-display');

createTaskBtn.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;
    const li = document.createElement('li');
    li.textContent = taskText;
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateButtons();
    });
    taskList.appendChild(li);
    newTaskInput.value = "";
    updateButtons();
});

finishTaskBtn.addEventListener('click', () => {
    const selectedTasks = Array.from(taskList.children).filter(li => li.classList.contains('completed'));
    selectedTasks.forEach(li => {
        li.remove();
        points += 10;
    });
    pointsDisplay.textContent = points;
    updateLevel();
    updateButtons();
});

deleteTaskBtn.addEventListener('click', () => {
    const selectedTasks = Array.from(taskList.children).filter(li => li.classList.contains('completed'));
    selectedTasks.forEach(li => li.remove());
    updateButtons();
});

function updateButtons() {
    const anyCompleted = Array.from(taskList.children).some(li => li.classList.contains('completed'));
    finishTaskBtn.disabled = !anyCompleted;
    deleteTaskBtn.disabled = !anyCompleted;
}

function updateLevel() {
    level = Math.floor(points / 50) + 1;
    levelDisplay.textContent = level;
}

// アバター編集・ショップ・カレンダーは後で拡張可能

