// データの初期化
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;
let exp = parseInt(localStorage.getItem('exp')) || 0;

// カテゴリごとの色
const categoryColors = { '習慣':'#ff9999', '今日':'#99ccff', 'やること':'#99ff99' };

// タスク追加
function addTask() {
  const input = document.getElementById('taskInput');
  const category = document.getElementById('categorySelect').value;
  if(input.value === "") return;
  tasks.push({ text: input.value, done: false, category: category });
  input.value = "";
  saveData();
  renderTasks();
}

// タスク完了切替
function toggleDone(index) {
  const task = tasks[index];
  task.done = !task.done;
  points += task.done ? 10 : -10;
  exp += task.done ? 10 : -10;
  while(exp >= 50) { level++; exp -= 50; alert("レベルアップ！🎉 レベル:" + level); }
  saveData();
  renderTasks();
  updateSidebar();
  updateAvatarAppearance();
}

// タスク表示
function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const div = document.createElement('div');
    div.className = "task" + (task.done ? " done" : "");
    div.innerText = task.text;
    div.style.backgroundColor = categoryColors[task.category];
    div.onclick = () => toggleDone(i);
    taskList.appendChild(div);
  });
}

// サイドバー更新
function updateSidebar() {
  document.getElementById('points').innerText = points;
  document.getElementById('level').innerText = level;
  document.getElementById('exp').innerText = exp + "/50";
}

// サイドバー開閉
function toggleSidebar() {
  document.querySelector('.sidebar-left').classList.toggle('active');
  document.querySelector('.sidebar-right').classList.toggle('active');
}

// アバター見た目変化
function updateAvatarAppearance() {
  const avatar = document.getElementById('avatar');
  if(level < 3) avatar.style.borderColor = "white";
  else if(level < 5) avatar.style.borderColor = "gold";
  else avatar.style.borderColor = "red";
}

// localStorageに保存
function saveData() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('points', points);
  localStorage.setItem('level', level);
  localStorage.setItem('exp', exp);
}

// 初期表示
renderTasks();
updateSidebar();
updateAvatarAppearance();
