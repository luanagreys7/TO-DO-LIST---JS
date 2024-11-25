// Função para salvar as tarefas no localStorage
function saveTasks() {
    let tasks = []; // Cria um array para armazenar as tarefas

    // Seleciona todas as tarefas na lista e as adiciona no array
    todoList.querySelectorAll('.todo').forEach((todo) => {
        const todoTitle = todo.querySelector('h3').innerText;
        const deadline = todo.querySelector('p').innerText.replace('Prazo: ', ''); // Remove "Prazo: "
        tasks.push({ text: todoTitle, deadline: deadline });
    });

    // Armazena o array no localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Se não houver tarefas, retorna um array vazio

    // Cria as tarefas na interface
    tasks.forEach(task => addTodo(task.text, task.deadline));
}

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

    // Cria os botões de interação
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

    // Adiciona a tarefa à lista e salva no localStorage
    todoList.appendChild(todo);
    saveTasks(); 
    todoInput.value = ""; // Limpa o campo de entrada
    todoInput.focus(); // Foca no campo de entrada
};

// Ao recarregar a página, as tarefas anteriores do localStorage são carregadas
loadTasks();

// Função para atualizar o título de uma tarefa (edit)
const updateTodo = (newText) => {
    // Encontra a tarefa a ser editada
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        // Se o título da tarefa for igual ao antigo, atualiza
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = newText;
            oldInputValue = newText; // Atualiza o título antigo para o novo

            saveTasks(); // Salva as tarefas novamente no localStorage
        }
    });
};

// Função para excluir uma tarefa
const deleteTodo = (todoElement) => {
    todoElement.remove(); // Remove o elemento da página
    saveTasks(); // Atualiza o localStorage após a remoção
};

// Função para marcar a tarefa como concluída
const toggleDone = (todoElement) => {
    todoElement.classList.toggle("done");
    saveTasks(); // Atualiza o localStorage após concluir
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

// Evento para lidar com as ações de concluir, editar, excluir e ver descrição
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest(".todo"); // Obtém o elemento da tarefa clicada

    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Concluir tarefa
    if (targetEl.classList.contains("finish-todo")) {
        toggleDone(parentEl);
    }

    // Editar tarefa
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle; // Armazena o título antigo
    }

    // Excluir tarefa
    if (targetEl.classList.contains("remove-todo")) {
        deleteTodo(parentEl);
    }

    // Ver descrição
    if (targetEl.classList.contains("see-description")) {
        alert(`Descrição da tarefa: ${parentEl.querySelector("h3").innerText}`);
    }
});

// Cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(); // Fecha o formulário de edição
});

// Enviar formulário de edição
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editInputValue = editInput.value.trim();

    if (editInputValue) {
        updateTodo(editInputValue); // Atualiza o título da tarefa
    }

    toggleForms(); // Fecha o formulário de edição
});
