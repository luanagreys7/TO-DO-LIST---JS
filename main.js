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
let countdownIntervals = {};

// Função para formatar a data corretamente
function formatDate(dateString) {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
        (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
}

// Função para criar um contador de tempo (countdown)
function createCountdown(dateString, element, id) {
    clearInterval(countdownIntervals[id]); // Limpa o intervalo anterior, se existir

    if (!dateString) {
        element.textContent = "Data não definida";
        return;
    }

    const deadline = new Date(dateString + "T23:59:59");
    if (isNaN(deadline.getTime())) {
        element.textContent = "Data inválida";
        return;
    }

    countdownIntervals[id] = setInterval(() => {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;

        if (distance <= 0) {
            element.textContent = "Prazo Expirado";
            clearInterval(countdownIntervals[id]);
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
    todoDiv.setAttribute('data-date', date);

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

    // Eventos dos botões
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
        clearInterval(countdownIntervals[id]); // Limpa o intervalo
        delete countdownIntervals[id];
        todoDiv.remove();
        saveTasks();
    });

    todoList.appendChild(todoDiv);
    createCountdown(date, todoDiv.querySelector('.countdown'), id);
}

// Função para salvar tarefas no localStorage
function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll('.todo').forEach(todo => {
        const id = todo.getAttribute('data-id');
        const title = todo.querySelector('h3').textContent;
        const date = todo.getAttribute('data-date');
        const description = todo.querySelector('.description').textContent;
        const completed = todo.classList.contains('done');
        tasks.push({ id, title, description, date, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTodoTask(task.id, task.title, task.description, task.date, task.completed));
}

// Função para aplicar filtro e pesquisa
function applySearchAndFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const title = todo.querySelector('h3').textContent.toLowerCase();
        const isCompleted = todo.classList.contains('done');

        const matchesSearch = title.includes(searchTerm);
        const matchesFilter =
            filterValue === 'all' ||
            (filterValue === 'done' && isCompleted) ||
            (filterValue === 'to-do' && !isCompleted);

        todo.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

// Editar tarefas
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
        todo.setAttribute('data-date', updatedDate);
        createCountdown(updatedDate, todo.querySelector('.countdown'), editTodoId);
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

// Eventos para filtro e pesquisa
filterSelect.addEventListener('change', applySearchAndFilter);
searchInput.addEventListener('input', applySearchAndFilter);

// Carregar tarefas ao iniciar
loadTasks();
