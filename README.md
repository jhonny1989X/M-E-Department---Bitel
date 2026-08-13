# M&E Department - Bitel

Aplicación Android para el Plan de Monitoreo DC, independiente de Frigotek.

## Funciones de la primera entrega

- Inicio de sesión con mostrar/ocultar contraseña.
- Roles: Administrador, Personal M&E y Técnico.
- Técnico: acceso al formulario oficial y consulta/búsqueda de Sites.
- M&E: resumen de personal, Sites propios con cambio de `Trabajo culminado`, e historial por personal.
- Administrador: gestión de personal, consultas globales y gestión visible de usuarios.

## Fuente de datos

Hoja de respuestas: `1T8GU7SoRMWN9CRQR0ED-oac4F7yKcRN_1qwAqa4UYSQ`.

El formulario técnico se abre desde la aplicación:

`https://docs.google.com/forms/d/e/1FAIpQLScsXzAX_GehgkmcrPBkfL2rIPFZ7CS9AuPd3J8mSwseKPSIPQ/viewform?usp=header`

## Estructura acordada de datos

La hoja de respuestas conserva: Marca temporal, Nombre de Site, Tipo de conexión, Escribe tu nombre, Escribe tu número de celular, Nombre de personal M&E, Número de celular, Trabajo culminado y Estado.

Se añadirá una hoja `USUARIOS_APP` para usuario, contraseña, rol, nombre M&E y estado, y una hoja `PERSONAL_ME` para el personal a cargo.
