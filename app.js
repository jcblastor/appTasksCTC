require('colors');

const {
  inquirerMenu,
  pausa,
  leerInput,
  listarTareasBorrar,
  confirm,
  mostrarListadoCheckList
} = require('./helpers/inquirer');
const {guardarDB, leerDB} = require('./helpers/guardarArchivo');
const Tasks = require('./models/tasks');

console.clear();

const main = async () => {
  let opt = '';
  const tareas = new Tasks();

  const tareasDB = leerDB();

  if (tareasDB) {
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    //imprimir menu
    opt = await inquirerMenu();

    switch (opt) {
      case '1': //crear
        const desc = await leerInput('Descripción:');
        tareas.crearTarea(desc);
        break;

      case '2': //listar todas
        tareas.listadoCompleto();
        break;

      case '3': //listar completados
        tareas.listarPendientesCompletadas(true);
        break;

      case '4': //listar pendiente
        tareas.listarPendientesCompletadas(false);
        break;

      case '5': //completado | pendiente
        const ids = await mostrarListadoCheckList(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;

      case '6': //eliminar
        const id = await listarTareasBorrar(tareas.listadoArr);
        if (id !== '0') {
          const ok = await confirm('Estas seguro?');
          if (ok) {
            tareas.borrarTarea(id);
            console.log('Tarea borrada');
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== '0');
};

main();
