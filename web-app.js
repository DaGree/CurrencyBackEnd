//web-app
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

port=process.env.PORT;

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

const request_sql='SELECT * FROM currencylist';
const request_usd='SELECT USD FROM currencylist WHERE IKey=1';
const request_all_usd='SELECT IKey, USD FROM currencylist';

function request_to_DB(request_sql){
    connection.query(request_sql, function(err,results){
        console.log(results[0].USD)
    });
};

create_connection();

app.use(express.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
//request_to_DB(request_usd);
app.listen(port, () => console.log(`WEB_APP working on port ${port}!`));

app.post('/request_db',function(req,res){
    const request_db = req.body.request_db;
    var answer;
    connection.query(request_sql, function(err,results){
        answer=results;
        console.log(answer);
        res.json(
            {
                message: answer
            }
        )
    });
});

app.post('/url', function(req, res) {
    const url = req.body.url;
    var mes="MESSAGE";

    res.json(
        {
            message: mes
        }
    )
});