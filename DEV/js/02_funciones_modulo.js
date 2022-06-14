function procesarInformacion(idUsuario, idProyecto, propsConf){
	let tmp = '';
	if (!propsConf.totalRegistros) {
		propsConf.totalRegistros = 88250;
	}
	// obtener arreglo de consultas sql 
	return generarConsultas(idUsuario, idProyecto, propsConf)
	.then(function(arr){
		// crear el directorio temporal
		return new Promise(function(resolve, reject){
			createTmpDir()
			.then(function(rutaProcesamiento){
				tmp = rutaProcesamiento;
				resolve({path:rutaProcesamiento+'\\', array : arr});
			})
		})
	})
	.then(function(params){
		// crear los archivos json y zip
		return crearArchivosDatos(params.array, params.path, propsConf.passworZip)
	})
	.then(function(rutaProcesamiento){
		// enviar los zip encriptados al servidor
		return realizarTransferencia(rutaProcesamiento, propsConf.phpFile);
	})
	.then(function(responsePeticion){
		// eliminar el directorio temporal
		// console.log('DEL TMP: ', responsePeticion.pathProccess)
		fs.removeSync(responsePeticion.pathProccess);
		return responsePeticion.messages;
	})
	.catch(function(err){
		console.error(err)
	})
}

function generarConsultas(idUsuario, idProyecto, propsConf){
	let nombreTabla = '', query = '';
	let objTablas = propsConf.tablas, arrQuerys = [], jsonResponse = {};
	let vueltasBucle = 0, inicio = 0, p = 0;

	return new Promise(function(resolve, reject){
		for (let i = 0, p = Promise.resolve(); i < objTablas.length; i++) {
			p = p.then(function() {
				nombreTabla = objTablas[i];
				return select(nombreTabla, { cols: "count(*) total", where: { variables : "usuario, proyecto", valores: `${idUsuario}__${idProyecto}` } });
			})
			.then(function(data){
				jsonResponse = { 
					tableName : objTablas[i], 
					cantRows : data[0].total, 
					vecesLimite : (Math.trunc(data[0].total / propsConf.totalRegistros)), 
					resto : data[0].total - (Math.trunc(data[0].total / propsConf.totalRegistros) * propsConf.totalRegistros)
				};
				return jsonResponse;
			})
			.then(function(json){
				if (json.cantRows > 0) {
					vueltasBucle = json.vecesLimite;
					if (json.vecesLimite < 1) {
						// se generará solo una consulta
						vueltasBucle = 1;
					}
					for(let x = 0; x < vueltasBucle; x++){
			   // se genera la consulta para obtener todas las filas 
			   if (json.vecesLimite < 1) {
	       arrQuerys.push({ tableName: json.tableName, where: { variables : "usuario, proyecto", valores : `${idUsuario}__${idProyecto}` }, limit : { start : 0, end: json.cantRows } });
			   } else {
			   	// se calcula el limite inicial y el final
			     inicio = propsConf.totalRegistros * x;  
	       arrQuerys.push({ tableName: json.tableName, where: { variables : "usuario, proyecto", valores : `${idUsuario}__${idProyecto}` }, limit : { start : inicio, end: propsConf.totalRegistros } });

			     if ((vueltasBucle-1) == x && json.resto > 0) {
			     	// se calcula las filas que quedaron pendientes 
			      inicio =  inicio + propsConf.totalRegistros;
			      arrQuerys.push({ tableName: json.tableName, where: { variables : "usuario, proyecto", valores : `${idUsuario}__${idProyecto}` }, limit : { start : inicio, end: json.resto } });
			     }
			   }
					}
				}
				return;
			})
			.then(function(){
				if (i == (objTablas.length-1)) {
					resolve(arrQuerys);
				}
			})
		}
		if (objTablas.length == 0) {
			reject('Falta propiedad en el objeto json de parametro obj.tablas:["t1","t2"]');
		}
	}) //end proms
}

function crearArchivosDatos(arrQuerys, pathProccess, passZip){
	const lineas = 10000;
	let x = 0, contadorString = 0, p = 0;
 let comma = '', nombreFile = '', jsonString = '', pathFile = '';
 let output = '', nombreZip = '', fileZip = '';
 return new Promise(function(primerResolve, reject){
		for (let i = 0, p = Promise.resolve(); i < arrQuerys.length; i++) {
			p = p.then(function() {
				return select(arrQuerys[i].tableName, { cols: "*", where: arrQuerys[i].where, limit : arrQuerys[i].limit });
			})
			.then(function(data){
				comma = ',\n';
				jsonString = '';
				// nombre del archivo
				nombreFile = 'file_' + i + '.json';
				contadorString = 0;
				// ruta en c://
				pathFile = pathProccess + 'json'+ path.sep +nombreFile;
				// creando el archivo para insertarle datos
		  fs.ensureFileSync(pathFile)

				if (data.length  > 0) {
					x = 0;
		   jsonString = `{ "${arrQuerys[i].tableName}" : [\n`; 
		   // agregando contenido de la tabla
		   fs.appendFileSync(pathFile, jsonString)
		   jsonString = '';

		   do{
		    if (x == (data.length-1)) {
		     comma = '';
		    }
		    // agregando contenido a el string
	     jsonString += `\t\t${JSON.stringify(data[x])}${comma}`; 

		    if (contadorString == lineas || x == (data.length-1)) {
		    	// console.log('Faltan: %s líneas en: %s', (data.length-1) - x, nombreFile)
			    // agregando el contenido del string
		     fs.appendFileSync(pathFile, jsonString)
		     // limpiando cada con (lineas) valor se cumple
		     jsonString = '';
		     // inicia nuevamente
		     contadorString = 0;
		    }

		    x++;
		    contadorString++;
		   } while(x < data.length);
		   jsonString = `\n\t]\n}\n`;
		   fs.appendFileSync(pathFile, jsonString)
		   jsonString = '';
		   return pathFile;
				}
			})
			.then(function(pathFile){
				return new Promise(function(resolve, reject){
					nombreZip = path.basename(pathFile, '.json');
					nombreZip = nombreZip+'.zip'
					output = fs.createWriteStream(pathProccess + '/'+ nombreZip, {autoClose : true});
					fileZip = new archiver('zip-encryptable', {
						zlib: { level: 9 },
						forceLocalTime: true,
						password: passZip
					});
					fileZip.pipe(output);
					// agregan el archivo, con el mismo nombre que contiene
					fileZip.file(pathFile, { name: path.basename(pathFile) });
					// llamar a terminar
					fileZip.finalize()
					// esperar a terminar el proceso
					fileZip.on('end', function(){
						resolve(pathFile);
		   })
					fileZip.on('error', function(err){
						reject(err);
					})
				})
			})
			.then(function(pathJsonFile){
				// solo validar que ya termino todos los archivos
				if (i == (arrQuerys.length-1)) {
					// console.log('TERMINO DE CREAR ARCHIVOS JSON Y COMPRIMIRLOS.')
					fs.removeSync(path.dirname(pathJsonFile));
					primerResolve(pathProccess)
				}
			})
		}
	})
}

function realizarTransferencia(pathProccess, serverPathPhp){
	let files = fs.readdirSync(pathProccess);
	let data = {}, p = 0, obj = [];
	return new Promise(function(resolve, reject){
		if (files.length > 0) {
			for (let i = 0, p = Promise.resolve(); i < files.length; i++) {
				p = p.then(function() {
				return fs.readFile(pathProccess+files[i], { encoding: 'base64' })
				})
				.then(function(code64){
					data = {data : code64, zipName : files[i]};
	    return fetch(serverPathPhp, {
						method: 'POST',
						body: JSON.stringify(data),
						headers:{
					  'Content-Type': 'application/json'
						}
					})
				})
				.then(function(response){
  			return response.text()
  		})
  		.then(function(text){
  			// MESSAGE RESPONSE SERVER
  			obj.push({response: text});
					if (i == (files.length-1)) {
						// console.log('TERMINO PROCESO DE TRANSFERENCIA.')
						resolve({pathProccess: pathProccess, messages: obj});		
					}
  		})
			}
		} else {
			reject('No se crearon achivos en: ', pathProccess)
		}
	})
}

function createTmpDir(){
	const tmpDir = os.tmpdir(); 
	return new Promise(function(resolve, reject){
		fs.mkdtemp(`${tmpDir}${path.sep}`, (err, folder) => {
		  if (err){ reject(err) }
		  else { resolve(folder) }
		});
	})
}