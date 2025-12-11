// -------------------------
// プレイヤーデータロード
let playerData = JSON.parse(localStorage.getItem("taskquestPlayer")) || {
    username: "ヒーロー",
    level: 1,
    points: 50,
    tasks: [],
    avatarParts: []
};

const usernameDisplay = document.getElementById("username-display");
const pointsDisplay = document.getElementById("points-display");
const levelDisplay = document.getElementById("level-display");

function updateHeader() {
    usernameDisplay.textContent = playerData.username;
    pointsDisplay.textContent = playerData.points;
    levelDisplay.textContent = playerData.level;
}
usernameDisplay.onclick = () => {
    const newName = prompt("新しいユーザー名を入力してください:", playerData.username);
    if(newName){
        playerData.username = newName;
        saveData();
        updateHeader();
    }
};
updateHeader();

// -------------------------
// タスク管理
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const createBtn = document.getElementById("create-task-btn");

function saveData(){
    localStorage.setItem("taskquestPlayer", JSON.stringify(playerData));
    updateHeader();
}

function renderTasks(){
    taskList.innerHTML = "";
    playerData.tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.name + (task.done ? " ✅" : "");
        li.onclick = () => {
            playerData.tasks[index].done = !playerData.tasks[index].done;
            if(task.done) playerData.points += 10;
            saveData();
            renderTasks();
        }
        taskList.appendChild(li);
    });
}

createBtn.onclick = () => {
    const name = taskInput.value.trim();
    if(name){
        playerData.tasks.push({name, done:false});
        taskInput.value = "";
        saveData();
        renderTasks();
    }
};
renderTasks();

// -------------------------
// アバター描画
const avatarCanvas = document.getElementById("avatar-canvas");
const ctx = avatarCanvas.getContext("2d");

function drawAvatar(){
    ctx.clearRect(0,0,avatarCanvas.width,avatarCanvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCanvas.width/2, avatarCanvas.height/2, avatarCanvas.width/2,0,Math.PI*2);
    ctx.clip();
    ctx.fillStyle = "#004488";
    ctx.fillRect(0,0,avatarCanvas.width,avatarCanvas.height);
    playerData.avatarParts.forEach((part,i)=>{
        ctx.fillStyle = part.color;
        ctx.fillRect(avatarCanvas.width/2-20, avatarCanvas.height/2-20+i*5, 40, 10);
    });
    ctx.restore();
}
drawAvatar();

// -------------------------
// アバターショップ・編集
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const shopParts = [
    {name:"ヘルメット", color:"#ff0000", price:30},
    {name:"マント", color:"#00ff00", price:40},
    {name:"ブーツ", color:"#0000ff", price:20}
];

function openShop(){
    modalContent.innerHTML = "<h2>ショップ</h2>";
    shopParts.forEach((part, index) => {
        const div = document.createElement("div");
        div.style.display="flex"; div.style.alignItems="center"; div.style.margin="5px 0";
        const box = document.createElement("div");
        box.style.width="30px"; box.style.height="30px"; box.style.background=part.color; box.style.marginRight="10px";
        div.appendChild(box);
        const span = document.createElement("span"); span.textContent=`${part.name} (${part.price}ポイント)`; span.style.flex="1";
        div.appendChild(span);
        const btn = document.createElement("button");
        btn.textContent="購入";
        btn.onclick = () => {
            if(playerData.points >= part.price){
                playerData.points -= part.price;
                playerData.avatarParts.push(part);
                saveData(); drawAvatar();
                alert(`${part.name}を購入しました！`);
            } else { alert("ポイントが足りません"); }
        }
        div.appendChild(btn);
        modalContent.appendChild(div);
    });
    modal.style.display="block";
}

function openAvatarEditor(){
    modalContent.innerHTML="<h2>アバター編集</h2>";
    const canvas = document.createElement("canvas");
    canvas.width=160; canvas.height=160;
    const ctx2 = canvas.getContext("2d");
    function drawEditor(){
        ctx2.clearRect(0,0,canvas.width,canvas.height);
        ctx2.save();
        ctx2.beginPath();
        ctx2.arc(canvas.width/2, canvas.height/2, canvas.width/2,0,Math.PI*2);
        ctx2.clip();
        ctx2.fillStyle="#004488";
        ctx2.fillRect(0,0,canvas.width,canvas.height);
        playerData.avatarParts.forEach((part,i)=>{
            ctx2.fillStyle=part.color;
            ctx2.fillRect(canvas.width/2-20, canvas.height/2-20+i*5, 40, 10);
        });
        ctx2.restore();
        requestAnimationFrame(drawEditor);
    }
    drawEditor();
    modalContent.appendChild(canvas);
    modal.style.display="block";
}

document.getElementById("open-shop").onclick = openShop;
document.getElementById("open-avatar-editor").onclick = openAvatarEditor;

// モーダルクリックで閉じる
modal.onclick = (e) => {
    if(e.target === modal) modal.style.display="none";
}
