let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingIndex = null;
let editInputValue = "";
let editNoteValue = "";
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
let draggedIndex = null;

function applyTheme(){
    if (darkMode) {
        document.body.classList.add("dark-mode");
        document.getElementById("themeToggle").textContent = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        document.getElementById("themeToggle").textContent = "🌙";
    }
}


function toggleTheme(){
    darkMode = !darkMode;
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    applyTheme();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function startEditing(index) {
    editingIndex = index;
    editInputValue = tasks[index].text;
    editNoteValue = tasks[index].note || "";
    renderTasks();
}

function cancelEditing() {
    editingIndex = null;
    editInputValue = "";
    editNoteValue = "";
    renderTasks();
}

function saveEdit(index) {
    const trimmedText = editInputValue.trim();
    const trimmedNote = editNoteValue.trim();

    if (trimmedText === "") return;

    tasks[index].text = trimmedText;
    tasks[index].note = trimmedNote;
    saveTasks();

    editingIndex = null;
    editInputValue = "";
    editNoteValue = "";
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.setAttribute("draggable", true);

        if (editingIndex !== index) {
            li.setAttribute("draggable", true);
        }

        li.addEventListener("dragstart", function() {
            draggedIndex = index;
            li.classList.add("dragging");
        });

        li.addEventListener("dragend", function () {
            draggedIndex = null;
            li.classList.remove("dragging");
        })

        li.addEventListener("dragover", function (e) {
            e.preventDefault();
        });

        li.addEventListener("drop", function (e) {
            e.preventDefault();

            if (draggedIndex === null || draggedIndex === index) return;
            
            const draggedTask = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(index, 0, draggedTask);

            saveTasks();
            renderTasks();
        });

        if (editingIndex === index) {
            const editFields = document.createElement("div");
            editFields.className = "edit-fields";

            const editInput = document.createElement("input");
            editInput.type = "text";
            editInput.value = editInputValue;
            editInput.className = "edit-input";
            editInput.placeholder = "Edit task title...";

            editInput.addEventListener("input", function (e) {
                editInputValue = e.target.value;
            });

            editInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    saveEdit(index);
                }
            
            });

            const editNote = document.createElement("textarea");
            editNote.value = editNoteValue;
            editNote.className = "edit-note-input";
            editNote.placeholder = "Add a note (optional)...";

            editNote.addEventListener("input", function (e) {
                editNoteValue = e.target.value;
            });

            editFields.appendChild(editInput);
            editFields.appendChild(editNote);

            const buttonGroup = document.createElement("div");
            buttonGroup.className = "task-buttons";

            const saveBtn = document.createElement("button");
            saveBtn.textContent = "💾";
            saveBtn.className = "save-btn";
            saveBtn.title = "Save";
            saveBtn.addEventListener("click", function () {
                saveEdit(index);
            });

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "✖";
            cancelBtn.className = "cancel-btn";
            cancelBtn.title = "Cancel";
            cancelBtn.addEventListener("click", function () {
                cancelEditing();
            });

            buttonGroup.appendChild(saveBtn);
            buttonGroup.appendChild(cancelBtn);

            li.appendChild(editFields);
            li.appendChild(buttonGroup);
            list.appendChild(li);

            setTimeout(() => {
                editInput.focus();
                editInput.setSelectionRange(editInput.value.length, editInput.value.length);
            }, 0);

            return;
        }

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const taskText = document.createElement("span");
        taskText.textContent = task.text;
        taskText.className = "task-text";

        if (task.completed) {
            taskText.classList.add("completed");
        }

        taskText.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        taskContent.appendChild(taskText);

        if (task.note && task.note.trim() !== "") {
            const taskNote = document.createElement("p");
            taskNote.textContent = task.note;
            taskNote.className = "task-note";

            if (task.completed) {
                taskNote.classList.add("completed-note");
            }

            taskContent.appendChild(taskNote);
        }

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "task-buttons";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.className = "edit-btn";
        editBtn.title = "Edit";
        editBtn.addEventListener("click", function () {
            startEditing(index);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Delete";
        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);

            if (editingIndex === index) {
                editingIndex = null;
                editInputValue = "";
                editNoteValue = "";
            } else if (editingIndex > index) {
                editingIndex--;
            }

            saveTasks();
            renderTasks();
        });

        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(taskContent);
        li.appendChild(buttonGroup);
        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    tasks.push({
        text: taskText,
        note: "",
        completed: false
    });

    saveTasks();
    renderTasks();
    input.value = "";
}

document.getElementById("taskInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

document.getElementById("themeToggle").addEventListener("click", toggleTheme);
applyTheme();

renderTasks();