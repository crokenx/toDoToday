[TOC]

## Requerimientos

- Android Studio
- Xcode
- nvm (node version manager) es recomendado
- Nodejs v20
- Ionic cli

#### Descargar repo

```
$ git clone https://github.com/crokenx/toDoToday.git
```
#### Instalar dependencias

```
$ cd toDoToday
$ npm install
```

#### Agregar plataformas
```
$ ionic cordova platform android
$ ionic cordova platform ios
```

#### Preparar plataforma
```
$ ionic cordova prepare ios
$ ionic cordova prepare android
```
## Correr app en dispositivos
#### iOS
Para poder correr la app en dispositivos reales iOS se debe tener una cuenta de desarrollador disponible ya que se debe ejecutar la aplicación desde Xcode la cuál tiene esta exigencia.

- Abrir Xcode
- Desde Xcode se debe abrir el proyecto anteriormente generado y seleccionar "platforms > ios > toDoToday.xcworkspace"
- Aparecera el proyecto en Xcode
- Debe seleccionarse el proyecto "toDoToday" desde el menú izquierdo, aparecera una nueva sección
- Desde el menú izquierdo de la nueva sección, debajo de la pestaña "TARGETS" seleccionar nuevamente "toDoToday"
- En está nueva sección se debe firmar la aplicación con la cuenta de desarrollo a la que perteneces
- Después de estos pasos podrás ejecutar la aplicación en un dispositivo real seleccionandolo en el menú superior y oprimiendo "CMD + R"
- Para construir una .ipa tendrás que archivar la app y seleccionar el tipo de .ipa que quieres construir, dependiendo de esto tu cuenta de desarrollador deberá cumplir con diferentes requerimientos

#### Instalar .ipa
- Para instalar la .ipa en un dispositivo iOS recomiendo "Apple Configurator"
- Desde "Apple Configurator" deberás buscar tu dispositivo iOS y agregar la .ipa desde su menú de instalación

#### Android

- Abrir Android Studio
- Desde Android Studio, abrir el proyecto y seleccionar "platforms > android "
- Aparecera el proyecto en Android Studio
- Podrás ejecutar la aplicación en el dispositivo que tengas conectado apenas Android Studio termine su proceso de arranque
- El dispositivo Android debe tener habilitadas las opciones de desarrollador
- Para crear una .apk debes ir a " Build > Build App Bundled(s) / APK(s) " y seleccionar el tipo de .apk, dependiendo de esto requeriras o no una cuenta de desarrollo

#### Instalar .apk

- Para instalar la .apk en un dispositivo Android recomiendo el uso de "adb" desde la terminal
- Deberás ejecutar el comando "adb install /path/to/app.apk", el dispositivo android debe estar conectado al computador
