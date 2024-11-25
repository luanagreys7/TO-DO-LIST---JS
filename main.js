// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const editDateInput = document.getElementById('edit-date-input');
const editDescriptionInput = document.getElementById('edit-description-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const taskDateInput = document.querySelector("#date");
const descriptionInput = document.getElementById('description');

let editTodoId = null;

// Função para formatar a data corretamente
function formatDate(dateString) {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
        (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
}

// Função para criar um contador de tempo (countdown)
function createCountdown(dateString, element) {
    if (!dateString) {
        element.textContent = "Data não definida";
        return;
    }

    const deadline = new Date(dateString + "T23:59:59");
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;

        if (distance <= 0) {
            element.textContent = "Prazo Expirado";
            clearInterval(interval);
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

// Função para adicionar uma nova tarefa
function addTodoTask(id, title, description, date, completed = false) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    if (completed) todoDiv.classList.add('done');
    todoDiv.setAttribute('data-id', id);

    const countdownSpan = document.createElement('span');
    countdownSpan.className = 'countdown';

    todoDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${formatDate(date)} - <span class="countdown"></span></p>
        <p class="description">${description}</p>
        <button class="see-description">
            <i class="fa-regular fa-eye"></i>
        </button>
        <button class="finish-todo">
            <i class="fa-solid fa-check"></i>
        </button>
        <button class="edit-todo">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-todo">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    // Adicionando eventos aos botões
    todoDiv.querySelector('.see-description').addEventListener('click', () => {
        alert(description);
    });

    todoDiv.querySelector('.finish-todo').addEventListener('click', () => {
        todoDiv.classList.toggle('done');
        saveTasks();
    });

    todoDiv.querySelector('.edit-todo').addEventListener('click', () => {
        editTodoId = id;
        editForm.style.display = 'block';
        editInput.value = title;
        editDateInput.value = date;
        editDescriptionInput.value = description;
    });

    todoDiv.querySelector('.remove-todo').addEventListener('click', () => {
        todoDiv.remove();
        saveTasks();
    });

    todoList.appendChild(todoDiv);
    createCountdown(date, todoDiv.querySelector('.countdown'));
}

// Função para salvar tarefas no localStorage
function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll('.todo').forEach(todo => {
        const id = todo.getAttribute('data-id');
        const title = todo.querySelector('h3').innerText;
        const date = todo.querySelector('p').innerText.split(' - ')[0];
        const description = todo.querySelector('.description').innerText;
        const completed = todo.classList.contains('done');
        tasks.push({ id, title, description, date, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTodoTask(task.id, task.title, task.description, task.date, task.completed));
}

// Função para filtrar tarefas
function filterTodos() {
    const filterValue = filterSelect.value;
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const isCompleted = todo.classList.contains('done');
        if (filterValue === 'all') {
            todo.style.display = 'block';
        } else if (filterValue === 'done' && !isCompleted) {
            todo.style.display = 'none';
        } else if (filterValue === 'to-do' && isCompleted) {
            todo.style.display = 'none';
        }
    });
}

// Função para buscar tarefas
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const title = todo.querySelector('h3').textContent.toLowerCase();
        todo.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Função para editar tarefas
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedTitle = editInput.value.trim();
    const updatedDate = editDateInput.value.trim();
    const updatedDescription = editDescriptionInput.value.trim();

    if (!updatedTitle) {
        alert("O título é obrigatório!");
        return;
    }

    const todo = [...todoList.children].find(todo => todo.getAttribute('data-id') === editTodoId);

    if (todo) {
        todo.querySelector('h3').textContent = updatedTitle;
        todo.querySelector('p').innerHTML = `${formatDate(updatedDate)} - <span class="countdown"></span>`;
        todo.querySelector('.description').textContent = updatedDescription;
        createCountdown(updatedDate, todo.querySelector('.countdown'));
    }

    editTodoId = null;
    editForm.style.display = 'none';
    saveTasks();
});

// Cancelar edição
cancelEditBtn.addEventListener('click', () => {
    editTodoId = null;
    editForm.style.display = 'none';
});

// Adicionar nova tarefa
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    const date = taskDateInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert("O título é obrigatório!");
        return;
    }

    const id = Date.now().toString();
    addTodoTask(id, title, description, date);
    todoForm.reset();
    saveTasks();
});

// Filtrar tarefas ao selecionar
filterSelect.addEventListener('change', filterTodos);

// Carregar tarefas salvas ao iniciar
loadTasks();
