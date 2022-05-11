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

function create_connection(){
    connection.connect(function(err){                            //подключение к БД
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else{
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    }); 
};

const request_sql='SELECT * FROM currencylist'
const request_usd='SELECT USD FROM currencylist WHERE IKey=1';

function request_to_DB(request_sql){
    connection.query(request_sql, function(err,results){
        console.log(results[0].USD)
    });
};
//test git hub
create_connection();
request_to_DB(request_sql);