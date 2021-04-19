// Rutas
import SecurityRouter from '@security/security.routes';

// Diccionarios
import GeneralMessages from '@security/messages/general.messages';

namespace SecurityModule {
  export class Router extends SecurityRouter {}
  export const MessagesDictionary = GeneralMessages;
}

export default SecurityModule;
