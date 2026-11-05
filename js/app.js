
const listaDeTareas = [];

//Capturas datos del form y de los contenedores
const formulario = document.getElementById("form-Planificador");
const contenedorAlertas = document.getElementById("contenedor-alertas");
const contenedorTareas = document.getElementById("contenedor-tareas");



//Mostrar Alertas 
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

//Capturar tareas
function capturarTarea(evento) {
    //Evito que la página se recargue al enviar el form
    evento.preventDefault();

    //Capturo datos por ID
    const boton_save = document.getElementById("btn-Guardar");
    const name = document.getElementById("inputProyecto");
    const task = document.getElementById("inputTarea");
    const description = document.getElementById("textareaDescripcion");
    const priority = document.getElementById("selectPrioridad");
    const date = document.getElementById("inputFecha");

    //Valida los campos antes de crear el objeto
    if (name.value.trim() === "" || task.value.trim() === "" || description.value.trim() === ""
        || priority.value.trim() === "" || date.value.trim() === "") {
        mostrarAlertas("Porfavor Completa Todos Los Campos.");
        return;
    }

    //Creo un objeto con los valores capturados
    const newTask = {
        id: Date.now(),
        nombre: name.value.trim(),
        tarea: task.value.trim(),
        description: description.value.trim(),
        prioridad: priority.value,
        fecha: date.value,
        estado: 'Pendiente'
    };

    listaDeTareas.push(newTask);
    formulario.reset();

    //Llamar la función para mostrar tareas
    mostrarTareas();

    mostrarAlertas("Tarea agregada exitosamente", "success");
    console.log(listaDeTareas);
}

formulario.addEventListener('submit', capturarTarea);

function mostrarTareas() {
    contenedorTareas.innerHTML = "";

    if (listaDeTareas.length === 0) {
        console.log("Nada");
        
        contenedorTareas.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-journal-text fs-1"></i>
            <p class="mt-2">No tienes tareas registradas. Usa el botón "Nueva Tarea" para comenzar.</p>
        </div>
        `;
        return;
    }

    //Recorrer el arreglo para insertar las tareas en el HTML 
    listaDeTareas.forEach(tarea => {
        
        
    });

}


