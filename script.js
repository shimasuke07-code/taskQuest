let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let currentLevel = 1;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('points', points);
}

function getLevel(totalPoints) {
  return Math.floor(totalPoints / 10) + 1;
}

function getNextLevelPoints(level) {
  return level * 10;
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `${task.text} (+${task.points}P)`;

    li.onclick = () => toggleTask(index);

    const editBtn = document.createElement('button');
    editBtn.textContent = '編集';
    editBtn.onclick = (e) => { e.stopPropagation(); editTask(index); };
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.onclick = (e) => { e.stopPropagation(); deleteTask(index); };
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById('new-task');
  const text = input.value.trim();
  const pointsInput = parseInt(document.getElementById('task-points').value) || 1;
  if (!text) return;
  tasks.push({ text, completed: false, points: pointsInput });
  input.value = '';
  document.getElementById('task-points').value = 1;
  saveTasks();
  renderTasks();
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

function editTask(index) {
  const newText = prompt("タスク内容を編集", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim() || tasks[index].text;
    const newPoints = parseInt(prompt("タスクポイントを編集", tasks[index].points)) || tasks[index].points;
    tasks[index].points = newPoints;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  if (confirm("このタスクを削除しますか？")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
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
  pop.style.left = `${window.innerWidth / 2}px`;
  pop.style.top = `100px`;
  main.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

renderTasks();
updateAvatar();
