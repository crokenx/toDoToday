export const config = {
  modal: {
    name: 'modal',
  },
  showing: {
    default: 'todo',
  },
  cannotDeleteTask: {
    header: 'Tenemos problemas en nuestros servidores',
    subHeader: 'No puedes eliminar tareas en este momento',
    buttons: [
      {
        text: 'Ok',
        role: 'confirm',
      }
    ],
  },
  dismissConfirmation: {
    header: 'Perderas la tarea, deseas salir de todos modos?',
    buttons: [
      {
        text: 'Si',
        role: 'confirm',
      },
      {
        text: 'No',
        role: 'cancel',
      },
    ],
  },
  deleteComparation: {
    default: 'confirm',
  },
  deleteConfirmation: {
    header: 'Perderas la tarea, deseas eliminarla?',
    buttons: [
      {
        text: 'Si',
        role: 'confirm',
      },
      {
        text: 'No',
        role: 'cancel',
      },
    ],
  },
  cancelComparation: {
    default: 'cancel',
  },
  backdropComparation: {
    default: 'backdrop',
  },
};
