const addTaskBtn = document.getElementById("create-task");
const taskList = document.getElementById("task-list");
const finishedTaskList = document.getElementById("finished-tasks");

let isFinished = false;

let savedAddedTasks = [];
let savedFinishedTasks = [];

let CURRENT_ROW = 0;
let CURRENT_ROW_FINISHED = 0;
let isNextRow = false;
let isNextRowFinished = false;
let ROW_MAX = 6;


document.addEventListener("DOMContentLoaded", () => {
    const loadedAddedTasks = JSON.parse(localStorage.getItem("addedTasks")) || [];
    const loadedFinishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
    savedAddedTasks = loadedAddedTasks.filter(task => task.title && task.desc);
    savedFinishedTasks = loadedFinishedTasks.filter(task => task.title && task.desc);
    //savedAddedTasks.forEach(task => renderTask(task, false));
    //savedFinishedTasks.forEach(task => renderTask(task, true));

    paginateTasks();
    paginateFinishedTasks(); 
    
    updateAddedTasksCounter();
});

function validateCurrentRow() { //THIS IS WHAT WE USE ALONGSIDE PAGINATETASKS INSTEAD OF RENDERTASK SO THE RIGHT ROW/TASKS IS ALWAYS BEING DISPLAYED RIGHT
    const maxRows = Math.ceil(savedAddedTasks.length / ROW_MAX);  //MATH.CEIL BASICALLY ROUNDS UP NUMBERS, IF YOU GOT 17 TASKS YOU'D GET 2 ROWS BECAUSE 6 - 6 - 5, CEIL MAKES SURE THE LAST 5 ARE IN AN ADDITIONAL ROW
    if (maxRows === 0) {
        CURRENT_ROW = 0;
        return;
    }
    if (CURRENT_ROW >= maxRows) {
        CURRENT_ROW = maxRows - 1; 
    } else if (CURRENT_ROW < 0) {
        CURRENT_ROW = 0;
    }

    // const maxRowsFinished = Math.ceil(savedAddedTasks.length / ROW_MAX)
    // if (maxRowsFinished === 0) {
    //     CURRENT_ROW_FINISHED = 0;
    //     return;
    // }
    // if (CURRENT_ROW_FINISHED >= maxRowsFinished) {
    //     CURRENT_ROW_FINISHED = maxRowsFinished - 1; 
    // } else if (CURRENT_ROW_FINISHED < 0) {
    //     CURRENT_ROW_FINISHED = 0;
    // }
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
    updateAddedTasksCounter();
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
            paginateFinishedTasks(); 
        } else {
            finishTheTask(taskContainer, task);
            validateCurrentRow();
            paginateTasks();
            paginateFinishedTasks(); 
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

    updateAddedTasksCounter();
}
function finishTheTask(container, task) {
    savedAddedTasks = savedAddedTasks.filter(t => t !== task);
    task.isFinished = true;
    savedFinishedTasks.push(task);
    
    taskList.removeChild(container);
    renderTask(task, true);
    saveToLocalStorage();

    updateAddedTasksCounter();
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

    updateAddedTasksCounter();
}
function setupHideDesc(taskContainer, desc, title) {
    const hideDescToggle = document.getElementById("hide-desc")

    hideDescToggle.replaceWith(hideDescToggle.cloneNode(true)); //SINCE WE PUT SETUPHIDE DESC IN RENDERTASKS IT'S PUT ON ALL TASKS, 
                                                                //WE NEED TO MAKE SURE THERES ONLY 1, OTHERWISE PAGINATETASKS IS CALLED *(AMOUNT OF TASKS) EACH TIME
    const newHideDescToggle = document.getElementById("hide-desc");

    hideDescription(taskContainer, desc, title, hideDescToggle.checked);
    newHideDescToggle.addEventListener("change", function() {
        hideDescription(taskContainer, desc, title, this.checked);
        ifDescHidden();
    })
}
function ifDescHidden() {
    const hideDescToggle = document.getElementById("hide-desc");

    if (hideDescToggle.checked) {
        taskList.style.display = "grid";
        taskList.style.gridTemplateColumns = "repeat(6, minmax(50px, 1fr))";
        taskList.style.gap = "10px"; 

        finishedTaskList.style.display = "grid";
        finishedTaskList.style.gridTemplateColumns = "repeat(6, minmax(50px, 1fr))";
        finishedTaskList.style.gap = "10px"; 
        ROW_MAX = 18;
    } else {
        taskList.style.display = "flex";
        taskList.style.flexDirection = "row";
        taskList.style.gap = "24px";

        finishedTaskList.style.display = "flex";
        finishedTaskList.style.flexDirection = "row";
        finishedTaskList.style.gap = "24px";
        ROW_MAX = 6;
    }
    taskList.textContent = "";
    finishedTaskList.textContent = "";

    validateCurrentRow(); 
    paginateTasks(); 
    paginateFinishedTasks(); 
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
        container.style.width = "200px";
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
const closeMenu = document.getElementById("close-sett");
closeMenu.addEventListener("click", removeMenu)
let isMenuChecked = false;
function removeMenu() {
    isMenuChecked = !isMenuChecked;
    const menu = document.querySelector(".align-left");
    if (isMenuChecked) {
        menu.style.display ="none";
        closeMenu.style.position ="static";
        closeMenu.style.marginTop = "1.5em"
    } else {
        menu.style.display ="flex";
        closeMenu.style.position ="fixed";
        closeMenu.style.marginTop = "0"
    }   
}
//Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt aut fugiat, in perspiciatis sequi, suscipit

function goToNextRow() {
    const totalRows = Math.ceil(savedAddedTasks.length / ROW_MAX);
    if (CURRENT_ROW < totalRows - 1) {
        CURRENT_ROW++;
        paginateTasks();    
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
    const addedDisplayRow = document.querySelector("#added-display-row");
    addedDisplayRow.querySelectorAll(".left-arrow, .right-arrow").forEach(arrow => arrow.remove());

    const leftArrow = createArrow("left", goToPrevRow);
    const rightArrow = createArrow("right", goToNextRow);
    addedDisplayRow.appendChild(leftArrow);
    addedDisplayRow.appendChild(rightArrow);

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

function updateAddedTasksCounter() {
    const addedTasksCounter = document.getElementById("added-tasks-counter");
    addedTasksCounter.textContent = `Total Added: ${savedAddedTasks.length}`;

    const finishedTasksCounter = document.getElementById("finished-tasks-counter");
    finishedTasksCounter.textContent = `Total Finished: ${savedFinishedTasks.length}`;
}

function createArrow(direction, onClickHandler) {
    const arrow = document.createElement("div");
    arrow.classList.add(direction === "left" ? "left-arrow" : "right-arrow");
    arrow.textContent = direction === "left" ? "←" : "→";
    arrow.addEventListener("click", onClickHandler);
    return arrow;
}
function paginateFinishedTasks() {
    while (finishedTaskList.firstChild) {
        finishedTaskList.removeChild(finishedTaskList.firstChild);
    }

    const finishedDisplayRow = document.querySelector("#finished-display-row");
    finishedDisplayRow.querySelectorAll(".left-arrow, .right-arrow").forEach(arrow => arrow.remove());

    const leftArrow = createArrow("left", goToPrevRowFinished);
    const rightArrow = createArrow("right", goToNextRowFinished);
    finishedDisplayRow.appendChild(leftArrow);
    finishedDisplayRow.appendChild(rightArrow);

    const start = CURRENT_ROW_FINISHED * ROW_MAX;
    const end = start + ROW_MAX;
    const tasksDisplay = savedFinishedTasks.slice(start, end);

    tasksDisplay.forEach(task => renderTask(task, true));

    updateFinishedPaginationButtons();
}

function goToNextRowFinished() {
    const totalRows = Math.ceil(savedFinishedTasks.length / ROW_MAX);
    if (CURRENT_ROW_FINISHED < totalRows - 1) {
        CURRENT_ROW_FINISHED++;
        paginateFinishedTasks();
    }
}

function goToPrevRowFinished() {
    if (CURRENT_ROW_FINISHED > 0) {
        CURRENT_ROW_FINISHED--;
        paginateFinishedTasks();
    }
}

function updateFinishedPaginationButtons() {
    const nextButton = document.querySelector(".right-arrow");
    const prevButton = document.querySelector(".left-arrow");

    prevButton.disabled = CURRENT_ROW_FINISHED === 0;
    nextButton.disabled = !isNextRowFinished;
}





function downloadLocalStorage() {
    const data = {
        addedTasks: JSON.parse(localStorage.getItem("addedTasks")) || [],
        finishedTasks: JSON.parse(localStorage.getItem("finishedTasks")) || []
    };

    const download = document.getElementById("download-data")
    const upload = document.getElementById("upload-data")
}