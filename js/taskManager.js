class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(nameProjects, nameTask, description, priority, entrega, status = 'PORHACER') {
        this.currentId++;
        this.tasks.push({
            id: this.currentId,
            nameProjects: nameProjects,
            nameTask: nameTask,
            description: description,
            priority: priority,
            entrega: entrega,
            status: status
        });
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
    }

    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);

        const currentIdString = String(this.currentId);
        localStorage.setItem('currentId', currentIdString);
    }

    load() {
        if (localStorage.getItem('tasks')) {
            const tasksJson = localStorage.getItem('tasks');
            this.tasks = JSON.parse(tasksJson);
        }

        if (localStorage.getItem('currentId')) {
            const currentIdString = localStorage.getItem('currentId');
            this.currentId = Number(currentIdString);
        }
    }
}