/* ======================================================
   TaskQuest Script — 完全版（画像なし / Canvas描画）
   ① アバター（髪/目/体）+ カラー変更 + パーツ拡張
   ② 敵4体（スライム/コウモリ/スケルトン/ドラゴン）
   ③ バトル：攻撃 / スキル / 魔法 / 回復
   ④ タスク・デイリー・ミッション
   ⑤ チーム作成・参加
   ⑥ カレンダー完備
   ⑦ データ保存 localStorage
====================================================== */

/* ======================================================
   基本データ
====================================================== */
let currentUser = "Hero"; // 最初のユーザー名

let points = 0;
let level = 1;
let exp = 0;
let expNeeded = 100;

let tasks = [];
let daily = [];
let missions = [];

let team = null;

let avatar = {
  hairColor: "#ffcc00",
  eyeColor: "#00aaff",
  bodyColor: "#ff99bb",
  accessoryColor: "#ffffff",
  hairType: "short",
  accessory: "none"
};

/* ========== 敵データ ========== */
const enemies = {
  slime: {name:"スライム", hp:30, max:30, atk:6, color:"#6cf"},
  bat: {name:"コウモリ", hp:25, max:25, atk:8, color:"#a0f"},
  skeleton:{name:"スケルトン", hp:50, max:50, atk:10, color:"#ddd"},
  dragon:{name:"ドラゴン", hp:200, max:200, atk:20, color:"#f44"},
};

let currentEnemy = null;

/* ======================================================
   ページ切替
====================================================== */
function goToApp(){
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("main").classList.remove("hidden");
  loadUserData(currentUser);
}

/* ======================================================
   データ保存
====================================================== */
function saveUserData(){
  const data = {
    points, level, exp, tasks, daily, missions,
    team, avatar
  };
  localStorage.setItem("taskquest_"+currentUser, JSON.stringify(data));
}

function loadUserData(name){
  const data = JSON.parse(localStorage.getItem("taskquest_"+name));
  if(data){
    points = data.points;
    level = data.level;
    exp = data.exp;
    tasks = data.tasks;
    daily = data.daily;
    missions = data.missions;
    team = data.team;
    avatar = data.avatar;
  }

  // UI反映
  document.getElementById("username-display").textContent = "ユーザー名：" + currentUser;
  document.getElementById("points").textContent = "ポイント：" + points;

  renderAvatar();
  renderTasks();
  renderDaily();
  renderMissions();
  renderCalendar();
  renderTeam();
}

/* ======================================================
   レベルアップ
====================================================== */
function addExp(amount){
  exp += amount;
  if(exp >= expNeeded){
    exp -= expNeeded;
    level++;
    expNeeded = Math.floor(expNeeded * 1.4);
  }
  saveUserData();
}

/* ======================================================
   タスク
====================================================== */
function openTaskMaker(){
  const name = prompt("タスク名は？");
  if(!name) return;
  tasks.push({name, done:false});
  renderTasks();
  saveUserData();
}

function toggleTask(i){
  tasks[i].done = !tasks[i].done;
  if(tasks[i].done){
    points += 10;
    addExp(20);
  }
  renderTasks();
  saveUserData();
}

function renderTasks(){
  const box = document.getElementById("task-list");
  box.innerHTML = "";

  tasks.forEach((t,i)=>{
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerHTML = `
      <span>${t.name}</span>
      <button onclick="toggleTask(${i})">${t.done?"✓":"完了"}</button>
    `;
    box.appendChild(div);
  });

  document.getElementById("points").textContent = "ポイント：" + points;
}

/* ======================================================
   デイリー
====================================================== */
function renderDaily(){
  const box = document.getElementById("daily-list");
  box.innerHTML = "";
  daily.forEach((d,i)=>{
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerHTML = `
      <span>${d.name}</span>
      <button onclick="toggleDaily(${i})">✓</button>
    `;
    box.appendChild(div);
  });
}

function toggleDaily(i){
  points += 5;
  addExp(10);
  renderDaily();
  saveUserData();
}

/* ======================================================
   ミッション
====================================================== */
function openMissionMaker(){
  const name = prompt("ミッション名は？");
  if(!name) return;
  missions.push({name, hp: 100});
  renderMissions();
  saveUserData();
}

function damageMission(i){
  missions[i].hp -= 20;
  if(missions[i].hp <= 0){
    points += 50;
    missions.splice(i,1);
  }
  renderMissions();
  saveUserData();
}

function renderMissions(){
  const box = document.getElementById("mission-list");
  box.innerHTML = "";

  missions.forEach((m,i)=>{
    const div = document.createElement("div");
    div.className = "mission-card";
    div.innerHTML = `
      <span>${m.name}（HP:${m.hp}）</span>
      <button onclick="damageMission(${i})">進捗</button>
    `;
    box.appendChild(div);
  });
}

/* ======================================================
   チーム
====================================================== */
function makeTeam(){
  const name = prompt("チーム名を入力");
  if(!name) return;
  team = {name, score:0};
  renderTeam();
  saveUserData();
}

function joinTeam(){
  const name = prompt("参加したいチーム名");
  if(!name) return;
  team = {name, score:0};
  renderTeam();
  saveUserData();
}

function renderTeam(){
  const box = document.getElementById("team-display");
  if(team){
    box.textContent = `チーム：${team.name}（スコア ${team.score}）`;
  } else {
    box.textContent = "チームなし";
  }
}

/* ======================================================
   カレンダー
====================================================== */
function renderCalendar(){
  const box = document.getElementById("calendar");
  box.innerHTML = "";

  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();

  for(let i=1;i<=days;i++){
    const d = document.createElement("div");
    d.className = "calendar-day";
    d.textContent = i;
    box.appendChild(d);
  }
}

/* ======================================================
   アバター描画（Canvas）
====================================================== */
function renderAvatar(){
  const c = document.getElementById("avatar-canvas");
  const ctx = c.getContext("2d");

  ctx.clearRect(0,0,c.width,c.height);

  /* --- 体 --- */
  ctx.fillStyle = avatar.bodyColor;
  ctx.fillRect(45,60,30,50);

  /* --- 顔 --- */
  ctx.fillStyle = avatar.bodyColor;
  ctx.fillRect(45,30,30,30);

  /* --- 目 --- */
  ctx.fillStyle = avatar.eyeColor;
  ctx.fillRect(55,45,5,5);
  ctx.fillRect(65,45,5,5);

  /* --- 髪型 --- */
  ctx.fillStyle = avatar.hairColor;
  if(avatar.hairType === "short"){
    ctx.fillRect(40,25,40,10);
  } else if(avatar.hairType === "long"){
    ctx.fillRect(40,25,40,25);
  } else if(avatar.hairType === "twin"){
    ctx.fillRect(40,25,40,10);
    ctx.fillRect(30,35,10,20);
    ctx.fillRect(80,35,10,20);
  }

  /* --- アクセサリー --- */
  ctx.fillStyle = avatar.accessoryColor;
  if(avatar.accessory === "crown"){
    ctx.fillRect(48,22,24,6);
  }
}

/* ======================================================
   アバター編集
====================================================== */
function openAvatarEditor(){
  document.getElementById("avatar-editor").classList.remove("hidden");
  document.getElementById("hair-color").value = avatar.hairColor;
  document.getElementById("eye-color").value = avatar.eyeColor;
  document.getElementById("body-color").value = avatar.bodyColor;
}

function closeAvatarEditor(){
  document.getElementById("avatar-editor").classList.add("hidden");
}

function saveAvatar(){
  avatar.hairColor = document.getElementById("hair-color").value;
  avatar.eyeColor = document.getElementById("eye-color").value;
  avatar.bodyColor = document.getElementById("body-color").value;
  closeAvatarEditor();
  renderAvatar();
  saveUserData();
}

/* ======================================================
   バトルシステム
====================================================== */
function openBattleMenu(){
  const enemy = prompt("戦う敵を選択：slime / bat / skeleton / dragon");
  if(!enemy || !enemies[enemy]) return;

  // 敵のコピー
  currentEnemy = JSON.parse(JSON.stringify(enemies[enemy]));
  renderEnemy();
  renderBattleActions();
}

function renderEnemy(){
  const c = document.getElementById("enemy-canvas");
  const ctx = c.getContext("2d");

  ctx.clearRect(0,0,c.width,c.height);

  ctx.fillStyle = currentEnemy.color;
  ctx.beginPath();
  ctx.arc(75,60,40,0,Math.PI*2);
  ctx.fill();

  document.getElementById("enemy-hp").textContent =
    `${currentEnemy.name} HP: ${currentEnemy.hp}/${currentEnemy.max}`;
}

function renderBattleActions(){
  const box = document.getElementById("battle-actions");
  box.innerHTML = `
    <button onclick="attack()">攻撃</button>
    <button onclick="skill()">スキル</button>
    <button onclick="magic()">魔法</button>
    <button onclick="heal()">回復</button>
  `;
}

function attack(){
  const dmg = 10 + Math.floor(Math.random()*5);
  currentEnemy.hp -= dmg;

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }

  enemyAttack();
  renderEnemy();
}

function skill(){
  const dmg = 20 + Math.floor(Math.random()*10);
  currentEnemy.hp -= dmg;

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }

  enemyAttack();
  renderEnemy();
}

function magic(){
  const dmg = 30;
  currentEnemy.hp -= dmg;

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }

  enemyAttack();
  renderEnemy();
}

function heal(){
  exp += 10;
  enemyAttack();
}

function enemyAttack(){
  exp -= 2;
}

function finishBattle(){
  alert(currentEnemy.name + " を倒した！");
  points += 50;
  addExp(40);
  currentEnemy = null;
  document.getElementById("enemy-hp").textContent = "";
  document.getElementById("battle-actions").innerHTML = "";
  const c = document.getElementById("enemy-canvas").getContext("2d");
  c.clearRect(0,0,150,120);
  saveUserData();
}

/* ======================================================
   テーマ切替
====================================================== */
function setDay(){
  document.body.classList.remove("night-bg");
  document.body.classList.add("day-bg");
}

function setNight(){
  document.body.classList.remove("day-bg");
  document.body.classList.add("night-bg");
}

/* ======================================================
   設定：名前変更 / データ削除
====================================================== */
function changeName(){
  const name = prompt("新しい名前は？");
  if(!name) return;
  currentUser = name;
  document.getElementById("username-display").textContent = "ユーザー名：" + currentUser;
  saveUserData();
}

function resetData(){
  if(!confirm("本当に削除しますか？")) return;
  localStorage.removeItem("taskquest_"+currentUser);
  location.reload();
}

/* ======================================================
   アバターアニメーション
====================================================== */

function animateAvatar(){
  avatarFrame++;

  const c = document.getElementById("avatar-canvas");
  const ctx = c.getContext("2d");

  // 背景グラデーション
  const bg = ctx.createLinearGradient(0,0,c.width,c.height);
  bg.addColorStop(0,"#111");
  bg.addColorStop(1,"#222");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,c.width,c.height);

  // アバター体呼吸
  const breath = Math.sin(avatarFrame / 20) * 2;  
  const hairMove = Math.sin(avatarFrame / 10) * 1; 

  // 体
  ctx.fillStyle = avatar.bodyColor;
  ctx.fillRect(45,60 + breath,30,50);

  // 顔
  ctx.fillRect(45,30 + breath,30,30);

  // 目（まばたき）
  let blink = (avatarFrame % 120 < 5);
  ctx.fillStyle = avatar.eyeColor;
  if(!blink){
    ctx.fillRect(55,45 + breath,5,5);
    ctx.fillRect(65,45 + breath,5,5);
  } else {
    ctx.fillRect(55,47 + breath,5,1);
    ctx.fillRect(65,47 + breath,5,1);
  }

  // 髪
  ctx.fillStyle = avatar.hairColor;
  if(avatar.hairType === "short"){
    ctx.fillRect(40 + hairMove,25,40,10);
  } else if(avatar.hairType === "long"){
    ctx.fillRect(40 + hairMove,25,40,25);
  } else if(avatar.hairType === "twin"){
    ctx.fillRect(40 + hairMove,25,40,10);
    ctx.fillRect(30,35,10,20);
    ctx.fillRect(80,35,10,20);
  }

  // アクセサリー
  ctx.fillStyle = avatar.accessoryColor;
  if(avatar.accessory === "crown"){
    ctx.fillRect(48 + hairMove,22,24,6);
  }

  // 枠
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(0,0,c.width,c.height);

  requestAnimationFrame(animateAvatar);
}
requestAnimationFrame(animateAvatar);

/* ======================================================
   敵アニメーション
====================================================== */

let enemyFrame = 0;
let enemyShake = 0;

function animateEnemy(){
  enemyFrame++;

  const c = document.getElementById("enemy-canvas");
  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  if(!currentEnemy) return requestAnimationFrame(animateEnemy);

  // 攻撃で揺れる
  let shake = Math.sin(enemyFrame / 5) * enemyShake;

  // 本体
  ctx.fillStyle = currentEnemy.color;
  ctx.beginPath();
  ctx.arc(75 + shake,60,40,0,Math.PI*2);
  ctx.fill();

  // ダメージ時フラッシュ
  if(enemyShake > 0){
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(75,60,40,0,Math.PI*2);
    ctx.fill();
    enemyShake *= 0.9;
  }

  document.getElementById("enemy-hp").textContent =
    `${currentEnemy.name} HP: ${currentEnemy.hp}/${currentEnemy.max}`;

  requestAnimationFrame(animateEnemy);
}

requestAnimationFrame(animateEnemy);

/* --- バトル関数を修正 --- */
function attack(){
  const dmg = 10 + Math.floor(Math.random()*5);
  currentEnemy.hp -= dmg;
  enemyShake = 5; // 攻撃時揺れる

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }
  enemyAttack();
}

function skill(){
  const dmg = 20 + Math.floor(Math.random()*10);
  currentEnemy.hp -= dmg;
  enemyShake = 7;

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }
  enemyAttack();
}

function magic(){
  const dmg = 30;
  currentEnemy.hp -= dmg;
  enemyShake = 10;

  if(currentEnemy.hp <= 0){
    finishBattle();
    return;
  }
  enemyAttack();
}

/* ======================================================
   パーツショップ
====================================================== */

const shopItems = [
  {id:1,name:"赤い帽子",type:"hat",color:"#ff0000",price:50},
  {id:2,name:"青い髪飾り",type:"accessory",color:"#0000ff",price:100},
  {id:3,name:"緑のマント",type:"cape",color:"#00ff00",price:150}
];

function openShop(){
  const shopDiv = document.getElementById("shop");
  shopDiv.innerHTML = "<h3>パーツショップ</h3>";

  shopItems.forEach(item=>{
    const btn = document.createElement("button");
    btn.textContent = `${item.name} - ${item.price}pt`;
    btn.onclick = ()=>{
      if(user.points >= item.price){
        user.points -= item.price;
        avatar[item.type] = item.color;
        alert(`${item.name} をゲット！`);
        updateUI();
      } else {
        alert("ポイントが足りません！");
      }
    };
    shopDiv.appendChild(btn);
    shopDiv.appendChild(document.createElement("br"));
  });
}

// UI更新にポイント表示追加
function updateUI(){
  document.getElementById("points").textContent = `ポイント: ${user.points}`;
}

// ショップ用ボタン
document.getElementById("open-shop").onclick = openShop;

/* ======================================================
   チームボス戦
====================================================== */

let boss = {
  name: "巨大ボス",
  maxHP: 1000,
  hp: 1000,
  color: "#880000"
};

function drawBoss(){
  const c = document.getElementById("enemy-canvas");
  const ctx = c.getContext("2d");

  ctx.clearRect(0,0,c.width,c.height);

  // 背景
  const bg = ctx.createLinearGradient(0,0,c.width,c.height);
  bg.addColorStop(0,"#330000");
  bg.addColorStop(1,"#550000");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,c.width,c.height);

  // ボス円
  ctx.fillStyle = boss.color;
  ctx.beginPath();
  ctx.arc(c.width/2, c.height/2, 50, 0, Math.PI*2);
  ctx.fill();

  // HPバー
  ctx.fillStyle = "#fff";
  ctx.fillRect(10,10,c.width-20,10);
  ctx.fillStyle = "#0f0";
  ctx.fillRect(10,10,(c.width-20)*(boss.hp/boss.maxHP),10);

  // HPテキスト
  ctx.fillStyle = "#fff";
  ctx.font = "12px Arial";
  ctx.fillText(`HP: ${boss.hp}/${boss.maxHP}`, 10, 35);

  requestAnimationFrame(drawBoss);
}
requestAnimationFrame(drawBoss);

// 攻撃関数
function attackBoss(dmg){
  boss.hp -= dmg;
  if(boss.hp < 0) boss.hp = 0;

  if(boss.hp === 0){
    alert("ボスを倒した！おめでとう！");
    boss.hp = boss.maxHP; // リセット
  }
}

