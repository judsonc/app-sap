-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 15-Mar-2016 às 14:11
-- Versão do servidor: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `projeto-bolsa`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `laboratorio`
--

CREATE TABLE IF NOT EXISTS `laboratorio` (
  `LAB_ID` int(11) NOT NULL AUTO_INCREMENT,
  `LAB_NOME` text,
  `LAB_IP` text NOT NULL,
  `LAB_DATAENTRADA` text NOT NULL,
  `LAB_LOG` text NOT NULL,
  `LAB_UUID` text NOT NULL,
  PRIMARY KEY (`LAB_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `laboratorio`
--

INSERT INTO `laboratorio` (`LAB_ID`, `LAB_NOME`, `LAB_IP`, `LAB_DATAENTRADA`, `LAB_LOG`, `LAB_UUID`) VALUES
(1, 'LABUF', 'localhost', 'SAD', 'DAS', '');

-- --------------------------------------------------------

--
-- Estrutura da tabela `logluz`
--

CREATE TABLE IF NOT EXISTS `logluz` (
  `LOG_ID` int(11) NOT NULL AUTO_INCREMENT,
  `LOG_IDLUZ` int(11) NOT NULL,
  `LOG_DATA` text NOT NULL,
  `LOG_VALOR` int(11) NOT NULL,
  `LOG_STATUS` int(11) NOT NULL,
  PRIMARY KEY (`LOG_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `logluz`
--

INSERT INTO `logluz` (`LOG_ID`, `LOG_IDLUZ`, `LOG_DATA`, `LOG_VALOR`, `LOG_STATUS`) VALUES
(1, 1, '15-03-2016 13:10:27', 3, 1),
(2, 2, '15-03-2016 13:04:39', 2, 1),
(3, 3, '15-03-2016 12:41:57', 3232, 0),
(4, 4, '15-03-2016 12:42:48', 21, 1),
(5, 5, '15-03-2016 12:42:48', 45, 0),
(6, 6, '15-03-2016 12:42:48', 565, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `logsensor`
--

CREATE TABLE IF NOT EXISTS `logsensor` (
  `LOG_ID` int(11) NOT NULL AUTO_INCREMENT,
  `LOG_IDSENSOR` int(11) NOT NULL,
  `LOG_DATA` text NOT NULL,
  `LOG_VALOR` text NOT NULL,
  PRIMARY KEY (`LOG_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=29 ;

--
-- Extraindo dados da tabela `logsensor`
--

INSERT INTO `logsensor` (`LOG_ID`, `LOG_IDSENSOR`, `LOG_DATA`, `LOG_VALOR`) VALUES
(1, 1, '15-03-2016 13:04:39', '25'),
(2, 2, '15-03-2016 13:04:39', '22'),
(3, 3, '15-03-2016 12:40:55', '53'),
(4, 4, '15-03-2016 12:40:55', '0'),
(5, 5, '15-03-2016 12:40:55', '1'),
(6, 6, '15-03-2016 12:40:55', '0'),
(7, 7, '15-03-2016 12:40:55', '1'),
(8, 8, '15-03-2016 12:40:55', '0'),
(9, 9, '15-03-2016 12:40:55', '1'),
(10, 10, '15-03-2016 12:40:55', '0'),
(11, 11, '15-03-2016 12:40:55', '1'),
(12, 12, '15-03-2016 12:40:55', '0'),
(13, 13, '15-03-2016 12:40:55', '1'),
(14, 14, '15-03-2016 12:40:55', '0'),
(15, 15, '15-03-2016 12:40:55', '1'),
(16, 16, '15-03-2016 12:40:55', '0'),
(17, 17, '15-03-2016 12:40:55', '1'),
(18, 18, '15-03-2016 12:40:56', '0'),
(19, 19, '15-03-2016 12:40:56', '4'),
(20, 20, '15-03-2016 12:40:56', '5'),
(21, 21, '15-03-2016 12:40:56', '0'),
(22, 22, '15-03-2016 12:40:56', '1'),
(23, 23, '15-03-2016 12:40:56', '0'),
(24, 24, '15-03-2016 12:40:56', '1'),
(25, 25, '15-03-2016 12:40:56', '0'),
(26, 26, '15-03-2016 12:40:56', '1'),
(27, 27, '15-03-2016 12:40:56', '22'),
(28, 28, '15-03-2016 12:40:56', '11');

-- --------------------------------------------------------

--
-- Estrutura da tabela `sensor`
--

CREATE TABLE IF NOT EXISTS `sensor` (
  `SEN_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SEN_IDLAB` int(11) NOT NULL,
  `SEN_NOME` text NOT NULL,
  `SEN_TIPO` text NOT NULL,
  `SEN_TEMPOATUALIZA` int(11) NOT NULL,
  `SEN_DATAENTRADA` text NOT NULL,
  `SEN_STATUS` int(11) NOT NULL,
  PRIMARY KEY (`SEN_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Extraindo dados da tabela `sensor`
--

INSERT INTO `sensor` (`SEN_ID`, `SEN_IDLAB`, `SEN_NOME`, `SEN_TIPO`, `SEN_TEMPOATUALIZA`, `SEN_DATAENTRADA`, `SEN_STATUS`) VALUES
(1, 1, 'sensor 1', '33', 20, '33', 1),
(2, 1, 'sensor2', '2', 1, 'sda', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `sessao`
--

CREATE TABLE IF NOT EXISTS `sessao` (
  `SES_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SES_IDLAB` int(11) NOT NULL,
  `SES_UUID` text NOT NULL,
  `SES_DATAENTRADA` text NOT NULL,
  `SES_DATALOG` text NOT NULL,
  `SES_STATUS` int(11) NOT NULL,
  PRIMARY KEY (`SES_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
