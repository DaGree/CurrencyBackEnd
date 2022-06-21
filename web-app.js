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
        dataArray = {
            dateTime:[results[0].IKey,results[1].IKey,results[2].IKey,results[3].IKey,results[4].IKey],
            usdValue : ['USD',  results[0].USD,  results[1].USD , results[2].USD, results[3].USD, results[4].USD],
            eurValue: ['EUR', results[0].EUR,  results[1].EUR , results[2].EUR, results[3].EUR, results[4].EUR],
            jpyValue: ['JPY', results[0].JPY,  results[1].JPY , results[2].JPY, results[3].JPY, results[4].JPY],
            cnyValue: ['CNY', results[0].CNY,  results[1].CNY , results[2].CNY, results[3].CNY, results[4].CNY],
            gbpValue: ['GBP', results[0].GBP,  results[1].GBP, results[2].GBP, results[3].GBP, results[4].GBP],
          }
       // anser_json=results.json
        console.log(answer);
        //console.log(typeof(answer));
        //console.log(answer);
        res.json(
            {
                message: dataArray
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