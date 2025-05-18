let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.getElementById('filterStatus').addEventListener('change', renderTasks);
document.getElementById('filterPriority').addEventListener('change', renderTasks);

function renderTasks() {
  const statusFilter = document.getElementById('filterStatus').value;
  const priorityFilter = document.getElementById('filterPriority').value;

  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if (
      (statusFilter === 'all' || (statusFilter === 'completed') === task.completed) &&
      (priorityFilter === 'all' || priorityFilter === task.priority)
    ) {
      const taskEl = document.createElement('div');
      taskEl.className = `task ${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;

      // Overdue highlighting
      const today = new Date().toISOString().split("T")[0];
      if (task.deadline < today && !task.completed) {
        taskEl.classList.add("overdue");
      }

      const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      const countdownText = !task.completed && daysLeft >= 0 ? `Due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}` : '';

      taskEl.innerHTML = `
        <div class="title">${task.title}</div>
        <div class="meta">
          Priority: ${task.priority} | Deadline: ${task.deadline}
          ${countdownText ? `| <span style="color:#d9534f">${countdownText}</span>` : ''}
          | Status: ${task.completed ? 'Completed' : 'Pending'}
        </div>
        <div class="actions">
          <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      `;
      taskList.appendChild(taskEl);
    }
  });
}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const priority = document.getElementById('priority').value;
  const deadline = document.getElementById('deadline').value;

  tasks.push({ title, priority, deadline, completed: false });
  saveTasks();
  taskForm.reset();
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

function editTask(index) {
  const newTitle = prompt('Update task title:', tasks[index].title);
  const newDeadline = prompt('Update deadline:', tasks[index].deadline);
  const newPriority = prompt('Update priority (High, Medium, Low):', tasks[index].priority);

  if (newTitle && newDeadline && newPriority) {
    tasks[index].title = newTitle;
    tasks[index].deadline = newDeadline;
    tasks[index].priority = newPriority;
    saveTasks();
  }
}

function deleteTask(index) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks.splice(index, 1);
    saveTasks();
  }
}

// Initial render
renderTasks();
