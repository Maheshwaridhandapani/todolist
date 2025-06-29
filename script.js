
window.onload = function() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTaskToList(task.text, task.completed));
};
function addTask() {
  const input = document.getElementById('task');
  const taskText = input.value.trim();

  if (!taskText) {
    alert("Please enter a task.");
    return;
  }

  addTaskToList(taskText, false);
  saveTasks();
  input.value = '';
}
function addTaskToList(taskText, completed) {
  const li = document.createElement('li');
  li.textContent = taskText + " ";
  if (completed) 
    li.classList.add('completed');

  const completeBtn = document.createElement('button');
  completeBtn.textContent = "Completed";
  completeBtn.onclick = () => {
    li.classList.toggle('completed');
    saveTasks();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  document.getElementById('taskList').appendChild(li);
}
function saveTasks() {
  const taskList = document.getElementById('taskList');
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.firstChild.textContent.trim(),
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
