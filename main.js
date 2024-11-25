// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const taskDateInput = document.querySelector("#date");

let oldInputValue; // Variável para armazenar o valor original ao editar uma tarefa

// Função para adicionar uma nova tarefa
const addTodo = (text, deadline) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const todoDeadline = document.createElement("p");
    todoDeadline.innerText = `Prazo: ${deadline}`;
    todo.appendChild(todoDeadline);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    todo.appendChild(deleteBtn);

    const seedesBtn = document.createElement("button");
    seedesBtn.classList.add("see-description");
    seedesBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    todo.appendChild(seedesBtn);

    // Verificar o prazo da tarefa
    checkDeadline(deadline, todo);

    // Adicionar a tarefa à lista
    todoList.appendChild(todo);

    saveTasks(); // Atualiza o localStorage

    todoInput.value = ""; // Limpa o campo de input
    todoInput.focus(); // Foca no campo de input
};

// Função para salvar tarefas no localStorage
function saveTasks() {
    let tasks = []; // Array para armazenar as tarefas
    todoList.querySelectorAll('.todo').forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText;
        const deadline = todo.querySelector('p').innerText.replace('Prazo: ', '');
        tasks.push({ text: todoTitle, deadline: deadline });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks)); // Armazena as tarefas no localStorage
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTodo(task.text, task.deadline));
}

// Função para atualizar o título de uma tarefa (edit)
const updateTodo = (newText) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = newText;
            oldInputValue = newText; // Atualiza o valor para futuras comparações
        }
    });

    saveTasks(); // Atualiza o localStorage após a edição
};

// Função para verificar o prazo da tarefa
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

// Função para alternar entre os formulários de adicionar e editar
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

// Evento para adicionar tarefa
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

// Evento de clique para editar, concluir ou excluir tarefa
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
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }

    // Excluir tarefa
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
        saveTasks(); // Atualiza o localStorage após remoção
    }

    // Ver descrição (opcional)
    if (targetEl.classList.contains("see-description")) {
        alert(`Descrição da tarefa: ${parentEl.querySelector("h3").innerText}`);
    }
});

// Cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

// Atualizar tarefa com novo texto
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value.trim();

    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms(); // Fecha o formulário de edição
});

loadTasks(); // Carrega as tarefas salvas no localStorage ao iniciar a página
