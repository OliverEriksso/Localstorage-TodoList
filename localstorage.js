function saveToLocalStorage() {
    //Localstorage can only store data in the form of strings, it doesn't
    //understand objects, arrays or others like it. So when we save an object
    //or some such we have to convert it to a string format, with stringify
    localStorage.setItem("addedTasks", JSON.stringify(savedAddedTasks));
    localStorage.setItem("finishedTasks", JSON.stringify(savedFinishedTasks));
}

document.getElementById("download-data").addEventListener("click", downloadLsData);
function downloadLsData() {
    const addedTasks = JSON.parse(localStorage.getItem("addedTasks")) || [];
    const finishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
    
    const allData = {
        addedTasks: addedTasks,
        finishedTasks: finishedTasks
    };
    //basic stringify syntax = (value, replacer, space)
    //in our case this means, (1) all the data
    //(2) null since we're not replacing or changing anything, it'll be included as is
    //(3) this is basically white space I think? so 2 ensures output is indented w/ 2 spaces making it more readable for us
    const dataString = JSON.stringify(allData, null, 2);
    //blob stands for Binary Large Object, it is a way to handle/store 
    //"file-like data", so we need to convert our JSON data to a blob for "file-like data"
    const blob = new Blob ([dataString], { type: "application/json" });
    //browser doesn't have access to files/blob objects, the url syntax below
    // creates a temporary url that the browser CAN use to access your file
    const url = URL.createObjectURL(blob);
    //then we need to create a temporary <a> tag
    const tempA = document.createElement("a");
    tempA.href = url;
    tempA.download = "todolist-data.json";
    //trigger download
    tempA.click();
    //then we need to ensure we remove previous added stuff so no duplicates
    URL.revokeObjectURL(url);
    tempA.remove();
}

document.getElementById("upload-data").addEventListener("change", uploadLsData);
function uploadLsData(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }
    //FileReader is a built-in JS API, this is what we use to read from the 
    // <input type="file" file that is inputted. But to actually start reading
    //the filee we need to use reader.readAsText() which is one several
    //functions it can use, it can also use readAsDataURL etc (images)
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            //since we convert the data to a string format with stringify
            //we need to convert it back to an object we can use in our code
            const uploadedData = JSON.parse(e.target.result);
            savedAddedTasks = uploadedData.addedTasks;
            savedFinishedTasks = uploadedData.finishedTasks;
            //then we just make sure all the necessary functions are updated
            saveToLocalStorage();
            paginateTasks();
            paginateFinishedTasks();
            updateAddedTasksCounter();
            console.log("success");
        } catch (error) {
            alert("Failed to upload data");
            throw new Error("Could not read file");
        }
    }
    //FileReader on it's own doesn't read the file, we need this to actually read it
    //so without readAsText the .onload function never fires off, basically
    reader.readAsText(file);
}