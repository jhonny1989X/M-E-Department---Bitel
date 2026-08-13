# Instalación - primera versión

## 1. Preparar la hoja

1. Abra la hoja de respuestas de Monitoreo DC.
2. Vaya a **Extensiones > Apps Script**.
3. Cree el archivo `MonitoreoDC_Backend.gs` y pegue el archivo ubicado en `apps_script/MonitoreoDC_Backend.gs`.
4. Ejecute una vez `installMonitoreoDC` y autorice el acceso.
5. En `USUARIOS_APP`, cree al menos un administrador. Ejemplo: `admin | clave-temporal | ADMIN | | SI`.
6. En **Implementar > Nueva implementación > Aplicación web**, seleccione: ejecutar como usted; acceso: cualquiera. Copie la URL terminada en `/exec`.

## 2. Configurar Android

Abra `app/src/main/java/com/bitel/medepartment/MainActivity.kt` y reemplace `PEGAR_URL_APPS_SCRIPT_AQUI` por la URL `/exec`.

## Seguridad

La pantalla administrativa muestra contraseñas porque así fue solicitado. Para producción, las contraseñas deben guardarse cifradas y nunca mostrarse en texto plano.
