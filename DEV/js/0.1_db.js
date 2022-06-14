'use strict';

function getDatabase(){
	return openDatabase('JsonQZip','1.0','Almacenamiento de prueba de información.', 1000000);
}

function cargarTablas(){
	const db = getDatabase();
	return new Promise(function(resolve, reject){
		db.transaction( function(tx){
			tx.executeSql(`
				CREATE TABLE IF NOT EXISTS tabla1 (
					usuario int(11),
					proyecto int(11),
					col3 int(11),
					col4 int(11),
					col5 int(11),
					col6 int(11),
					col7 int(11),
					col8 int(11),
					col9 int(11),
					col10 int(11),
					col11 int(11),
					col12 int(11),
					col13 int(11),
					col14 int(11),
					col15 int(11),
					col16 varchar(300),
					col17 varchar(300),
					col18 varchar(300),
					col19 varchar(300),
					col20 varchar(300),
					col21 varchar(300),
					col22 varchar(300),
					col23 varchar(300),
					col24 varchar(300),
					col25 varchar(300),
					PRIMARY KEY (usuario, proyecto)
				);
			`);

			tx.executeSql(`
				CREATE TABLE IF NOT EXISTS tabla2 (
					usuario int(11),
					proyecto int(11),
					col3 int(11),
					col4 int(11),
					col5 int(11),
					col6 int(11),
					col7 int(11),
					col8 int(11),
					col9 int(11),
					col10 int(11),
					col11 int(11),
					col12 int(11),
					col13 int(11),
					col14 int(11),
					col15 int(11),
					col16 varchar(300),
					col17 varchar(300),
					col18 varchar(300),
					col19 varchar(300),
					col20 varchar(300),
					col21 varchar(300),
					col22 varchar(300),
					col23 varchar(300),
					col24 varchar(300),
					col25 varchar(300),
					PRIMARY KEY (usuario, proyecto)
				);
			`);

			tx.executeSql(`
				CREATE TABLE IF NOT EXISTS tabla3 (
					usuario int(11),
					proyecto int(11),
					col3 int(11),
					col4 int(11),
					col5 int(11),
					col6 int(11),
					col7 int(11),
					col8 int(11),
					col9 int(11),
					col10 int(11),
					col11 int(11),
					col12 int(11),
					col13 int(11),
					col14 int(11),
					col15 int(11),
					col16 varchar(300),
					col17 varchar(300),
					col18 varchar(300),
					col19 varchar(300),
					col20 varchar(300),
					col21 varchar(300),
					col22 varchar(300),
					col23 varchar(300),
					col24 varchar(300),
					col25 varchar(300),
					PRIMARY KEY (usuario, proyecto)
				);
			`);

		},function(err){
			console.error("00-> %s",err.message)
		}, function(){
			resolve()
		})
	})
}