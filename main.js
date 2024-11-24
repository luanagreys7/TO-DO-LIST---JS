// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

// Funções
const addTodo = (text) => {

    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")
    todoTitle.innerText = text
    todo.appendChild(todoTitle)

    //Finish
    const_doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);
    //Finish

    //Editar
    const_doneBtn = document.createElement("button");
    doneBtn.classList.add("edit-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(doneBtn);
    //Editar

    //Remover
    const_doneBtn = document.createElement("button");
    doneBtn.classList.add("remove-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todo.appendChild(doneBtn);
    //Remover

    //Ver descrição
    const_doneBtn = document.createElement("button");
    doneBtn.classList.add("see-description");
    doneBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    todo.appendChild(doneBtn);
    //Ver descrição

    todoList.appendChild(todo);

};

// Eventos
todoForm.addEventListener('submit', function(e){
    e.preventDefault(); //prevents the page from reloading automatically after submit. 
    const inputValue = todoInput.value.trim(); //guarda o valor do input do usuário. trim removes unwanted space.
    if(inputValue.lenght > 0){
        addTodo(inputValue)
    }
   

});