class TaskManager {
    constructor(currentId = 0) {
        this.task = [];
        this.currentId = currentId;
    }

    addTask(nameProjects, nameTask, description, priority = "Pendiente", entrega) {
        this.currentId++;
        this.task.push({
            id: this.currentId,
            nameProjects: nameProjects,
            nameTask: nameTask,
            description: description,
            priority: priority,
            entrega: entrega,
        });

    }
}

