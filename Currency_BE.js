console.log("Start BackEnd");
const https  = require('https');
const rDate = new Date(Date.now());
const mysql = require('mysql2');  //подключение библиотеки для работы с БД
require('dotenv').config();

endpoint = 'live';
access_key=process.env.ACCESS_KEY;

const connection = mysql.createConnection({             //объявление параметров для подключения к БД
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'tst1',
    password: process.env.DB_PASSWORD
});

connection.connect(function(err){                            //подключение к БД
    if (err) return console.error("Ошибка: " + err.message);
      else console.log("Подключение к серверу MySQL успешно установлено");
}); 

function get_date(nDate){
    year = nDate.getFullYear();
    mth = nDate.getMonth()+1;
    day = nDate.getDate();
    if (mth<10) mth = ['0'] + mth; 
    if (day<10) day = ['0'] + day; 
    newDate=year + '-' + mth + '-' + day;
    console.log(newDate);
    return newDate;
};

var num;
var USD='USD', EUR='EUR', JPY='JPY', CNY='CNY', GBP='GBP', RUB='RUB';
var USD_at, EUR_at, JPY_at, CNY_at, GBP_at;
var date = get_date(rDate);

function DB_create(){
    const sql_create = 'CREATE TABLE IF NOT EXISTS tst1.CurrencyList (DData VARCHAR(10) NULL,USD DOUBLE NULL,EUR DOUBLE NULL,JPY DOUBLE NULL,CNY DOUBLE NULL,GBP DOUBLE NULL)'
    connection.query(sql_create,
        //function(err,results){console.log("Добавлена запись в БД под номером ")}
    ); 
}
function DB_insert(USD_atk, EUR_atk, JPY_atk, CNY_atk, GBP_atk, date){
    const sql2='INSERT INTO tst1.currencylist (DData, USD, EUR, JPY, CNY,GBP) VALUES (?, ?, ?, ?, ?, ?)'
    const par =[date ,USD_atk, EUR_atk, JPY_atk, CNY_atk, GBP_atk];
    connection.query(sql2,par,
        function(err,results){console.log("Запись в БД добавлена")}
    ); 
};

//DB_create();
//DB_insert();

function currency(date,fromCurrency,toCurrency,callback, apiKey){
    var rate;
    date =encodeURIComponent(date);
    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    var query = fromCurrency + '_' + toCurrency;  
    var url = 'https://free.currconv.com/api/v7/convert?q=' + query + '&compact=ultra&date=' + date + '&apiKey=' + apiKey;
    console.log('Request to API. Limit 50 per 3 hours');
    https.get(url, function(res){
        var body = '';
  
        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){ 
            var jsonObj = JSON.parse(body);
            var val = jsonObj[query];
            val=JSON.stringify(val);
            var a = val.indexOf(':')+1;
            var b = val.indexOf('}')-1;
            val = val.slice(a,b);  
            var total = val * 1;
            rate = Math.round(total * 100) / 100;
            console.log(fromCurrency+' '+rate);
            num = parseFloat(rate)
            callback(fromCurrency);
        }); 
    }).on('error', function(e){
          console.log("Got an error: ", e);
          cb(e);
        }
    );

}

function output(Valuta){
    DB_create();
    switch(Valuta){
        case USD: USD_at=num; currency(date, EUR, RUB,output, access_key); break;
        case EUR: EUR_at=num; currency(date, JPY, RUB,output, access_key); break;
        case JPY: JPY_at=num; currency(date, CNY, RUB,output, access_key); break;
        case CNY: CNY_at=num; currency(date, GBP, RUB,output, access_key); break;
        case GBP: GBP_at=num; console.log(USD_at, EUR_at, JPY_at, CNY_at, GBP_at); DB_insert(USD_at, EUR_at, JPY_at, CNY_at, GBP_at, date); break;
    }
};

currency(date, USD, RUB,output, access_key);
