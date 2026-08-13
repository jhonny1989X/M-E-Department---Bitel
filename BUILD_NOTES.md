# Android project

Abra la carpeta raíz del repositorio con Android Studio (API mínima 26) y deje en **Settings > Build Tools > Gradle > Distribution: Wrapper**. Espere que Gradle sincronice y seleccione **Build > Build APK(s)**. El APK de prueba se crea en `app/build/outputs/apk/debug/app-debug.apk`.

La URL activa de Apps Script ya está incluida en `MainActivity.kt`. Para que las listas y el login consuman datos reales, el siguiente ajuste reemplaza los datos visuales de demostración por peticiones HTTP al backend.
