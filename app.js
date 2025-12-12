let tasks = JSON.parse(localStorage.getItem("tasks"))||[];
const taskInput=document.getElementById("taskInput");
const category=document.getElementById("category");
const priority=document.getElementById("priority");
const date=document.getElementById("date");
const addBtn=document.getElementById("addBtn");
const voiceBtn=document.getElementById("voiceBtn");
const search=document.getElementById("search");
const taskList=document.getElementById("taskList");
const completedList=document.getElementById("completedList");
const tasksSection=document.getElementById("tasksSection");
const completedSection=document.getElementById("completedSection");
const barr=document.getElementById("barr");
const bargreen=document.getElementById("bargreen");
const modeBtn=document.getElementById("modeBtn");
const exportPDF=document.getElementById("exportPDF");
const exportExcel=document.getElementById("exportExcel");

// Save & Render
function save(){localStorage.setItem("tasks",JSON.stringify(tasks)); renderTasks();}

function renderTasks(){
    taskList.innerHTML=""; 
    completedList.innerHTML="";

    let activeCount = 0;
    let completedCount = 0;

    tasks.forEach((t,i)=>{
        const card = document.createElement("div");
        card.className = "task-card" + (t.completed ? " completed" : "");
        card.innerHTML = `
        <div class="task-info">
          <strong>${t.text}</strong>
          <p>${t.category} • ${t.priority} • ${t.date}</p>
        </div>
        <div class="task-buttons">
          <button onclick="toggle(${i})">✔</button>
          <button onclick="editTask(${i})">✏</button>
          <button onclick="remove(${i})">🗑</button>
        </div>
        `;
        if(t.completed){
            completedList.appendChild(card);
            completedCount++;
        } else {
            taskList.appendChild(card);
            activeCount++;
        }
    });

    // Update progress bar
    const total = tasks.length;
    barr.textContent = `${completedCount}/${total}`;
    bargreen.style.width = total ? (completedCount / total * 100) + "%" : "0%";

    // Show/hide sections
    tasksSection.style.display = activeCount ? "block" : "none";
    completedSection.style.display = completedCount ? "block" : "none";
}

// Add Task
addBtn.onclick=()=>{
    if(!taskInput.value.trim()) return;
    tasks.push({text:taskInput.value,category:category.value,priority:priority.value,date:date.value,completed:false});
    taskInput.value=""; save();
};

// Delete Task
function remove(i){ tasks.splice(i,1); save();}

// Toggle Complete
function toggle(i){ tasks[i].completed=!tasks[i].completed; save();}

// Edit Task
function editTask(i){ let t=prompt("Edit Task",tasks[i].text); if(t){tasks[i].text=t; save();}}

// Search
search.oninput=()=>{ 
    const val=search.value.toLowerCase(); 
    document.querySelectorAll(".task-card").forEach(card=>{
        card.style.display = card.querySelector("strong").innerText.toLowerCase().includes(val)?"flex":"none";
    });
};

// Voice Input
voiceBtn.onclick=()=>{
    let recognition=new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang="en-US";
    recognition.start();
    recognition.onresult=e=>{taskInput.value=e.results[0][0].transcript;}
};

// Theme Toggle
modeBtn.onclick=()=>{
    document.body.classList.toggle("light");
    modeBtn.textContent=document.body.classList.contains("light")?"🌙 Dark Mode":"☀ Light Mode";
};

// Export PDF
exportPDF.onclick=()=>{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y=10;
    tasks.forEach(t=>{
        doc.text(`${t.text} (${t.category} | ${t.priority} | ${t.date} | ${t.completed?"✔":"✖"})`,10,y);
        y+=10;
    });
    doc.save("Tasks.pdf");
};

// Export Excel
exportExcel.onclick=()=>{
    const data = tasks.map(t=>[t.text,t.category,t.priority,t.date,t.completed?"Yes":"No"]);
    const ws = XLSX.utils.aoa_to_sheet([["Task","Category","Priority","Date","Completed"],...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb,"Tasks.xlsx");
};

renderTasks();
