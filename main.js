// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const taskDateInput = document.querySelector("#date")

// Funções

// Função para adicionar nova tarefa
const saveTodo = (text, deadline) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Ver descrição
    const seedesBtn = document.createElement("button");
    seedesBtn.classList.add("see-description");
    seedesBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    todo.appendChild(seedesBtn);

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

    // Adicionar a tarefa à lista
    todoList.appendChild(todo);

    // Mostrar o prazo da tarefa
    const todoDeadline = document.createElement("p");
    todoDeadline.innerText = `Prazo: ${deadline}`;
    todo.appendChild(todoDeadline);

    // Verificar o prazo da tarefa
    checkDeadline(deadline, todo);

};

//edit (em progresso)
const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
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
        saveTodo(inputValue, deadline);
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

    // Marcar tarefa como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
    }

    // Excluir tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
    }

    // Ver descrição (opcional)
    if (targetEl.classList.contains("see-description")) {
        alert(`Descrição da tarefa: ${parentEl.querySelector("h3").innerText}`);
    }
});
