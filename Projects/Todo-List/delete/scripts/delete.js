let todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {
    task: 'make dinner', 
    dueDate: '2026-02-06'
  }, 

  {
    task: 'wash dishes', 
    dueDate: '2026-02-06'
  }
];

renderTodoList();


function renderTodoList() {
  let todoListHTML = ``;

  todoList.forEach((todoObject, index) => {
    const { task, dueDate } = todoObject;

    let html = `
      <div>${task}</div>

      <div>${dueDate}</div>

      <button class="delete-todo-button js-delete-todo-button">Delete</button>
    `;

    todoListHTML += html;
  });

  document.querySelector('.js-todo-grid')
    .innerHTML = todoListHTML;

  
  document.querySelectorAll('.js-delete-todo-button')
    .forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        todoList.splice(index, 1);

        renderTodoList();

        saveToStorage();
      });
    });
  
};


function addTodo() {
  const taskInput = document.querySelector('.js-task-input');
  const task = taskInput.value;

  const dueDateInput = document.querySelector('.js-date-input');
  const dueDate = dueDateInput.value;
  
  todoList.push(
    {
      task, 
      dueDate
    }
  );

  taskInput.value = '';
  dueDateInput.value = '';

  renderTodoList();

  saveToStorage();
};


function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
};


document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
});

