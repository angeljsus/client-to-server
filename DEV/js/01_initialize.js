// file system
const fs = require('fs-extra');
// path
const path = require('path')
// os
const os = require('os'); 
// archiver para la generación de zip con contraseña
const archiver = require('archiver');
// require querys
const { select } = require(__dirname + '\\js\\querys.min.js');


document.addEventListener('DOMContentLoaded', initialize);

function initialize(){
	console.log('App initialized!');
	

	// Cargar las tablas de la aplicación
	cargarTablas()
	.then(function(){
		// IMPORTANTE
  		// solo se debe registrar una sola ocasión, más ocasiones provocará error. Es para encriptar el zip
		return archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));
	})
	.then(function(){
		console.log('Zip encriptable esta registrado!')
		// ahora a agregar la funcionalidad al botón
		const button = document.getElementById('button');
		button.addEventListener('click', function(){
			// objeto json a enviar
			const jsonInfo = { };
			// propiedades
			// nombre de las tablas de las que se extraerá la información
			jsonInfo.tablas = ['tabla1', 'tabla2', 'tabla3'];
			/* limite de registros que almacenara cada archivo json/zip y que enviará al servidor
			no es requerido, por default serán 88250 */
			jsonInfo.totalRegistros = 10000;
			// contraseña que contendra el archivo zip
			jsonInfo.passworZip = 'zipPass';
			// ruta del php en el servidor que procesara el zip para insertar la información
			jsonInfo.phpFile = 'http://localhost/zipZone/accept.php';
			// ejecutar la funcionalidad enviando el jsonInfo y el id del usuario y proyecto
			procesarInformacion('1', '1', jsonInfo)
			.then(function(messages){
				console.log(messages)
			})
		});
	}) 
}