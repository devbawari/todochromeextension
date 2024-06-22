let timer;
let timerInterval;

document.getElementById('startTimer').addEventListener('click', () => {
  const minutes = parseInt(document.getElementById('minutes').value);
  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid number of minutes.');
    return;
  }

  clearInterval(timerInterval);
  startTimer(minutes);
});

document.getElementById('endTimer').addEventListener('click', () => {
  clearInterval(timerInterval);
  document.getElementById('timeRemaining').textContent = '0m 0s';
  document.getElementById('minutes').value = '';
});

document.getElementById('addTask').addEventListener('click', () => {
  const taskInput = document.getElementById('newTask');
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const taskList = document.getElementById('tasks');
  const taskItem = document.createElement('li');
  taskItem.textContent = taskText;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    taskList.removeChild(taskItem);
  });

  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
  taskInput.value = '';
});

function startTimer(minutes) {
  const endTime = Date.now() + minutes * 60000;
  timerInterval = setInterval(() => {
    const remainingTime = endTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      document.getElementById('timeRemaining').textContent = '0m 0s';
      alert('Timer ended!');
      return;
    }

    const minutesLeft = Math.floor(remainingTime / 60000);
    const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
    document.getElementById('timeRemaining').textContent = `${minutesLeft}m ${secondsLeft}s`;
  }, 1000);
}
