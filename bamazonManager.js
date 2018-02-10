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
    userPrompt();
});

function userPrompt() {
    inquirer.prompt([

        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (user) {

        switch (user.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                addToInv();
                break;
            case "Add New Product":
                addNew();
                break;
        }
    })
}

function viewProducts() {
    connection.query({
        sql: 'SELECT * FROM `bamazon`'
    },
        function (err, res) {
            console.log('\nAll Products:');
            for (var i = 0; i < res.length; i++) {

                console.log("item_id: " + res[i].item_id + " | product_name: " + res[i].product_name + " | department_name: " + res[i].department_name + " | price: " + res[i].price + " | stock_quantity: " + res[i].stock_quantity);
            }
            console.log(' ');
            userPrompt();
        }
    );
}

function viewLowInv() {
    connection.query({
        sql: "SELECT * FROM bamazon HAVING stock_quantity < 100"
    },
        function (err, res) {
            
            console.log("\nLow Inventory:");
            for (var i = 0; i < res.length; i++) {
                
                console.log("item_id: " + res[i].item_id + " | stock_quantity: " + res[i].stock_quantity);
            }
            console.log(' ');
            userPrompt();
        }
    );
}