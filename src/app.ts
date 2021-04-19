// Librerías
import Zoe from '@core/zoe.module';
import Assistance from '@assistance/assistance.module';

// Registro de diccionarios
Zoe.Dictionary.register(Assistance.MessagesDictionary);

// Servidor
const server = new Zoe.Server();
server.run();

// async function hola(): Promise<void> {
//   const cache = new Zoe.RedisServer();
//   cache.set('prueba1', [1, 'dos', 34]);
//   cache.set('prueba2', { uno: 1, dos: "dos 'á _3", tres: 3.3 });
//   const prueba1 = (await cache.get('prueba1')) as Array<unknown>;
//   const prueba2 = await cache.get('prueba2');
//   const p = await cache.has('prueba3');
//   await cache.hmset('probando', {
//     hola: 1,
//     dos: 'Julian Lassó',
//     tres: [1, 'dos', 34],
//     cuatro: { uno: 1, dos: "dos 'á _3", tres: 3.3 },
//   });
//   console.log(prueba1[0]);
//   console.log(prueba2);
//   console.log(p);
//   console.log(typeof (await cache.hmget('probando', 'hola')));
//   console.log('Existe', await cache.hhas('probando', 'hola'));
//   console.log('Borrado', await cache.hdelete('probando', 'hola'));
//   console.log('Expiración', await cache.expire('probando', 10));
//   console.log('hola mundo');
// }

// hola();
