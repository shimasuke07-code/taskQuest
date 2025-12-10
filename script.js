let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let points = parseInt(localStorage.getItem('points')) || 0;
let level = parseInt(localStorage.getItem('level')) || 1;
let exp = parseInt(localStorage.getItem('exp')) || 0;

const categoryColors = { '習慣':'#ff6666', '今日':'#6699ff', 'やること':'#66ff99' };

function addTask() {
  const input = document.getElementById('taskInput');
  const category = document.getElementById('categorySelect').value;
  if(input.value === "") return;
  tasks.push({ text: input.value, done: false, category: category });
  input.value = "";
  saveData();
  renderTasks();
}

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

function updateSidebar() {
  document.getElementById('points').innerText = points;
  document.getElementById('level').innerText = level;
  document.getElementById('exp').innerText = exp + "/50";
}

function toggleSidebar() {
  document.querySelector('.sidebar-left').classList.toggle('active');
  document.querySelector('.sidebar-right').classList.toggle('active');
}

function updateAvatarAppearance() {
  const avatar = document.getElementById('avatar');
  avatar.classList.remove("level-up");
  if(level < 3) avatar.style.borderColor = "white";
  else if(level < 5) avatar.style.borderColor = "gold";
  else { avatar.style.borderColor = "red"; avatar.classList.add("level-up"); }
}

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
