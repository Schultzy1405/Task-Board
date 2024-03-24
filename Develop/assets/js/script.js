// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskIdCounter = 1
let taskTitle = document.getElementById('task-title')
let dueDate = document.getElementById('due-date')
let taskDescription = document.getElementById('task-description')
// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskId = "Task " + taskIdCounter
    taskIdCounter++
    return taskId
}
function getLocal() {
   const localGet = localStorage.getItem('formInfo')
   if (localGet) {
        const localGot = JSON.parse(localGet)
        if (localGot.status === 'todo') {
            let newTaskCard = document.createElement('div')
            newTaskCard.classList.add('task-card')
            newTaskCard.innerHTML = `
                <h3>${localGot.taskTitle}</h3>
                <p><strong>Due Date:</strong> ${localGot.dueDate}</p>
                <p><strong>Description:</strong> ${localGot.taskDescription}</p>
                <button type="button"id="deleteBtn">Delete</button>
                `;
            $('#todo-cards').append(newTaskCard);
        }
   } 
}
// Todo: create a function to create a task card
$('#saveBtn').on("click", function() {
    let taskTitle = $('#task-title').val();
    let dueDate = new Date($('#due-date').val());
    let taskDescription = $('#task-description').val();

    if (taskTitle === '' || dueDate === '' || taskDescription === '') {
        alert("Please fill in all fields.");
    } else {
        const completeForm = {
            taskTitle,
            dueDate,
            taskDescription,
            status: 'todo'
        };

        let newTaskCard = document.createElement('div');
        newTaskCard.classList.add('task-card');

        let currentDate = new Date();
        if (dueDate < currentDate) {
            newTaskCard.classList.add('overdue');
        } else if (dueDate.getTime() - currentDate.getTime() < 86400000) {
            newTaskCard.classList.add('near-deadline');
        }

        newTaskCard.innerHTML = `
            <h3>${taskTitle}</h3>
            <p><strong>Due Date:</strong> ${dueDate.toDateString()}</p>
            <p><strong>Description:</strong> ${taskDescription}</p>
            <button type="button" class="deleteBtn">Delete</button>
        `;

        $('#todo-cards').append(newTaskCard);
        localStorage.setItem('formInfo', JSON.stringify(completeForm));
    }
});
$('.closeBtn').on("click", function() {
    $('#formModal').modal('hide')
})
$('#closeBtn').on("click", function() {
    $('#formModal').modal('hide')
})
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $(".lane").sortable({
        connectWith: ".lane",
        revert: true
    });

    $(".task-card").draggable({
        connectToSortable: ".lane",
        revert: "invalid"
    });
}

renderTaskList();
$( function() {
    $( "#due-date" ).datepicker();
} );
// Todo: create a function to handle deleting a task
$('#todo-cards').on("click", "#deleteBtn", function() {
    $(this).closest('.task-card').remove();
    localStorage.removeItem('formInfo')
})
// Todo: create a function to handle dropping a task into a new status lane
document.addEventListener('DOMContentLoaded', function () {
    
    document.querySelectorAll('.task-card').forEach((task) => {
        task.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", event.target.id);
            event.target.classList.add("is-dragging");
        });
        
        task.addEventListener("dragend", (event) => {
            event.target.classList.remove("is-dragging");
        });
    });
    document.querySelectorAll('#lanes').forEach((lane) => {
        lane.addEventListener("dragover", (event) => {
            event.preventDefault(); 
        });

        lane.addEventListener("drop", (event) => {
            event.preventDefault();
            const draggedCardId = event.dataTransfer.getData("text/plain");
            const draggedCard = $(draggedCardId)
            if (draggedCard) {
                event.target.querySelector('.taskCards').appendChild(draggedCard);
                draggedCard.classList.remove("is-dragging");
                draggedCard.draggable();
                draggedCard.droppable()
            }
        });
    });
});

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    getLocal()
});
