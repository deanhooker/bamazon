//requirements
const inquirer = require('inquirer');
const mysql = require('mysql');

//create global array for inquirer options
let itemsAvailable = [];
let itemsAvailableObject = [];

//create mysql connection
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

//returns all products
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

//returns all items with low inventory
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

function getOptions() {

}

function addToInv() {

    connection.query({
        sql: 'SELECT * FROM `bamazon`'
    },
        function (err, res) {

            //create options for inquirer and an array that couples item_id with stock_quantity for update 
            for (var i = 0; i < res.length; i++) {

                itemsAvailable.push(res[i].item_id);
            }

            inquirer.prompt([
                {
                    type: "list",
                    name: "item",
                    message: "Which item would you like to update?",
                    choices: itemsAvailable
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How much more stock?"
                }
            ]).then(function (user) {

                let userQuantity = user.quantity;


                //validate user input is number
                if (isNaN(userQuantity)) {
                    console.log("");
                    console.log("Please enter a number...");
                    console.log("");
                    addToInv();
                }
                else {
                    //query to return current stock for chosen item, then query to update stock
                    connection.query({
                        sql: 'SELECT stock_quantity FROM `bamazon` WHERE `item_id` = ?',
                        timeout: 40000, // 40s
                        values: [user.item]
                    }, function (err, res) {

                        let userQuantityNumber = Number(userQuantity);
                        let newQuantity = res[0].stock_quantity + userQuantityNumber;

                        var query = connection.query(
                            "UPDATE `bamazon` SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: user.item
                                }
                            ]
                        )
                        console.log("\nStock successfully updated!\n");

                        userPrompt();
                    })
                }
            })
        }
    );
}

function addNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "newItem",
            message: "You are creating a new product.\n  Please enter a unique item ID...",
        },
        {
            type: "input",
            name: "newProductName",
            message: "Please enter the product name..."
        },
        {
            type: "input",
            name: "newDepartment",
            message: "Please enter the department this item belongs to...",
        },
        {
            type: "input",
            name: "newPrice",
            message: "Please enter the item's price...",
        },
        {
            type: "input",
            name: "newQuantity",
            message: "How much stock is on hand...",
        }
    ]).then(function (user) {

        connection.query(
            "INSERT INTO bamazon SET ?",
            {
                item_id: user.newItem,
                product_name: user.newProductName,
                department_name: user.newDepartment,
                price: user.newPrice,
                stock_quantity: user.newQuantity
            },
            function (err) {
                if (err) throw err;
                else {
                    console.log("\nItem successfully created!\n");
                    userPrompt();
                }
            }
        )
    })
}