--
-- Estructura de las tablas 
--

CREATE TABLE `tabla1` (
  `usuario` int(11) NOT NULL,
  `proyecto` int(11) NOT NULL,
  `col3` int(11) DEFAULT NULL,
  `col4` int(11) DEFAULT NULL,
  `col5` int(11) DEFAULT NULL,
  `col6` int(11) DEFAULT NULL,
  `col7` int(11) DEFAULT NULL,
  `col8` int(11) DEFAULT NULL,
  `col9` int(11) DEFAULT NULL,
  `col10` int(11) DEFAULT NULL,
  `col11` int(11) DEFAULT NULL,
  `col12` int(11) DEFAULT NULL,
  `col13` int(11) DEFAULT NULL,
  `col14` int(11) DEFAULT NULL,
  `col15` int(11) DEFAULT NULL,
  `col16` varchar(300) DEFAULT NULL,
  `col17` varchar(300) DEFAULT NULL,
  `col18` varchar(300) DEFAULT NULL,
  `col19` varchar(300) DEFAULT NULL,
  `col20` varchar(300) DEFAULT NULL,
  `col21` varchar(300) DEFAULT NULL,
  `col22` varchar(300) DEFAULT NULL,
  `col23` varchar(300) DEFAULT NULL,
  `col24` varchar(300) DEFAULT NULL,
  `col25` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tabla2` (
  `usuario` int(11) NOT NULL,
  `proyecto` int(11) NOT NULL,
  `col3` int(11) DEFAULT NULL,
  `col4` int(11) DEFAULT NULL,
  `col5` int(11) DEFAULT NULL,
  `col6` int(11) DEFAULT NULL,
  `col7` int(11) DEFAULT NULL,
  `col8` int(11) DEFAULT NULL,
  `col9` int(11) DEFAULT NULL,
  `col10` int(11) DEFAULT NULL,
  `col11` int(11) DEFAULT NULL,
  `col12` int(11) DEFAULT NULL,
  `col13` int(11) DEFAULT NULL,
  `col14` int(11) DEFAULT NULL,
  `col15` int(11) DEFAULT NULL,
  `col16` varchar(300) DEFAULT NULL,
  `col17` varchar(300) DEFAULT NULL,
  `col18` varchar(300) DEFAULT NULL,
  `col19` varchar(300) DEFAULT NULL,
  `col20` varchar(300) DEFAULT NULL,
  `col21` varchar(300) DEFAULT NULL,
  `col22` varchar(300) DEFAULT NULL,
  `col23` varchar(300) DEFAULT NULL,
  `col24` varchar(300) DEFAULT NULL,
  `col25` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tabla3` (
  `usuario` int(11) NOT NULL,
  `proyecto` int(11) NOT NULL,
  `col3` int(11) DEFAULT NULL,
  `col4` int(11) DEFAULT NULL,
  `col5` int(11) DEFAULT NULL,
  `col6` int(11) DEFAULT NULL,
  `col7` int(11) DEFAULT NULL,
  `col8` int(11) DEFAULT NULL,
  `col9` int(11) DEFAULT NULL,
  `col10` int(11) DEFAULT NULL,
  `col11` int(11) DEFAULT NULL,
  `col12` int(11) DEFAULT NULL,
  `col13` int(11) DEFAULT NULL,
  `col14` int(11) DEFAULT NULL,
  `col15` int(11) DEFAULT NULL,
  `col16` varchar(300) DEFAULT NULL,
  `col17` varchar(300) DEFAULT NULL,
  `col18` varchar(300) DEFAULT NULL,
  `col19` varchar(300) DEFAULT NULL,
  `col20` varchar(300) DEFAULT NULL,
  `col21` varchar(300) DEFAULT NULL,
  `col22` varchar(300) DEFAULT NULL,
  `col23` varchar(300) DEFAULT NULL,
  `col24` varchar(300) DEFAULT NULL,
  `col25` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indices de las tablas
--
ALTER TABLE `tabla1`
  ADD PRIMARY KEY (`usuario`,`proyecto`);

ALTER TABLE `tabla2`
  ADD PRIMARY KEY (`usuario`,`proyecto`);

ALTER TABLE `tabla3`
  ADD PRIMARY KEY (`usuario`,`proyecto`);