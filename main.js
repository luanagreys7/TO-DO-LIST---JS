alert("teste")

// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

// Funções

const saveTodo = (text) => { //add task
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    //Ver descrição
    const seedesBtn = document.createElement("button");
    seedesBtn.classList.add("see-description");
    seedesBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    todo.appendChild(seedesBtn);

    //Finish
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    //Editar
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    //Remover
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todo.appendChild(deleteBtn);

    todoList.appendChild(todo);
};

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}


// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o atualização automática da página

    const inputValue = todoInput.value.trim(); // Remove espaços no início e no fim do texto
    if (inputValue.length > 0) {
        saveTodo(inputValue); // Adiciona a tarefa
        todoInput.value = ""; // Limpa o campo de entrada após salvar
    } else {
        console.log("Por favor, insira um texto válido."); // Mensagem de depuração
    }
});

document.addEventListener("click", (e) => {

    const targetEl = e.target
    const parentEl = targetEl.closest("div")

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done");
    }

    if(targetEl.classList.contains("edit-todo")){
        toggleForms()
    }



})