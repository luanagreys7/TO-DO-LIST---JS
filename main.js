// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const taskDateInput = document.querySelector("#date")

loadTasks();
let oldInputValue

//Funções

// Adicionar uma nova tarefa
const addTodo = (text, deadline) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Mostrar o prazo da tarefa
    const todoDeadline = document.createElement("p");
    todoDeadline.innerText = `Prazo: ${deadline}`;
    todo.appendChild(todoDeadline);

    // Botão de "concluir"
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    // Botão de "editar"
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    // Botão de "excluir"
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todo.appendChild(deleteBtn);

    // Botão de ver descrição
    const seedesBtn = document.createElement("button");
    seedesBtn.classList.add("see-description");
    seedesBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    todo.appendChild(seedesBtn);

    // Verificar o prazo da tarefa
    checkDeadline(deadline, todo);

    // Adicionar a tarefa à lista
    todoList.appendChild(todo);

    saveTasks(); 

    todoInput.value = " "; //O campo de input é limpo
    todoInput.focus(); //foco no campo de input
};

function saveTasks(){

    let tasks = []; //array com as todos
    todoList.querySelectorAll('.todo').forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText;
        const deadline = todo.querySelector('p').innerText.replace('Prazo: ', ''); // Remove a string "Prazo: "
        tasks.push({ text: todoTitle, deadline: deadline });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(){

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];   // Verifica se há tarefas no localStorage e, se não, usar um array vazio

    tasks.forEach(createTaskElement);

}

// Toggle entre os formulários de adicionar e editar tarefa
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// Função para atualizar título da todo (edit)
const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            oldInputValue = text;
        }

    });
    saveTasks();
}

// Verificar o prazo da tarefa
const checkDeadline = (deadline, todoElement) => {
    const today = new Date();
    const taskDeadline = new Date(deadline);

    const daysDifference = (taskDeadline - today) / (1000 * 60 * 60 * 24);
    
    const deadlineInfo = todoElement.querySelector("p");
    if (daysDifference > 0) {
        deadlineInfo.innerText = `Prazo: ${deadline} (Faltam ${Math.ceil(daysDifference)} dia(s))`;
    } else if (daysDifference === 0) {
        deadlineInfo.innerText = `Prazo: ${deadline} (Vence hoje!)`;
    } else {
        deadlineInfo.innerText = `Prazo: ${deadline} (Atrasada ${Math.abs(Math.floor(daysDifference))} dias)`;
        todoElement.classList.add("overdue");
    }
};

// Eventos

// Adicionar tarefa
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value.trim();
    const deadline = taskDateInput.value.trim();

    if (inputValue.length > 0 && deadline.length > 0) {
        addTodo(inputValue, deadline);
        todoInput.value = ""; // Limpar input
        taskDateInput.value = ""; // Limpar data
    } else {
        alert("Por favor, insira uma tarefa e um prazo.");
    }
});

// Concluir tarefa
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Marcar tarefa como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }

    // Excluir tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        saveTasks();
    }

    // Ver descrição (opcional)
    if (targetEl.classList.contains("see-description")) {
        alert(`Descrição da tarefa: ${parentEl.querySelector("h3").innerText}`);
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms();
})

editForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
        updateTodo(editInputValue)
    }

    toggleForms()

})