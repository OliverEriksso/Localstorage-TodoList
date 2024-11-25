const closeMenu = document.getElementById("close-sett");
const menu = document.querySelector(".align-left");

function closeTheMenu(event) {
    if (event.key === "Escape" || 
        (event.type === "click" && !menu.contains(event.target) && event.target !== closeMenu)) {
        menu.classList.remove("open");
    }
}

closeMenu.addEventListener("click", function() {
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        menu.classList.add("open");
        // document.addEventListener("keydown", closeTheMenu);
        // document.addEventListener("click", closeTheMenu);
    }
});




const getAddTaskDiv = document.querySelector(".create-task-div")
const darkOverlay = document.getElementById("dark-overlay")
const closePopup = document.getElementById("close-popup");
function closeAddTask(event) {
    if (event.key ==="Escape") {
        getAddTaskDiv.style.display = "none";
        darkOverlay.style.opacity = "0";
        darkOverlay.style.pointerEvents = "none";
    }
    if (event.type === "click" && !getAddTaskDiv.contains(event.target)) {
        getAddTaskDiv.style.display = "none";
        darkOverlay.style.opacity = "0";
        darkOverlay.style.pointerEvents = "none";
    }
    if (event.type === "click" && event.target === closePopup) {
        getAddTaskDiv.style.display = "none";
        darkOverlay.style.opacity = "0";
        darkOverlay.style.pointerEvents = "none";
    }
}
document.getElementById("add-task").addEventListener("click", function() {
    getAddTaskDiv.style.display = "flex";
    darkOverlay.style.opacity = "1";
    darkOverlay.style.pointerEvents = "auto";

    darkOverlay.addEventListener("click", closeAddTask);
    document.addEventListener("keydown", closeAddTask);
    closePopup.addEventListener("click", closeAddTask);
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
    validateCurrentRow();
    paginateTasks();
    saveToLocalStorage();

    const allInputs = document.querySelectorAll("input, textarea");
    allInputs.forEach(input => {
        input.value = "";
    });
    updateAddedTasksCounter();
});


function hideDescription(container, desc, title, isChecked) {
    if (isChecked) {
        desc.style.display = "none";
        container.style.height = "35px";
        container.style.width = "200px";
        title.style.border = "none";
        taskList.style.gap ="1.3em"
    } else {
        desc.style.display = "flex";
        container.style.height = "200px";
        container.style.width = "200px";
        title.style.borderBottom = "1px solid black";
        taskList.style.gap ="1.3em"
    }
}

function hideAdded(taskList, isChecked) {
    if (isChecked) {
        taskList.style.display = "none";
    } else {
        taskList.style.display = "grid";
        taskList.style.gridTemplateColumns = "repeat(6, minmax(50px, 1fr))";
    }
}
function hideFinished(finishedTaskList, isChecked) {
    if (isChecked) {
        finishedTaskList.style.display = "none";
    } else {
        finishedTaskList.style.display = "grid";
        finishedTaskList.style.gridTemplateColumns = "repeat(6, minmax(50px, 1fr))";
    }
}