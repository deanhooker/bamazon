const inquirer = require('inquirer');
const mysql = require('mysql');

let itemsAvailable = [];

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

                itemsAvailable.push(res[i].item_id);
            }
            console.log(' ');
            userPrompt();
        }
    );
}

function userPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "item",
            message: "Which item would you like to purchase?",
            choices: itemsAvailable
        },
        {
            type: "input",
            name: "quantity",
            message: "How many would you like to buy?"
        }
    ]).then(function (user) {
        console.log(user.item + " " + user.quantity);
    })
}