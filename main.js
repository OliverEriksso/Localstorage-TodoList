const addTaskBtn = document.getElementById("create-task");
const taskList = document.getElementById("task-list");
const finishedTaskList = document.getElementById("finished-tasks");

let isFinished = false;

let savedAddedTasks = [];
let savedFinishedTasks = [];

let CURRENT_ROW = 0;
let isNextRow = false;
const ROW_MAX = 6;
const totalPages = Math.ceil(savedAddedTasks.length / ROW_MAX); //MATH.CEIL BASICALLY ROUNDS UP NUMBERS, IF YOU GOT 17 TASKS YOU'D GET 2 ROWS BECAUSE 6 - 6 - 5, CEIL MAKES SURE THE LAST 5 ARE IN AN ADDITIONAL ROW

document.addEventListener("DOMContentLoaded", () => {
    const loadedAddedTasks = JSON.parse(localStorage.getItem("addedTasks")) || [];
    const loadedFinishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
    savedAddedTasks = loadedAddedTasks.filter(task => task.title && task.desc);
    savedFinishedTasks = loadedFinishedTasks.filter(task => task.title && task.desc);
    //savedAddedTasks.forEach(task => renderTask(task, false));
    savedFinishedTasks.forEach(task => renderTask(task, true));

    paginateTasks(false);
    paginateTasks(true);
});

function validateCurrentRow() { //THIS IS WHAT WE USE ALONGSIDE PAGINATETASKS INSTEAD OF RENDERTASK SO THE RIGHT ROW/TASKS IS ALWAYS BEING DISPLAYED RIGHT
    const maxRows = Math.ceil(savedAddedTasks.length / ROW_MAX);
    if (maxRows === 0) {
        CURRENT_ROW = 0;
        return;
    }

    if (CURRENT_ROW >= maxRows) {
        CURRENT_ROW = maxRows - 1; 
    } else if (CURRENT_ROW < 0) {
        CURRENT_ROW = 0;
    }
}

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
    validateCurrentRow();
    paginateTasks();
    saveToLocalStorage();

    const allInputs = document.querySelectorAll("input, textarea");
    allInputs.forEach(input => {
        input.value = "";
    });
});

function createTaskTitle(taskTitle) {
    const title = document.createElement("h4");
    title.classList.add("task-title");
    title.textContent = taskTitle;
    return title;
}
function createTaskDesc(taskDesc) {
    const desc = document.createElement("p");
    desc.classList.add("task-desc");
    desc.textContent = taskDesc;
    return desc;
}
function createRemoveTaskBtn(taskContainer, task, isFinished) {
    const removeTask = document.createElement("button");
    removeTask.textContent = "✖️";
    removeTask.classList.add("task-button", "task-remove");
    removeTask.addEventListener("click", () => {
        const userConfirmed = confirm("Are you sure? This task will be lost forever")
        if (userConfirmed) {
            removeTheTask(taskContainer, task, isFinished);
        }
    });
    return removeTask;
}
function createFinishTaskBtn(taskContainer, task) {
    const finishTask = document.createElement("button");
    finishTask.textContent = task.isFinished ? "☑️" : "✔️";
    finishTask.classList.add("task-button", "task-finish");
    finishTask.addEventListener("click", () => {
        if (task.isFinished) {
            moveTaskBack(taskContainer, task);
            validateCurrentRow();
            paginateTasks();
        } else {
            finishTheTask(taskContainer, task);
            validateCurrentRow();
            paginateTasks();
        }
    });
    return finishTask;
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
    validateCurrentRow();
    paginateTasks();
    saveToLocalStorage();
}
function setupHideDesc(taskContainer, desc, title) {
    const hideDescToggle = document.getElementById("hide-desc")
    hideDescription(taskContainer, desc, title, hideDescToggle.checked);
    hideDescToggle.addEventListener("change", function() {
        hideDescription(taskContainer, desc, title, this.checked);
    })
}

function renderTask(task, isFinished) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    if (isFinished) {
        taskContainer.style.backgroundColor = "var(--finished-box)";
    } else {
        taskContainer.style.backgroundColor = "var(--default-box)";
    }

    const title = createTaskTitle(task.title);
    const desc = createTaskDesc(task.desc);

    const removeTask = createRemoveTaskBtn(taskContainer, task, isFinished);
    const finishTask = createFinishTaskBtn(taskContainer, task);
    
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

    setupHideDesc(taskContainer, desc, title);
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

function goToNextRow() {
    if (CURRENT_ROW < ROW_MAX - 1) {
        const nextRowIndex =  (CURRENT_ROW + 1) * ROW_MAX;
        if(nextRowIndex < savedAddedTasks.length) {
            CURRENT_ROW++;
            isNextRow = ((CURRENT_ROW + 1) * ROW_MAX) < savedAddedTasks.length;
            paginateTasks();
        }
    }
}
function goToPrevRow() {
    if (CURRENT_ROW > 0) {
        CURRENT_ROW--;
        paginateTasks();
    }
}

function paginateTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    const leftArrow = document.createElement("div");
    leftArrow.classList.add("left-arrow");
    leftArrow.textContent = "←";
    leftArrow.addEventListener("click", goToPrevRow);
    
    const rightArrow = document.createElement("div");
    rightArrow.classList.add("right-arrow");
    rightArrow.textContent = "→";
    rightArrow.addEventListener("click", goToNextRow);

    taskList.appendChild(leftArrow);
    taskList.appendChild(rightArrow);

    const start = CURRENT_ROW * ROW_MAX;
    const end = start + ROW_MAX;
    const tasksDisplay = savedAddedTasks.slice(start, end);

    tasksDisplay.forEach(task => renderTask(task, false));

    updatePaginationButtons();
    console.log(CURRENT_ROW)
}

function updatePaginationButtons() {
    const nextButton = document.querySelector(".right-arrow");
    const prevButton = document.querySelector(".left-arrow"); 

    prevButton.disabled = CURRENT_ROW === 0;
    nextButton.disabled = !isNextRow;
}

const rightArrows = document.querySelectorAll(".right-arrow"); //IF THERE WAS ONLY ONE RIGHT/LEFT ARROW WE COULD USE ELEMENTBYID, BUT SINCE THERE ARE SEVERAL WE NEED QUERYSELECTOR & FOREACH
rightArrows.forEach(arrow => arrow.addEventListener("click", goToNextRow)); 

const leftArrows = document.querySelectorAll(".left-arrow");
leftArrows.forEach(arrow => arrow.addEventListener("click", goToPrevRow));
