// Arreglo global de tareas
const listaDeTareas = [];

// Captura de elementos del DOM
const formulario = document.getElementById("form-Planificador");
const contenedorAlertas = document.getElementById("contenedor-alertas");
const contenedorTareas = document.getElementById("contenedor-tareas");

// Elementos del Switch en el Modal/Offcanvas
const switchTareaModal = document.getElementById("switchCheckChecked");
const labelSwitchModal = document.querySelector("label[for='switchCheckChecked']");

// Listener para cambiar el texto del switch dentro del modal en tiempo real
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

// Capturar tarea desde el formulario
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

    // Determina si se guarda como Completada o Pendiente desde el switch del modal
    const estadoInicial = switchTareaModal && switchTareaModal.checked ? "Completada" : "Pendiente";

    const nuevaTarea = {
        id: Date.now(),
        nombre: inputProyecto.value.trim(),
        tarea: inputTarea.value.trim(),
        descripcion: textareaDescripcion.value.trim(),
        prioridad: prioridadTexto,
        fecha: inputFecha.value,
        estado: estadoInicial
    };

    listaDeTareas.push(nuevaTarea);
    formulario.reset();

    // Restablecer el switch del modal al estado inicial
    if (switchTareaModal && labelSwitchModal) {
        switchTareaModal.checked = false;
        labelSwitchModal.textContent = "¿Tarea Finalizada?";
        labelSwitchModal.classList.remove("text-success", "fw-bold");
    }

    mostrarTareas();

    // Cierre automático del Offcanvas/Modal
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

// Dibujar las tareas en el HTML
function mostrarTareas() {
    contenedorTareas.innerHTML = "";

    if (listaDeTareas.length === 0) {
        contenedorTareas.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-journal-text fs-1"></i>
            <p class="mt-2">No tienes tareas registradas. Usa el botón "Nueva Tarea" para comenzar.</p>
        </div>
        `;
        return;
    }

    listaDeTareas.forEach((tarea) => {
        let claseBadge = "badge-menta";
        if (tarea.estado === "Completada") {
            claseBadge = "badge-lavanda";
        } else if (tarea.prioridad === "Urgente") {
            claseBadge = "badge-durazno";
        } else if (tarea.prioridad === "Importante") {
            claseBadge = "badge-crema";
        }

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm tarjeta-tarea">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold m-0 ${tarea.estado === 'Completada' ? 'text-decoration-line-through text-muted' : ''}">${tarea.tarea}</h5>
              <span class="badge ${claseBadge} px-2 py-1">${tarea.estado === 'Completada' ? 'Completada' : tarea.prioridad}</span>
            </div>
            <h6 class="text-secondary small mb-2"><i class="bi bi-archive me-1"></i>${tarea.nombre}</h6>
            <p class="card-text text-muted small">${tarea.descripcion}</p>
          </div>
          <div class="pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
            <span><i class="bi bi-calendar3 me-1"></i> ${tarea.fecha}</span>
            
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switch-${tarea.id}" ${tarea.estado === "Completada" ? "checked" : ""} onchange="cambiarEstadoTarea(${tarea.id})">
                <label class="form-check-label small" for="switch-${tarea.id}">${tarea.estado === "Completada" ? "Finalizada" : "Pendiente"}</label>
            </div>

            <button class="btn btn-sm btn-outline-danger border-0" onclick="eliminarTarea(${tarea.id})">
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
    const tarea = listaDeTareas.find((t) => t.id === id);
    if (tarea) {
        tarea.estado = tarea.estado === "Completada" ? "Pendiente" : "Completada";
        mostrarTareas();
    }
}

// Eliminar tarea por ID
function eliminarTarea(id) {
    const indice = listaDeTareas.findIndex((t) => t.id === id);
    if (indice !== -1) {
        listaDeTareas.splice(indice, 1);
        mostrarTareas();
    }
}

// Carga inicial al abrir la app
mostrarTareas();


//SPRINT 2
const taskManager = new TaskManager();

console.log(taskManager.task);
