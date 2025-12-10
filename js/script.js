// -----------------
// 自作アカウント
// -----------------
function registerUser() {
  const name = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if(!name || !pass) return alert("両方入力してください");
  const users = JSON.parse(localStorage.getItem("users")||"{}");
  if(users[name]) return alert("そのユーザー名はすでに存在します");
  users[name] = pass;
  localStorage.setItem("users", JSON.stringify(users));
  alert("登録完了！");
}

function loginUser() {
  const name = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const users = JSON.parse(localStorage.getItem("users")||"{}");
  if(users[name] && users[name]===pass){
    alert(`ようこそ、${name}さん！`);
    document.getElementById('login-panel').style.display="none";
    document.querySelector('main').style.display="flex";
  } else {
    document.getElementById('login-msg').textContent="ユーザー名かパスワードが違います";
  }
}

// -----------------
// タスク・ポイント管理
// -----------------
let tasks = [];
let points = 0;
let currentLevel = 1;

// チーム
let team = { name: '', members: [], points: 0 };

// RPGモード
let rpgExp = 0;
let rpgLevel = 1;

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
  updateTeamUI();
  updateRPGUI();
}

function getLevel(points) { return Math.min(3, Math.floor(points/10)+1); }
function getNextLevelPoints(level) { return level*10; }

function updateAvatar() {
  const level = getLevel(points);
  document.getElementById('hero-avatar').src = `images/avatar${level}.png`;
  document.getElementById('points').textContent = `ポイント: ${points}`;
  document.getElementById('level-text').textContent = `レベル: ${level}`;
  document.getElementById('level-bar').style.width = `${Math.min(points/getNextLevelPoints(level-1),1)*100}%`;
  if(level>currentLevel) currentLevel = level;
}

function addTask() {
  const input = document.getElementById('new-task');
  const text = input.value.trim();
  const pointsInput = parseInt(document.getElementById('task-points').value) || 1;
  if(!text) return;
  tasks.push({ text, completed:false, points:pointsInput });
  saveTasks();
  renderTasks();
  input.value='';
  document.getElementById('task-points').value=1;
}

function toggleTask(index) {
  const task = tasks[index];
  task.completed = !task.completed;
  if(task.completed){
    points += task.points;
    team.points += task.points;
    addExp(task.points);
  }
  saveTasks();
  renderTasks();
  updateAvatar();
  updateTeamUI();
  updateRPGUI();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML='';
  tasks.forEach((task,index)=>{
    const li = document.createElement('li');
    li.textContent = `${task.text} (${task.points}P)`;
    if(task.completed) li.style.textDecoration='line-through';
    li.onclick=()=>toggleTask(index);
    list.appendChild(li);
  });
}

// -----------------
// チームUI
// -----------------
function createTeam() {
  const name = prompt("チーム名を入力");
  if(name){ team.name=name; team.members=['あなた']; team.points=0; updateTeamUI(); }
}
function joinTeam() {
  const name = prompt("参加するチーム名を入力");
  if(name){ team.name=name; team.members.push('あなた'); updateTeamUI(); }
}
function updateTeamUI() {
  document.getElementById('team-name').textContent=`チーム名: ${team.name}`;
  document.getElementById('team-points').textContent=`チームポイント: ${team.points}`;
}

// -----------------
// RPGモード
// -----------------
function addExp(p){ 
  rpgExp+=p; 
  const nextLevelExp = rpgLevel*10; 
  if(rpgExp>=nextLevelExp){ rpgLevel++; rpgExp-=nextLevelExp; } 
  updateRPGUI(); 
}
function updateRPGUI(){
  document.getElementById('exp').textContent=`経験値: ${rpgExp}`;
  document.getElementById('rpg-level-bar').style.width=`${(rpgExp/(rpgLevel*10))*100}%`;
}

// -----------------
// モーダル
// -----------------
const modal=document.getElementById('task-modal');
document.getElementById('open-task-modal').onclick=()=>modal.style.display='block';
document.getElementById('close-task-modal').onclick=()=>modal.style.display='none';
window.onclick=function(e){ if(e.target==modal) modal.style.display='none'; }

loadTasks();

