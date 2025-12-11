// --- タスク管理 ---
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
    if (!taskText) return;
    const li = document.createElement('li');
    li.textContent = taskText;
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        updateButtons();
    });
    taskList.appendChild(li);
    newTaskInput.value = '';
    updateButtons();
});

finishTaskBtn.addEventListener('click', () => {
    const completed = Array.from(taskList.children).filter(li => li.classList.contains('completed'));
    completed.forEach(li => li.remove());
    points += completed.length * 10;
    pointsDisplay.textContent = points;
    updateLevel();
    updateButtons();
});

deleteTaskBtn.addEventListener('click', () => {
    const completed = Array.from(taskList.children).filter(li => li.classList.contains('completed'));
    completed.forEach(li => li.remove());
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

// --- ドット絵アバター ---
const avatarCanvas = document.getElementById('avatar-canvas');
const avatarCtx = avatarCanvas.getContext('2d');
const modal = document.getElementById('modal');
const editorCanvas = document.getElementById('editor-canvas');
const editorCtx = editorCanvas.getContext('2d');

let avatarParts = {
    hair: '#ff0000',
    body: '#ffff00',
    eyes: '#000000',
    hat: null
};

function drawAvatar(ctx, parts) {
    ctx.clearRect(0, 0, 160, 160);
    // 頭
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(60, 20, 40, 40);
    // 髪
    ctx.fillStyle = parts.hair;
    ctx.fillRect(60, 10, 40, 15);
    // 体
    ctx.fillStyle = parts.body;
    ctx.fillRect(55, 60, 50, 70);
    // 目
    ctx.fillStyle = parts.eyes;
    ctx.fillRect(70, 30, 5, 5);
    ctx.fillRect(85, 30, 5, 5);
    // 帽子（限定）
    if(parts.hat){
        ctx.fillStyle = parts.hat;
        ctx.fillRect(60, 5, 40, 10);
    }
}
drawAvatar(avatarCtx, avatarParts);

document.getElementById('open-avatar-editor').addEventListener('click', () => {
    modal.style.display = 'block';
    drawAvatar(editorCtx, avatarParts);
});

document.querySelectorAll('.part-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const part = btn.dataset.part;
        avatarParts[part] = btn.dataset.color;
        drawAvatar(editorCtx, avatarParts);
    });
});

document.getElementById('save-avatar').addEventListener('click', () => {
    drawAvatar(avatarCtx, avatarParts);
    modal.style.display = 'none';
});

document.getElementById('close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

// --- ショップ ---
const shopModal = document.getElementById('shop-modal');
const shopItemsDiv = document.getElementById('shop-items');

const shopItems = [
    {name:'帽子ピンク', part:'hat', color:'#ff00ff', price:50},
    {name:'帽子青', part:'hat', color:'#0000ff', price:50}
];

document.getElementById('open-shop').addEventListener('click', () => {
    shopModal.style.display = 'block';
    renderShop();
});
document.getElementById('close-shop').addEventListener('click', () => {
    shopModal.style.display = 'none';
});

function renderShop(){
    shopItemsDiv.innerHTML = '';
    shopItems.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = `${item.name} (${item.price}pt)`;
        btn.addEventListener('click', () => buyItem(item));
        shopItemsDiv.appendChild(btn);
    });
}
function buyItem(item){
    if(points >= item.price){
        points -= item.price;
        pointsDisplay.textContent = points;
        avatarParts[item.part] = item.color;
        drawAvatar(avatarCtx, avatarParts);
        renderShop();
    } else {
        alert('ポイントが足りません');
    }
}
