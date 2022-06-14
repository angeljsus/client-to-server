# Transferencia de datos de tablas Cliente/Servidor

### Descripción
Función de transferencia de información de tablas de una aplicación Electron JS.

### Requerimientos

#### Querys
Importar script [querys](https://github.com/angeljsus/querys) para la ejecución de consultas SQLite de la aplicación.

#### Archiver
La funcionalidad requiere registrar `archiver-zip-encryptable` solo por una vez, acá la lo registramos una vez que la aplicación es inicializada y carga la base de datos.

```javascript
cargarTablas()
	.then(function(){
		// solo se debe registrar una sola ocasión, más ocasiones provocará error. Es para encriptar el zip
		return archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));
	})
```

### Funcionalidad
Una vez importado el script para el desarrollo de consultas `SQLite` y registrado `zip-encryptable`, se puede utilizar la funcionalidad.
#### `procesarInformacion(idUsuario, idProyecto, { props })`
**Descripción**

La función permite ejecutar consultas dentro de las tablas necesarias existentes en la base de datos del cliente para crear y procesar archivos json/zip y realizar una transferencia con la información dentro de archivos zip protegidos con contraseña para el almacenamiento dentro de la base de datos del servidor.
#
**Importante:** las tablas de las que se extraerá la información deberán contener el mismo nombre de las columnas `usuario` para el identificador del usuario y `proyecto` para identificar el proyecto.  
#
**Parámetros**
- **idUsuario** *(string)** : valor del `usuario` del que se extraerá la información.
- **idProyecto** *(string)** : valor del `proyecto` del que se extraerá la información.
- **props** *(json)**: objeto contenedor de las propiedades necesarias para el procesamiento y envío de información.
    - **tablas** *(array)**: objeto contenedor del nombre de las tablas de las cuales se extraerá la información.
    - **passworZip** *(string)**: contraseña que se le asignará a los archivos comprimidos creados.
    - **phpFile** *(string)**: dirección a la que se realizarán las peticiones por medio de `POST`.
    - **totalRegistros** *(number)*: límite de inserciones que se le permitirá realizar a cada archivo comprimido. En caso de no existir este valor, por default será 88250, que es el soportado por el tiempo de ejecución del servidor.
#
**Resultados**
```javascript
let jsonInfo = {
    tablas : ['tabla1'],
    passworZip : 'zipPass',
    phpFile : 'https://hostname/fold/accept.php'
};
procesarInformacion('1', '1', jsonInfo)
	.then(function(messages){
		console.log(messages) // salida: [{response: 'Consultas realizada con éxito. 1000 filas insertadas. Tabla: tabla1.\n'}]
	})
```
#
**Servidor**
Para modificar la contraseña del archivo que procesa la información en el servidor, modificar la variable `$password = "nuevaClave"` y verificar que sea la misma que es enviada dentro del objeto en la función javascript `procesarInformacion()`.

También modificar la información de conexión con la base de datos `MYSQL` del servidor.
```php
$usuario = "root";
$contrasena = "";
$servidor = "localhost";
$basededatos = "pruebas_post";
```
