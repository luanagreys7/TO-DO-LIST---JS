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
