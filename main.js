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
        taskContainer.style.backgroundColor = "var(--finished-box)";
    } else {
        taskContainer.style.backgroundColor = "var(--default-box)";
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

    const hideDescToggle = document.getElementById("hide-desc")
    if (hideDescToggle.checked) {
        hideDescription(taskContainer, desc, title, true);
    } else {
        hideDescription(taskContainer, desc, title, false);
    }
    hideDescToggle.addEventListener("change", function() {
        hideDescription(taskContainer, desc, title, this.checked);
    })
    document.getElementById("hide-added").addEventListener("change", function() {
        hideAdded(taskList, this.checked);
    })
    document.getElementById("hide-finished").addEventListener("change", function() {
        hideFinished(finishedTaskList, this.checked);
    })
}

function hideDescription(container, desc, title, isChecked) {
    if (isChecked) {
        desc.style.display = "none";
        container.style.height = "35px";
        container.style.width = "auto";
        title.style.border = "none";
    } else {
        desc.style.display = "flex";
        container.style.height = "200px";
        container.style.width = "200px";
        title.style.borderBottom = "1px solid black";
    }
}
function hideAdded(taskList, isChecked) {
    const title = document.querySelector("#add-task-title");
    if (isChecked) {
        taskList.style.display = "none";
        title.style.display = "none";
    } else {
        taskList.style.display = "flex";
        title.style.display = "block";
    }
}
function hideFinished(finishedTaskList, isChecked) {
    const title = document.querySelector("#finish-task-title");
    if (isChecked) {
        finishedTaskList.style.display = "none";
        title.style.display = "none";
    } else {
        finishedTaskList.style.display = "flex";
        title.style.display = "block";
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

let selector = document.getElementById("color-select-added");
selector.addEventListener("click", () => {
    selector.addEventListener("change", () => {
        switch (selector.value) {
            case "gray":
                document.body.classList.remove("yellow-tasks", "purple-tasks");
                break;
            case "yellow":
                document.body.classList.add("yellow-tasks");
                document.body.classList.remove("purple-tasks");
                break;
            case "purple":
                document.body.classList.add("purple-tasks");
                document.body.classList.remove("yellow-tasks");
                break;
        }
    })
})
let selectorTwo = document.getElementById("color-select-finished");
selectorTwo.addEventListener("click", () => {
    selectorTwo.addEventListener("change", () => {
        switch (selectorTwo.value) {
            case "green":
                document.body.classList.remove("orange-tasks", "blue-tasks");
                break;
            case "orange":
                document.body.classList.add("orange-tasks");
                document.body.classList.remove("blue-tasks");
                break;
            case "blue":
                document.body.classList.add("blue-tasks");
                document.body.classList.remove("orange-tasks");
                break;
        }
    })
})
//Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt aut fugiat, in perspiciatis sequi, suscipit

const MAX_ROW = 5;
let CURRENT_ROW = 0;

const rightArrow = document.getElementsByClassName("right-arrow")[0];
rightArrow.addEventListener("click", () => {
    updateCurrentRow();
    console.log("hello")
})
const leftArrow = document.getElementsByClassName("left-arrow")[0];
leftArrow.addEventListener("click", () => {
    updateCurrentRow();
    console.log("hello2")
})

function updateCurrentRow() {

}
