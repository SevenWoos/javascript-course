let todoList = JSON.parse(localStorage.getItem('todoList')) ||
[
  {
    'task': 'make dinner', 
    'dueDate': '2024-01-11'
  }, 
  {
    'task': 'wash dishes', 
    'dueDate': '2024-01-11'
  }
];

renderTask();

function addTodo() {
  const inputElement =  document.querySelector('.js-name-input');
  const task = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  todoList.push(
    {
      task, dueDate
    }
  );

  inputElement.value = '';

  renderTask();

  saveToStorage();
};


function renderTask() {
  let todoListHTML = '';
  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    const {task, dueDate} = todoObject;
    
    const html = `
      <div>${task}</div>
      <div>${dueDate}</div>
      <button onclick="
        todoList.splice(${i}, 1);
        renderTask();
        saveToStorage();
      " class=delete-todo-button>Delete</button>
    `;

    todoListHTML += html;
  }

  document.querySelector('.js-todo-list')
    .innerHTML = `${todoListHTML}`;
}


function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}