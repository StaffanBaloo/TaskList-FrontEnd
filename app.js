window.addEventListener("load", () => {
    const todoForm = document.querySelector(".formStyle");
    const todoInput = document.querySelector("#todo-input");
    const todoList = document.querySelector("#todo-list");
    const doneList = document.querySelector("#done-list");

    const addTask = () => {
        const input = todoInput.value;
        if (!input.trim()) {
            todoForm.reset();
            return;
        }
        const taskTitle = todoInput.value;
        const response = await fetch("http://localhost:8080/task/add", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskTitle: taskTitle }),
        });
        fetchTodoTasks();
        fetchDoneTasks();
    };

    const deleteTask = (id) => {
        try {
            const response = await fetch(`http://localhost:8080/task/delete/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Could not delete task");
            }
            const data = await response.json();
        } catch (error) {
            console.error(error);
        }
        fetchTodoTasks();
        fetchDoneTasks();
    };

    const markTaskDone = (id) => {
        try {
            const response = await fetch(`http://localhost:8080/task/check/${id}`, {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error("Could not mark task done");
            }
        } catch (error) {
            console.error(error);
        }
        fetchTodoTasks();
        fetchDoneTasks();
    };

    const fetchTodoTasks = () => {
        try {
            const response = await fetch(`http://localhost:8080/task/todo`);
            if (!response.ok) {
                throw new Error("Could not fetch tasks");
            }
            const data = await response.json();
            todoList.innerHTML = "";
            todoForm.reset();
            data.forEach((element) => {
                const taskTitle = element.taskTitle;
                const added = element.addedDate;
                const id = element.id;
                todoList.appendChild(createTodoRow(id, taskTitle, added));
            })
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDoneTasks = () => {
        try {
            const response = await fetch(`http://localhost:8080/task/done`);
            if (!response.ok) {
                throw new Error("Could not fetch tasks");
            }
            const data = await response.json();
            doneList.innerHTML = "";
            data.forEach((element) => {
                const taskTitle = element.taskTitle;
                const finished = element.finishedDate;
                const id = element.id;
                doneList.appendChild(createTodoRow(id, taskTitle, finished));
            })
        } catch (error) {
            console.error(error);
        }
    };

    const createTodoRow = (id, taskTitle, added) => {
        const li = document.createElement("li");

        const checkButton = document.createElement("button");
        const checkSpan = document.createElement("span");
        checkSpan.classList.add("material-symbols-outlined");
        checkSpan.textContent = "check";
        checkButton.appendChild(checkSpan);
        checkButton.classList.add("custom-check");
        checkButton.addEventListener("click", function () {
            markTaskDone(id);
        });

        const deleteButton = document.createElement("button");
        const deleteSpan = document.createElement("span");
        deleteSpan.classList.add("material-symbols-outlined");
        deleteSpan.textContent = "close";
        deleteButton.appendChild(deleteSpan);
        deleteButton.classList.add("custom-delete");
        deleteButton.addEventListener("click", function () {
            deleteTask(id);
        });
        
        const buttons = document.createElement("div");
        buttons.appendChild(checkButton);
        buttons.appendChild(deleteButton);

        const taskTitleSpan = document.createElement("span");
        taskTitleSpan.textContent = taskTitle;
        taskTitleSpan.classList.add("todo-text");
        
        const addedSpan = document.createElement("span");
        addedSpan.textContent = added;
        addedSpan.classList.add("time");

        const task = document.createElement("div");
        task.appendChild(taskTitleSpan);
        task.appendChild(addedSpan);

        li.appendChild(task);
        li.appendChild(buttons);
    };

    const createDoneRow = (id, taskTitle, finished) => {
        const li = document.createElement("li");

        
        const deleteButton = document.createElement("button");
        const deleteSpan = document.createElement("span");
        deleteSpan.classList.add("material-symbols-outlined");
        deleteSpan.textContent = "close";
        deleteButton.appendChild(deleteSpan);
        deleteButton.classList.add("custom-delete");
        deleteButton.addEventListener("click", function () {
            deleteTask(id);
        });
        
        const buttons = document.createElement("div");
        buttons.appendChild(deleteButton);

        const taskTitleSpan = document.createElement("span");
        taskTitleSpan.textContent = taskTitle;
        taskTitleSpan.classList.add("todo-text");
        
        const finishedSpan = document.createElement("span");
        finishedSpan.textContent = finished;
        finishedSpan.classList.add("time");

        const task = document.createElement("div");
        task.appendChild(taskTitleSpan);
        task.appendChild(finishedSpan);

        li.appendChild(task);
        li.appendChild(buttons);
    }



    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addTask();
    });


    fetchTodoTasks();
    fetchDoneTasks();
})