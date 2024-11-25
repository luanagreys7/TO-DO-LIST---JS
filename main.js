// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-input");
const editDateInput = document.getElementById("edit-date-input");
const editDescriptionInput = document.getElementById("edit-description-input");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const taskDateInput = document.querySelector("#date");
const descriptionInput = document.getElementById("description");

let editTodoId = null;

// Função para formatar a data corretamente
function formatDate(dateString) {
    if (!dateString) return "Data não definida";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${
        (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getFullYear()}`;
}

// Função para adicionar uma nova tarefa
function addTodoTask(id, title, description, date, completed = false) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    if (completed) todoDiv.classList.add("done");
    todoDiv.setAttribute("data-id", id);

    todoDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${formatDate(date)}</p>
        <p class="description" style="display: none;">${description}</p>
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
    todoDiv.querySelector(".see-description").addEventListener("click", () => {
        const desc = todoDiv.querySelector(".description");
        desc.style.display = desc.style.display === "none" ? "block" : "none";
    });

    todoDiv.querySelector(".finish-todo").addEventListener("click", () => {
        todoDiv.classList.toggle("done");
        saveTasks();
        applySearchAndFilter();
    });

    todoDiv.querySelector(".edit-todo").addEventListener("click", () => {
        editTodoId = id;
        editForm.style.display = "block";
        editInput.value = title;
        editDateInput.value = date;
        editDescriptionInput.value = description;
    });

    todoDiv.querySelector(".remove-todo").addEventListener("click", () => {
        todoDiv.remove();
        saveTasks();
        applySearchAndFilter();
    });

    todoList.appendChild(todoDiv);
}

// Função para salvar tarefas no localStorage
function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll(".todo").forEach((todo) => {
        const id = todo.getAttribute("data-id");
        const title = todo.querySelector("h3").textContent;
        const date = todo.querySelector("p").textContent;
        const description = todo.querySelector(".description").textContent;
        const completed = todo.classList.contains("done");
        tasks.push({ id, title, description, date, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTodoTask(task.id, task.title, task.description, task.date, task.completed));
}

// Função para aplicar filtro e pesquisa
function applySearchAndFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filterValue = filterSelect.value;

    todoList.querySelectorAll(".todo").forEach((todo) => {
        const title = todo.querySelector("h3").textContent.toLowerCase().trim();
        const isCompleted = todo.classList.contains("done");

        const matchesSearch = !searchTerm || title.includes(searchTerm);
        const matchesFilter =
            filterValue === "all" ||
            (filterValue === "done" && isCompleted) ||
            (filterValue === "to-do" && !isCompleted);

        todo.style.display = matchesSearch && matchesFilter ? "block" : "none";
    });
}

// Editar tarefas
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedTitle = editInput.value.trim();
    const updatedDate = editDateInput.value.trim();
    const updatedDescription = editDescriptionInput.value.trim();

    if (!updatedTitle) {
        alert("O título é obrigatório!");
        return;
    }

    const todo = [...todoList.children].find((todo) => todo.getAttribute("data-id") === editTodoId);

    if (todo) {
        todo.querySelector("h3").textContent = updatedTitle;
        todo.querySelector("p").textContent = formatDate(updatedDate);
        todo.querySelector(".description").textContent = updatedDescription;
    }

    editTodoId = null;
    editForm.style.display = "none";
    saveTasks();
    applySearchAndFilter();
});

// Cancelar edição
cancelEditBtn.addEventListener("click", () => {
    editTodoId = null;
    editForm.style.display = "none";
});

// Adicionar nova tarefa
todoForm.addEventListener("submit", (e) => {
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
    applySearchAndFilter();
});

// Eventos para filtro e pesquisa
filterSelect.addEventListener("change", applySearchAndFilter);
searchInput.addEventListener("input", applySearchAndFilter);

// Carregar tarefas ao iniciar
loadTasks();
