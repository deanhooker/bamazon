const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();
});

function displayProducts() {
    connection.query({
        sql: 'SELECT * FROM `bamazon`'
    },
        function (err, res) {
            console.log(' ');
            for (var i = 0; i < res.length; i++) {
                console.log('');
                console.log(res[i].item_id);
                console.log(res[i].product_name);
                console.log(res[i].price);
            }
            console.log(' ');
            // userPrompt();
        }
    );
}