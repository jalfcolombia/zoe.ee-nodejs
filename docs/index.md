# Zoe Enterprise Edition para NodeJS

Zoe EE es una implementación de un estándar de programación originalmente creado por Julian Lasso (<julian.lasso@gmail.com>) y con la ayuda de David Sánchez (<correode@david.sanchez>), con el fin de ser usado en los desarrollos de software del Servicio Nacional de Aprendizaje - SENA en el equipo de Ejecución de la Formación.

La presente implementación está orientada exclusivamente a la creación de interfaces de programación de aplicaciones, es decir, un API.

Esta implementación se enfoca en los siguientes aspectos:

- Base de datos con SQL Server y ORACLE.
- Sistema de caché con Redis
- Las cookies no son usdas aunque el sistema las soporta
- El sistema debe ser escalable y por ende cada paquete o módulo del sistema deberá ser lo mayormente independiente de los demás paquetes
- Solo existirá un paquete inicial el cual se llamará "Security" y este define las reglas de trabajo en cuanto a la seguridad del sistema

## Contenido

1. [Estructura inicial de sistema](init-sys-struct.md)
2. Explicación de la carpeta "core"
3. Namespaces
4. Controladores
5. Interfaces
6. Mensajes
7. Middlewares
8. Modelos
9. Validadores
10. Hooks
11. @types
12. Módulos
13. Rutas
14. Cómo correr el sistema en modo desarrollo
15. Cómo desplegar a producción