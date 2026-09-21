const form = document.getElementById('form');
const formUpdateEl = document.getElementById('form-update');
const formUpdateInputEl = formUpdateEl.querySelector('input');
const popupEl = document.querySelector('.popup');
const taskInputEl = form.querySelector('input[type="text"');
const tasksEl = document.querySelector('.tasks');
const deleteBtn = document.querySelector('.delete-btn');
const tasksCount = document.querySelector('.tasks-count');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let tasksIDCounter = Number(localStorage.getItem("tasksIDCounter")) || 0;

let selectedTaskID = null;
let currentFilter = "all";

tasksCount.textContent = `${tasks.length} ${tasks.length > 0 ? "items" : "item"}`

createNewTask();
markTaskCompleted();
displayTasksHTML();
editTask();
updateTask()
deleteTask();

function createNewTask() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const date = new Date();
        // console.log(taskInputEl.value, date);
        tasks.push({
            task: taskInputEl.value,
            dueDate: "",
            state: 'active',
            id: tasksIDCounter,
        });

        tasksIDCounter++
        localStorage.setItem("tasksIDCounter", tasksIDCounter);
        
        saveTasks();
        displayTasksHTML();
        
        form.reset();

    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
    if(currentFilter == "all") {
        return tasks;
    }

    return tasks.filter(task => task.state == currentFilter);
}


function displayTasksHTML() {
    let html = '';
    let todos = getVisibleTasks();

     tasksCount.textContent = `${todos.length} ${todos.length > 0 ? "items" : "item"}`;

    if(todos.length > 0) {
        todos.forEach((item, i) => {
            item.task = item.task[0].toUpperCase() + item.task.slice(1);
          
            html += `<li id=${item.id} class="task ${item.state}-state" data-state="${item.state}">
                        <div class="details">
                            <input type="checkbox" name="${item.task}" id="${i}" 
                                ${item.state == "completed" ? "checked" : ""}
                                ${item.state == "completed" ? "disabled" : ""}>
                            <div class="task-info">
                                <p class="task-name">${item.task}</p>
                                <div id="date-wrapper-${item.id}" class="date-wrapper">
                                    ${!item.dueDate || item.dueDate === "No due date"
    ? `
        <div class="no-due-date-msg show">
            <input class="due-date" type="date" />
            No due date
        </div>
    `
    : `
        <button class="due-date-btn">
            <i class="fa-regular fa-calendar-days"></i>
        </button>

        <label for="due-date-${item.id}">Due Date:</label>

        <div class="input-wrapper">
            <input 
                id="due-date-${item.id}"
                name="${item.name}" 
                class="due-date" 
                type="date"
                value="${item.dueDate.replaceAll("/", "-")}"
            />
        </div>
    `
}
                                </div>
                            </div>
                        </div>
                        <div class="btn-group">
                            <button class="edit-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20"><path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z"/></svg>
                            </button>
                            <button class="delete-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20"><path d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg>
                            </button>
                        </div>
                    </li>`
        });

    }
   
    tasksEl.innerHTML = html;
}


function markTaskCompleted() {
    tasksEl.addEventListener('click', (e) => {
       
        if(e.target.getAttribute('type') == 'checkbox') {
            const taskEL = e.target.closest('.task');
            const id = taskEL.getAttribute("id");

            tasks.find(item => item.id == id).state = "completed";

            saveTasks();
            displayTasksHTML();
        }
        
    })
}

 
function setCheckedStateHTML(task) {
    const currentState = task.getAttribute("data-state");
    const selectedTask =  tasks.find ((item, i) => {
        item => item.id == task.id;

        if(item.state != currentState) {
            item.state = currentState;
            tasks[i] = item;
            saveTasks();
        }

        return item;
    });

    let inputEl = `
        <div class="form-groups">
            <div class="form-group">
                <label for="completed">
                    <input 
                        type="radio" 
                        name="${selectedTask.id}" 
                        id="completed" 
                        value="completed"
                        ${selectedTask.state == "completed" ? "checked" : ""} 
                    >
                    Completed
                </label>    
            </div>
            
            <div class="form-group">
                <label for="active">
                    <input 
                        type="radio" 
                        name="${selectedTask.id}" 
                        id="active" 
                        value="active"
                        ${selectedTask.state == "active" ? "checked" : ""}
                    >
                    Active
                </label>
            </div> 
        </div>`;
                    
    formUpdateEl.querySelector('input[type="text"]').insertAdjacentHTML('afterEnd', inputEl );
}


function editTask() {
    const editBtn = document.querySelector('.edit-btn');

    tasksEl.addEventListener('click', (e) => {
        if(e.target.closest('.edit-btn')) {
            const  taskEl = e.target.closest('.task');
            const  currentTask = taskEl.querySelector('.task-name').textContent;

            popupEl.dataset.taskId = taskEl.id;
            popupEl.style.display = "grid";
            popupEl.style.alignItems = "center";
            popupEl.querySelector('input').value = currentTask;
            
            setCheckedStateHTML(taskEl); 
        } 
    });
}
       

function updateTask() {
    
    formUpdateEl.addEventListener('submit', (e) => {
        
        const taskId = popupEl.dataset.taskId;
        const currentState = formUpdateEl
            .querySelector('input[type="radio"]:checked')
            .value;

        const currentTask = formUpdateInputEl.value.trim();
        const task = tasks.find(task => task.id == taskId);
        
         const taskChanged = currentTask !== task.task;
        const stateChanged = currentState !== task.state;

        if (!task) return;

        if (currentTask === "") return;

       if(!taskChanged && !stateChanged) return;

        task.task = currentTask;
        task.state = currentState;

        saveTasks();
        displayTasksHTML();
     
    });
}


function deleteTask() {
    const deleteBtn = document.querySelector('.delete-btn');
    tasksEl.addEventListener('click', (e) => {
        if(e.target.closest('.delete-btn')) {
            const id = e.target.closest('.task').id;
            tasks = tasks.filter(task => task.id != id);
            
            saveTasks();

            // tasksCount.textContent = `${tasks.length} ${tasks.length > 0 ? "items" : "item"}`
            displayTasksHTML(); 
        } 
    });
}

function getFilteredTasks() {
    return tasks.filter(task => task.state == currentFilter);
}


document.querySelector('.filter').addEventListener("click", (e) => {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active')
    });

    if(e.target.classList.contains('all-tasks-btn')) {
        currentFilter = "all"
        document.querySelector('.all-tasks-btn').classList.add('active');
    } else if(e.target.classList.contains('active-tasks-btn')) {
        currentFilter = "active";
         document.querySelector('.active-tasks-btn').classList.add('active')
    } else if(e.target.classList.contains('completed-tasks-btn')) {
        currentFilter = "completed";
         document.querySelector('.completed-tasks-btn').classList.add('active')
    }

        getFilteredTasks();
        displayTasksHTML();
});


//onst dateWrapper = document.querySelector(".date-wrapper");
// const dateInput = document.querySelector(".due-date");

//const dueDateBtn = document.querySelector(".due-date-btn");
// let dateinput;
// tasksEl.addEventListener("click", (e) => {
//     if(e.target.closest(".date-wrapper") || e.target.classList.contains("no-due-date-msg")) {
//         const dateWrapperFullIdName = e.target.closest(".date-wrapper").id;
//         const dateWrapperIdNum = dateWrapperFullIdName.slice(-1);

       
//         const dateInput = e.target.closest(".task").querySelector(".due-date")
//         console.log(dateInput)
        
//         const task = tasks.find(item => item.id == dateWrapperIdNum);
//         // document.querySelector(".task").getAttribute("id")
//         // console.log(task)
//         dateInput.showPicker();

//         dateInput.addEventListener("change", (e) => {
//             const selectedDate = new Date(e.target.value);
//             const month = selectedDate.getUTCMonth() + 1;
//             const day = selectedDate.getUTCDate();
//             const year = selectedDate.getUTCFullYear();
//             // console.log(month, day, year)

//           console.log("Before:", task);
//            task.dueDate = `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;

//             saveTasks();
//             // displayTasksHTML();

//             console.log(tasks)
        
//              displayTasksHTML();

// console.log("After:", task);
// console.log(tasks)
//         })
//     }

// })


tasksEl.addEventListener("click", (e) => {
    const dateWrapper = e.target.closest(".date-wrapper");

    if (!dateWrapper) return;

    const dateWrapperIdNum = dateWrapper.id.replace("date-wrapper-", "");

    const dateInput = dateWrapper.querySelector(".due-date");

    const task = tasks.find(item => item.id == dateWrapperIdNum);

    if (!task) {
        console.log("Task not found:", dateWrapperIdNum);
        return;
    }

    dateInput.showPicker();
});


tasksEl.addEventListener("change", (e) => {
    if (!e.target.classList.contains("due-date")) return;

    const taskEl = e.target.closest(".task");
    const dateWrapper = e.target.closest(".date-wrapper");

    const taskId = dateWrapper.id.replace("date-wrapper-", "");

    const task = tasks.find(item => item.id == taskId);

    if (!task) {
        console.log("Task not found:", taskId);
        return;
    }

    console.log(e.target.value)

    task.dueDate = e.target.value;

    saveTasks();
    displayTasksHTML();

});

