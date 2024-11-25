// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const taskDateInput = document.querySelector("#date");

loadTasks();
let oldInputValue;

// Funções

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

    saveTasks(); // Salvar as tarefas no localStorage

    todoInput.value = ""; // Limpar o campo de input
    taskDateInput.value = ""; // Limpar o campo de data
    todoInput.focus(); // Focar no campo de input
};

function saveTasks() {
    let tasks = []; // Array para armazenar as tarefas
    todoList.querySelectorAll('.todo').forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText;
        const deadline = todo.querySelector('p').innerText.replace('Prazo: ', ''); // Remove a string "Prazo: "
        tasks.push({ text: todoTitle, deadline: deadline });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Salvar no localStorage
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Carregar tarefas do localStorage, se existirem

    tasks.forEach(task => addTodo(task.text, task.deadline)); // Adicionar as tarefas carregadas
}

// Toggle entre os formulários de adicionar e editar tarefa
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// Função para atualizar título da todo (edit)
const updateTodo = (newText) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3");

        // Comparar o título da tarefa com o valor antigo
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = newText;
            oldInputValue = newText; // Atualizar o valor do título antigo
        }
    });

    saveTasks(); // Salvar novamente as tarefas após a atualização
};

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
    } else {
        alert("Por favor, insira uma tarefa e um prazo.");
    }
});

// Concluir tarefa
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Marcar tarefa como concluída
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms(); // Mostrar o formulário de edição
        editInput.value = todoTitle; // Preencher o campo de edição com o título da tarefa
        oldInputValue = todoTitle;   // Armazenar o título atual
    }

    // Excluir tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        saveTasks(); // Atualizar o localStorage após a remoção
    }

    // Ver descrição (opcional)
    if (targetEl.classList.contains("see-description")) {
        alert(`Descrição da tarefa: ${parentEl.querySelector("h3").innerText}`);
    }
});

// Cancelar a edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(); // Voltar ao formulário de adicionar tarefa
});

// Enviar o formulário de edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if (editInputValue) {
        updateTodo(editInputValue); // Atualizar o título da tarefa
    }

    toggleForms(); // Fechar o formulário de edição
});
