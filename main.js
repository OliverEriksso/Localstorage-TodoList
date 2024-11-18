const addTaskBtn = document.getElementById("create-task");
const taskList = document.getElementById("task-list");
const finishedTaskList = document.getElementById("finished-tasks");

let isFinished = false;

let savedAddedTasks = [];
let savedFinishedTasks = [];

document.addEventListener("DOMContentLoaded", () => {
    const loadedAddedTasks = JSON.parse(localStorage.getItem("addedTasks")) || [];
    const loadedFinishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
    savedAddedTasks = loadedAddedTasks.filter(task => task.title && task.desc);
    savedFinishedTasks = loadedFinishedTasks.filter(task => task.title && task.desc);
    savedAddedTasks.forEach(task => renderTask(task, false));
    savedFinishedTasks.forEach(task => renderTask(task, true));
});

addTaskBtn.addEventListener("click", () => {
    const titleInput = document.getElementById("input-field").value;
    const descInput = document.getElementById("input-field2").value;
    if (!titleInput || !descInput) {
        alert("Both title and description are required!");
        return;
    }

    const newTask = {
        title: titleInput,
        desc: descInput,
        isFinished: false
    };
    savedAddedTasks.push(newTask);
    renderTask(newTask, false);
    saveToLocalStorage();

    const allInputs = document.querySelectorAll("input, textarea");
    allInputs.forEach(input => {
        input.value = "";
    });
});


function renderTask(task, isFinished) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    
    if (isFinished) {
        taskContainer.style.backgroundColor = "darkgreen";
    } else {
        taskContainer.style.backgroundColor = "gray";
    }

    const title = document.createElement("h4");
    title.classList.add("task-title");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.classList.add("task-desc");
    desc.textContent = task.desc;

    const removeTask = document.createElement("button");
    removeTask.textContent = "✖️";
    removeTask.classList.add("task-button", "task-remove");
    removeTask.addEventListener("click", () => {
        const userConfirmed = confirm("Are you sure? This task will be lost forever")
        if (userConfirmed) {
            removeTheTask(taskContainer, task, isFinished);
        }
    });

    const finishTask = document.createElement("button");
    finishTask.textContent = task.isFinished ? "☑️" : "✔️";
    finishTask.classList.add("task-button", "task-finish");
    finishTask.addEventListener("click", () => {
        if (task.isFinished) {
            moveTaskBack(taskContainer, task);
        } else {
            finishTheTask(taskContainer, task);
        }
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("display-row");
    buttonContainer.appendChild(removeTask);
    buttonContainer.appendChild(finishTask);

    taskContainer.appendChild(title);
    taskContainer.appendChild(desc);
    taskContainer.appendChild(buttonContainer);

    if (isFinished) {
        finishedTaskList.appendChild(taskContainer);
    } else {
        taskList.appendChild(taskContainer);
    }
}

function saveToLocalStorage() {
    localStorage.setItem("addedTasks", JSON.stringify(savedAddedTasks));
    localStorage.setItem("finishedTasks", JSON.stringify(savedFinishedTasks));
}

function moveTaskBack(container, task) {
    savedFinishedTasks = savedFinishedTasks.filter(t => t !== task);
    task.isFinished = false;
    savedAddedTasks.push(task);
    finishedTaskList.removeChild(container);
    renderTask(task, false);
    saveToLocalStorage();
}
function finishTheTask(container, task) {
    savedAddedTasks = savedAddedTasks.filter(t => t !== task);
    task.isFinished = true;
    savedFinishedTasks.push(task);
    
    taskList.removeChild(container);
    renderTask(task, true);
    saveToLocalStorage();
}

function removeTheTask(container, task, isFinished) {
    if (isFinished) {
        savedFinishedTasks = savedFinishedTasks.filter(t => t !== task);
        finishedTaskList.removeChild(container);
    } else {
        savedAddedTasks = savedAddedTasks.filter(t => t !== task);
        taskList.removeChild(container);
    }
    saveToLocalStorage();
}
//Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt aut fugiat, in perspiciatis sequi, suscipit