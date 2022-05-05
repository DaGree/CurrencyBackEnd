//request to DB
const mysql = require('mysql2');
require('dotenv').config()

const connection = mysql.createConnection({             //объявление параметров для подключения к БД
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'tst1',
    password: process.env.DB_PASSWORD
  });
  connection.connect(function(err){                            //подключение к БД
      if (err) {
            return console.error("Ошибка: " + err.message);
      }
      else{
           console.log("Подключение к серверу MySQL успешно установлено");
         }
  }); 