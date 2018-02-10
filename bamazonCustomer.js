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

        let userQuantity = user.quantity;

        if (isNaN(userQuantity)) {
            console.log("");
            console.log("Please enter a number...");
            console.log("");
            userPrompt();
        }
        else {

            connection.query({
                sql: 'SELECT * FROM `bamazon` WHERE `item_id` = ?',
                timeout: 40000, // 40s
                values: [user.item]
            }, function (err, res) {

                let currentStock = res[0].stock_quantity;

                if (currentStock < user.quantity) {

                    console.log("Sorry, not enough stock!!");
                    userPrompt();
                }
                else {
                    updateStock(user.item, user.quantity, currentStock);
                    console.log("");
                    console.log("Total purchase price: " + user.quantity * res[0].price);
                    console.log("");
                    anotherPurchase();
                }
            })
        }
    })
}

function updateStock(item, boughtQuantity, currentStock) {
    
    let newQuantity = currentStock - boughtQuantity;
    console.log("\n" + item);

    var query = connection.query(
        "UPDATE `bamazon` SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: item
            }
        ]
    )
}

function anotherPurchase() {
    inquirer.prompt([

        {
            type: "list",
            name: "action",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function (user) {
        if (user.action === "Yes") {
            userPrompt();
        }
    })
}