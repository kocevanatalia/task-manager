let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

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

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();

    if (taskText === "") return;

    tasks.push({
        text: taskText,
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

renderTasks();