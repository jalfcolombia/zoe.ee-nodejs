// Rutas
import RouterAssistance from '@assistance/assistance.routes';

// Diccionarios
import {
  assistanceDictionary,
  listaModalidadFormacionDictionary,
  listaTipoPrograma,
  monthNames,
} from '@assistance/messages/messages.dictionary';

namespace Assistance {
  export class Router extends RouterAssistance {}
  export const MessagesDictionary = {
    ...assistanceDictionary,
    ...listaModalidadFormacionDictionary,
    ...listaTipoPrograma,
    ...monthNames,
  };
}

export default Assistance;
