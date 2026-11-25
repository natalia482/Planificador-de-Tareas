// SPRINT 2
const taskManager = new TaskManager();
taskManager.load(); // Carga las tareas guardadas antes de pintarlas

// Captura de elementos del DOM
const formulario = document.getElementById("form-Planificador");
const contenedorAlertas = document.getElementById("contenedor-alertas");
const contenedorTareas = document.getElementById("contenedor-tareas");

// Elementos del Switch en el Modal/Offcanvas
const switchTareaModal = document.getElementById("switchCheckChecked");
const labelSwitchModal = document.querySelector("label[for='switchCheckChecked']");

if (switchTareaModal && labelSwitchModal) {
    switchTareaModal.addEventListener("change", () => {
        if (switchTareaModal.checked) {
            labelSwitchModal.textContent = "Tarea Finalizada";
            labelSwitchModal.classList.add("text-success", "fw-bold");
        } else {
            labelSwitchModal.textContent = "¿Tarea Finalizada?";
            labelSwitchModal.classList.remove("text-success", "fw-bold");
        }
    });
}

// Mostrar Alertas dinámicas con Bootstrap
function mostrarAlertas(mensaje, tipo) {
    const alert = document.createElement("div");
    alert.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
      <div>${mensaje}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    contenedorAlertas.append(alert);
    setTimeout(() => {
        const alertaActual = bootstrap.Alert.getOrCreateInstance(alert.querySelector(".alert"));
        if (alertaActual) {
            alertaActual.close();
        }
    }, 3500);
}

// Capturar tarea desde el formulario y registrar en TaskManager
function capturarTarea(evento) {
    evento.preventDefault();

    const inputProyecto = document.getElementById("inputProyecto");
    const inputTarea = document.getElementById("inputTarea");
    const textareaDescripcion = document.getElementById("textareaDescripcion");
    const selectPrioridad = document.getElementById("selectPrioridad");
    const inputFecha = document.getElementById("inputFecha");

    // Validación de campos vacíos
    if (
        inputProyecto.value.trim() === "" ||
        inputTarea.value.trim() === "" ||
        textareaDescripcion.value.trim() === "" ||
        selectPrioridad.value.trim() === "" ||
        inputFecha.value.trim() === ""
    ) {
        mostrarAlertas("Por favor completa todos los campos.", "danger");
        return;
    }

    // Prioridad visual
    let prioridadTexto = "Pendiente";
    if (selectPrioridad.value === "1") {
        prioridadTexto = "Urgente";
    } else if (selectPrioridad.value === "2") {
        prioridadTexto = "Importante";
    } else if (selectPrioridad.value === "3") {
        prioridadTexto = "Delegar";
    } else if (selectPrioridad.value === "4") {
        prioridadTexto = "Secundario";
    }

    // Registrar en TaskManager (estado inicial por defecto será 'PORHACER')
    taskManager.addTask(
        inputProyecto.value.trim(),
        inputTarea.value.trim(),
        textareaDescripcion.value.trim(),
        prioridadTexto,
        inputFecha.value
    );
    taskManager.save();

    console.log(taskManager.tasks);
    formulario.reset();

    if (switchTareaModal && labelSwitchModal) {
        switchTareaModal.checked = false;
        labelSwitchModal.textContent = "¿Tarea Finalizada?";
        labelSwitchModal.classList.remove("text-success", "fw-bold");
    }

    mostrarTareas();

    // Cierre automático del Offcanvas
    const elementoOffcanvas = document.getElementById("offcanvasNuevaTarea");
    if (elementoOffcanvas) {
        const instanciaOffcanvas = bootstrap.Offcanvas.getInstance(elementoOffcanvas);
        if (instanciaOffcanvas) {
            instanciaOffcanvas.hide();
        }
    }

    mostrarAlertas("Tarea agregada exitosamente", "success");
}

if (formulario) {
    formulario.addEventListener("submit", capturarTarea);
}

// Delegación de eventos para eliminar tarea desde el botón .delete-button
if (contenedorTareas) {
    contenedorTareas.addEventListener("click", (event) => {
        const botonEliminar = event.target.closest(".delete-button");
        if (botonEliminar) {
            const tarjeta = botonEliminar.closest("[data-task-id]");
            const taskId = Number(tarjeta.dataset.taskId);
            taskManager.deleteTask(taskId);
            taskManager.save();
            mostrarTareas();
        }
    });
}

// Dibujar las tareas en el HTML
function mostrarTareas() {
    contenedorTareas.innerHTML = "";

    if (taskManager.tasks.length === 0) {
        contenedorTareas.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-journal-text fs-1"></i>
            <p class="mt-2">No tienes tareas registradas. Usa el botón "Nueva Tarea" para comenzar.</p>
        </div>
        `;
        return;
    }

    taskManager.tasks.forEach((tarea) => {
        let claseBadge = "badge-menta";
        if (tarea.status === "Completada") {
            claseBadge = "badge-lavanda";
        } else if (tarea.priority === "Urgente") {
            claseBadge = "badge-durazno";
        } else if (tarea.priority === "Importante") {
            claseBadge = "badge-crema";
        }

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";
        col.dataset.taskId = tarea.id;

        col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm tarjeta-tarea">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold m-0 ${tarea.status === 'Completada' ? 'text-decoration-line-through text-muted' : ''}">${tarea.nameTask}</h5>
              <span class="badge ${claseBadge} px-2 py-1">${tarea.status === 'Completada' ? 'Completada' : tarea.priority}</span>
            </div>
            <h6 class="text-secondary small mb-2"><i class="bi bi-archive me-1"></i>${tarea.nameProjects}</h6>
            <p class="card-text text-muted small">${tarea.description}</p>
          </div>
          <div class="pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
            <span><i class="bi bi-calendar3 me-1"></i> ${tarea.entrega}</span>
            
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch-${tarea.id}" ${tarea.status === "Completada" ? "checked" : ""} onchange="cambiarEstadoTarea(${tarea.id})">
                <label class="form-check-label small" for="switch-${tarea.id}">${tarea.status === "Completada" ? "Finalizada" : "Pendiente"}</label>
            </div>

            <button class="btn btn-sm btn-outline-danger border-0 delete-button">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

        contenedorTareas.appendChild(col);
    });
}

// Cambiar estado de completado desde la tarjeta
function cambiarEstadoTarea(id) {
    const tarea = taskManager.tasks.find((t) => t.id === id);
    if (tarea) {
        tarea.status = tarea.status === "Completada" ? "PORHACER" : "Completada";
        taskManager.save();
        mostrarTareas();
    }
}

// Carga inicial al abrir la app
mostrarTareas();