// タスク管理
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const createBtn = document.getElementById('create-task-btn');
const finishBtn = document.getElementById('finish-task-btn');
const deleteBtn = document.getElementById('delete-task-btn');

let tasks = [];

createBtn.addEventListener('click', () => {
    const value = taskInput.value.trim();
    if(value) {
        const li = document.createElement('li');
        li.textContent = value;
        li.addEventListener('click', () => {
            li.classList.toggle('done');
            updateButtons();
        });
        taskList.appendChild(li);
        taskInput.value = '';
        tasks.push(value);
        updateButtons();
    }
});

function updateButtons() {
    const selected = Array.from(taskList.children).some(li => li.classList.contains('done'));
    finishBtn.disabled = !selected;
    deleteBtn.disabled = !selected;
}

finishBtn.addEventListener('click', () => {
    Array.from(taskList.children).forEach(li => {
        if(li.classList.contains('done')) {
            li.classList.remove('done');
            li.style.textDecoration = 'line-through';
        }
    });
    updateButtons();
});

deleteBtn.addEventListener('click', () => {
    Array.from(taskList.children).forEach(li => {
        if(li.classList.contains('done')) {
            li.remove();
        }
    });
    updateButtons();
});

// アバター描画
const canvas = document.getElementById('avatar-canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'purple';
ctx.beginPath();
ctx.arc(80, 80, 70, 0, Math.PI * 2);
ctx.fill();
