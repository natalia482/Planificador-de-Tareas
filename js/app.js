// Arreglo global de tareas
const listaDeTareas = [];

// Captura de elementos del DOM
const formulario = document.getElementById("form-Planificador");
const contenedorAlertas = document.getElementById("contenedor-alertas");
const contenedorTareas = document.getElementById("contenedor-tareas");

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

    // Convertir el valor de prioridad a texto visible
    let estadoTexto = "Pendiente";
    if (selectPrioridad.value === "1") {
        estadoTexto = "Urgente";
    } else if (selectPrioridad.value === "2") {
        estadoTexto = "Importante";
    } else if (selectPrioridad.value === "3") {
        estadoTexto = "Delegar";
    } else if (selectPrioridad.value === "4") {
        estadoTexto = "Secundario";
    }

    // Objeto con la información de la tarea
    const nuevaTarea = {
        id: Date.now(),
        nombre: inputProyecto.value.trim(),
        tarea: inputTarea.value.trim(),
        descripcion: textareaDescripcion.value.trim(),
        prioridad: selectPrioridad.value,
        fecha: inputFecha.value,
        estado: estadoTexto
    };

    // Guardar en el arreglo y reiniciar el formulario
    listaDeTareas.push(nuevaTarea);
    formulario.reset();

    // Actualizar las tarjetas en la pantalla
    mostrarTareas();

    // Cierre automático del Offcanvas/Modal al guardar
    const elementoOffcanvas = document.getElementById("offcanvasNuevaTarea");
    if (elementoOffcanvas) {
        const instanciaOffcanvas = bootstrap.Offcanvas.getInstance(elementoOffcanvas);
        if (instanciaOffcanvas) {
            instanciaOffcanvas.hide();
        }
    }

    mostrarAlertas("Tarea agregada exitosamente", "success");
}

formulario.addEventListener("submit", capturarTarea);

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
        if (tarea.estado === "Urgente") {
            claseBadge = "badge-durazno";
        } else if (tarea.estado === "Importante") {
            claseBadge = "badge-crema";
        } else if (tarea.estado === "Completada") {
            claseBadge = "badge-lavanda";
        }

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
      <div class="card h-100 border-0 shadow-sm tarjeta-tarea">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title fw-bold m-0">${tarea.tarea}</h5>
              <span class="badge ${claseBadge} px-2 py-1">${tarea.estado}</span>
            </div>
            <h6 class="text-secondary small mb-2"><i class="bi bi-archive me-1"></i>${tarea.nombre}</h6>
            <p class="card-text text-muted small">${tarea.descripcion}</p>
          </div>
          <div class="pt-3 border-top d-flex justify-content-between align-items-center text-muted small">
            <span><i class="bi bi-calendar3 me-1"></i> ${tarea.fecha}</span>
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

// Eliminar tarea por ID
function eliminarTarea(id) {
    const indice = listaDeTareas.findIndex((t) => t.id === id);
    if (indice !== -1) {
        listaDeTareas.splice(indice, 1);
        mostrarTareas();
    }
}

// Inicialización de la pantalla al cargar
mostrarTareas();