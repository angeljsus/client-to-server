<?php 
	$informacion = file_get_contents("php://input");
	$jsonData = json_decode($informacion);
	$zipBase = $jsonData-> data;
	$zipName = $jsonData-> zipName;
	$zipBase = base64_decode($zipBase);
	$password = "zipPass";

	crearZip($zipName, $zipBase, $password);


	/* recibe como parametros el nombre, base64 y contraseña */
	function crearZip($nameZip, $base, $pass){
		// ruta de archivos 
		$direccion = "./zip/";
		// ruta que tomara el archivo
		$direccionZip = "$direccion$nameZip";
		$direccionJson = $direccion."json/";
		// crea la carpeta de almacenamiento de archivos
		createDirectorio($direccion);
		// createDirectorio($direccion);

		// crea el archivo dentro de la ruta
		$file = file_put_contents($direccionZip, $base);
		if ($file) {
			// echo "El archivo esta donde debe\n";
			$test = file_exists($direccionZip);
			$status = "";
			$descompress = "";

			if ($test) {
				$zipFile = new ZipArchive();
				// abre el archivo
				if ($zipFile -> open($direccionZip) === true) {

					createDirectorio($direccionJson);
					// introduce contraseña
					if ($zipFile -> setPassword($pass)) {
						$descompress = $zipFile -> extractTo($direccionJson);
						if ($descompress) {
							// echo "Se descomprimio: $nameZip\n";
							$zipFile -> close();
							if (file_exists($direccionZip)) {
								// echo "Eliminando file: $nameZip\n";
								unlink($direccionZip);
							}
							// es hora de leer la información del archivo
							leerInformacionFiles($direccionJson);
					    eliminarDirectorio($direccionJson);
					    eliminarDirectorio($direccion);
					} else {
						echo "error con la contraseña: $pass";
					}

					} else {

					  $zipFile -> close();
				    echo "error: No se descomprimio :( $nameZip \n";
				    eliminarDirectorio($direccionJson);
				    eliminarDirectorio($direccion);
					}
				} else {
					echo "error al abrir archivo\n";
				}
			} else {
				echo "el archivo no existe\n";
			}
		} else {
			echo "error con el archivo.\n";
		}
	}

	function leerInformacionFiles($direccionJson){
		// echo "$direccionJson\n";
		$files  = scandir($direccionJson);
		$filePath = "";
		// lectura de archivos json del zip
		foreach ($files as $file) {
			if ($file !== "." && $file !== ".." && $file !== "") {
				$filePath = $direccionJson.$file;
				leerArchivoJson($filePath);
			}
		}
	};

	function leerArchivoJson($path){
		// echo "es hora de leer ;)\n";
		$rowFile = "";
		$tabla = 0;
		$tablaEnd = 0;
		$nombreTabla = "";
		$cierre = "";
		$inicio = "";
		$cantCols = 0;
		$posCol = 0;
		$colData = "";
		$cantParms = 0;
		$value = "";
		$posParm = 0;
		$contador = 1;
		$consultaSql = "";
		$bloque = 250;
		$file = fopen($path, "r+");
		while( ! feof($file)){
			$rowFile = fgets($file);
			$rowFile = str_replace("\t", "", $rowFile);
			if ($rowFile !== "") {
				$tabla = substr_count($rowFile, "[");
				// es nombre de tabla?
				if ($tabla > 0) {
					$rowFile = str_replace(" ", "", $rowFile);
					$rowFile = str_replace("\"", "", $rowFile);
					$rowFile = str_replace("[", "", $rowFile);
					$rowFile = str_replace(":","", $rowFile);
					$rowFile = str_replace("{","", $rowFile);
					$rowFile = str_replace("\n","", $rowFile);
					$nombreTabla = $rowFile;
					// echo "$nombreTabla\n";
					$consultaSql .= "INSERT INTO $nombreTabla VALUES ";
				}

				$tablaEnd = substr_count($rowFile, "]");

				if ($tablaEnd > 0) {
					$consultaSql .= ";\n";
					// si queda un residuo trash ;)
					if ($consultaSql !== ";\n") {
						insertarEnBD($consultaSql, ($contador-1), $nombreTabla);
						// echo $consultaSql."\n";

					}
					$contador = 1;
					$consultaSql = "";

				}

				$inicio = substr_count($rowFile, "{");
				$cierre = substr_count($rowFile, "}");

				if ($inicio > 0 && $cierre > 0 ) {
					$rowFile = str_replace("\n", "", $rowFile);
					$rowFile = str_replace("},", "}", $rowFile);
					$rowFile = str_replace("}", "", $rowFile);
					$cantCols = substr_count($rowFile, ",");

					if ($rowFile !== "") {

						if ($contador == ($bloque+1)) {
							$consultaSql .= "INSERT INTO $nombreTabla VALUES \n";
							$contador = 1;
						} 
						
						if ($contador > 1) {
							$consultaSql .= ",\n";
						}

						$consultaSql .= "(";
						for ($j=0; $j < $cantCols+1; $j++) { 
							$colData = $rowFile;
							$posCol = strpos($rowFile, ",");
							if ($posCol) {
								$colData = substr($colData, 0, $posCol+2);
								$rowFile = str_replace($colData, "", $rowFile);
							}
							$cantParms = substr_count($colData, ":");
							for ($k = 0; $k < $cantParms + 1; $k++) { 
								$value = $colData;
								$posParm = strpos($value, ":");
								if ($posParm) {
									$value = substr($value, 0, $posParm+1);
									$colData = str_replace($value, "", $colData);
								} else {
									$value = str_replace(",\"", ",", $value);
									// echo "$value\n";
									$consultaSql .= str_replace("&#44;",",",$value);
								}
							}
						}
						$consultaSql .= ")";
						$contador++; 	
					}

				}
				
				if ($contador == ($bloque+1)) {
					$consultaSql .= ";\n";
					insertarEnBD($consultaSql, $bloque, $nombreTabla);
					// echo $consultaSql."\n";
					$consultaSql = "";
				}

			}
		}

		fclose($file);

	}

	function insertarEnBD($query, $rows, $tabla){
		// echo "$query --> $cantidad\n";
		$usuario = "root";
		$contrasena = "";
		$servidor = "localhost";
		$basededatos = "pruebas_post";
	
		$conexion = mysqli_connect($servidor, $usuario, $contrasena, $basededatos);

		// checar la conexión
		if (mysqli_connect_errno()) {
		    printf("Connect failed: %s\n", mysqli_connect_error());
		    exit();
		}

		// aún esta conectado
		if (mysqli_ping($conexion)) {
				$resultado = mysqli_query($conexion, $query);

				if ($resultado) {
					echo "Consultas realizada con éxito. $rows filas insertadas. Tabla: $tabla.\n";
				} else {
				  echo "\tBloque de consulta no realizada, posiblemente ya tiene un registro del bloque que causa el problema :(. Nombre Tabla: $tabla. Rows: $rows\n";
				}
		} else {
		    printf ("Error: %s\n", mysqli_error($conexion));
		}

		// cerrar la conexión
		mysqli_close($conexion);
	}


	function createDirectorio($ruta){
		if (!is_dir($ruta)) {
		  mkdir($ruta);
		}
	}

	function eliminarDirectorio($direccion){
		// $direccionJson = $direccion."json/";
		$files  = scandir($direccion);

		if (file_exists($direccion)) {
			foreach ($files as $file) {
				if ($file !== "." && $file !== ".." && $file !== "") {
					$filePath = $direccion.$file;
					if (file_exists($filePath)) {
						unlink($filePath);
						// echo "Archivo eliminado: $file\n";
					}
				}
			}
			rmdir($direccion);
			// echo "Directorio eliminado: $direccion\n";
		}

	}
	
?>