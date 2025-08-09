const todoList = [];
renderTodoList();

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const task = inputElement.value;

  todoList.push(task);
  console.log(todoList);

  inputElement.value = '';

  renderTodoList();
}

function renderTodoList() {
  let todoListHTML = '';

  for (let i = 0; i < todoList.length; i++) {
    const todo = todoList[i];
    const html = `<p>${todo}</p>`;
    todoListHTML += html;
  }

  console.log(todoListHTML);

  document.querySelector('.js-todo-list')
    .innerHTML = todoListHTML;
}