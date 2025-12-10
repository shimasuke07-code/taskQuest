let tasks = [];
let points = 0;
let currentLevel = 1;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('points', points);
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = savedTasks;
  points = parseInt(localStorage.getItem('points')) || 0;
  updateAvatar();
  renderTasks();
}

function getLevel(points) {
  return Math.min(3, Math.floor(points / 10) + 1);
}

function getNextLevelPoints(level) {
  return level * 10;
}

function updateAvatar() {
  const level = getLevel(points);
  const avatarImg = `images/avatar${level}.png`;
  const avatarEl = document.getElementById('hero-avatar');
  avatarEl.src = avatarImg;

  document.getElementById('points').textContent = `ポイント: ${points}`;
  document.getElementById('level-text').textContent = `レベル: ${level}`;

  const nextLevelPoints = getNextLevelPoints(level - 1);
  let progress = Math.min(points / nextLevelPoints, 1) * 100;
  document.getElementById('level-bar').style.width = `${progress}%`;

  if (level > currentLevel) {
    avatarEl.classList.add('level-up');
    document.body.classList.add('level-flash');
    setTimeout(() => avatarEl.classList.remove('level-up'), 500);
    setTimeout(() => document.body.classList.remove('level-flash'), 500);
    currentLevel = level;
  }
}

function showPointsEffect(pointsGained) {
  const main = document.querySelector('main');
  const pop = document.createElement('div');
  pop.className = 'points-pop';
  pop.textContent = `+${pointsGained}P`;

  const avatarEl = document.getElementById('hero-avatar');
  const rect = avatarEl.getBoundingClientRect();
  pop.style.left = `${rect.left + rect.width/2 - 20}px`;
  pop.style.top = `${rect.top}px`;

  main.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

function addTask() {
  const input = document.getElementById('new-task');
  const text = input.value.trim();
  const pointsInput = parseInt(document.getElementById('task-points').value) || 1;
  if (!text) return;

  tasks.push({ text, completed: false, points: pointsInput });
  saveTasks();
  renderTasks();
  showTaskPop(pointsInput);

  input.value = '';
  document.getElementById('task-points').value = 1;
}

function showTaskPop(points) {
  const main = document.querySelector('main');
  const pop = document.createElement('div');
  pop.className = 'task-pop';
  pop.textContent = `タスク追加 +${points}P`;

  const panel = document.getElementById('task-add-panel');
  const rect = panel.getBoundingClientRect();
  pop.style.left = `${rect.left + rect.width / 2 - 50}px`;
  pop.style.top = `${rect.top}px`;

  main.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

function toggleTask(index) {
  const task = tasks[index];
  task.completed = !task.completed;
  if (task.completed) {
    points += task.points;
    showPointsEffect(task.points);

    const listItems = document.querySelectorAll('#task-list li');
    const li = listItems[index];
    li.classList.add('task-complete');
    setTimeout(() => li.classList.remove('task-complete'), 500);
  }
  saveTasks();
  renderTasks();
  updateAvatar();
}

function deleteTask(index) {
  if (confirm("このタスクを削除しますか？")) {
    const listItems = document.querySelectorAll('#task-list li');
    const li = listItems[index];
    li.classList.add('task-delete');
    setTimeout(() => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }, 500);
  }
}

function editTask(index) {
  const li = document.querySelectorAll('#task-list li')[index];
  li.classList.add('task-edit');

  const newText = prompt("タスク内容を編集", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim() || tasks[index].text;
    const newPoints = parseInt(prompt("タスクポイントを編集", tasks[index].points)) || tasks[index].points;
    tasks[index].points = newPoints;
    saveTasks();
    renderTasks();
  }

  setTimeout(() => li.classList.remove('task-edit'), 500);
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = `${task.text} (${task.points}P)`;
    if (task.completed) li.style.textDecoration = 'line-through';
    li.onclick = () => toggleTask(index);
    
    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.onclick = (e) => { e.stopPropagation(); editTask(index); };
    li.appendChild(editBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.onclick = (e) => { e.stopPropagation(); deleteTask(index); };
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

// モーダル開閉
const modal = document.getElementById('task-modal');
const openBtn = document.getElementById('open-task-modal');
const closeBtn = document.getElementById('close-task-modal');

function closeModal() { modal.style.display = 'none'; }

openBtn.onclick = () => { modal.style.display = 'block'; }
closeBtn.onclick = () => { closeModal(); }

window.onclick = function(event) {
  if (event.target == modal) { closeModal(); }
}

loadTasks();

