const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'q#9wVp$R6t@Fg2xZ',
    database: 'employee_db'
},
console.log(`Connected to Database`)
);
connection.connect(function(err) {
    if (err) throw err;
    landing();
});

//Inquirer Prompts
function landing() {
    inquirer
        .prompt({
            type: 'list',
            message:'What would you like to do?',
            name: 'choices',
            choices: [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'Add an Employee',
                'Add a Department',
                'Add a Role',
                'Quit',
            ]
        }).then(function(ans) {
            switch (ans.choices) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add an Employee':
                    addAnEmployee();
                    break;
                case 'Add a Department':
                    addADepartment();
                    break;
                case 'Add a Role':
                    addARole();
                    break;
                case 'Quit':
                    quitTracker();
                    break;
            }
        })
};
