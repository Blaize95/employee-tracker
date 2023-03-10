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
                case 'Update a Role':
                    updateRole();
                    break;
                case 'Quit':
                    quitTracker();
                    break;
            }
        })
};

//Functions for selected prompt
function viewAllEmployees() {
    var query = 'SELECT * FROM employees';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All employees:', res);
        landing();
    })
};

//View all roles
function viewAllRoles() {
    var query = 'SELECT * FROM roles';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All roles:', res);
        landing();
    })
};

//View all departments
function viewAllDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All departments', res);
        landing();
    })
};

//Add employee
function addAnEmployee() {
    connection.query('SELECT * FROM roles', function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: 'first_name',
                    type: 'input',
                    message: "Please enter the employees first name"
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: "Please enter the employees last name"
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: "Please enter the employees manager ID"
                },
                {
                    name: 'roles',
                    type: 'list',
                    choices: function() {
                        var roleArr = [];
                        for (let i = 0; i <res.length; i++) {
                          roleArr.push(res[i].title);
                        }
                        return roleArr;
                    },
                    message: "Please select this employees role"
                }     
        ]).then(function(ans) {
            let role_id;
            for (let i = 0; i < res.length; i++) {
                if (res[i].title == ans.role) {
                    role_id = res[i].id;
                }
            }
            connection.query(
                'INSERT INTO employees SET ?', {
                    first_name: ans.first_name,
                    last_name: ans.last_name,
                    manager_id: ans.manager_id,
                    role_id: role_id,
                },
                function(err) {
                    if (err) throw err;
                    console.log('Employee added to system');
                    landing();
                })
        })
    })
};

//Add a department
function addADepartment() {
    inquirer
        .prompt([{
            name: 'department_name',
            type: 'input',
            message: "Please enter a new department"
        }]).then(function(ans) {
            connection.query(
                'INSERT INTO department SET ?', {
                    department_name: ans.department_name
                });
            let query = 'SELECT * FROM department';
            connection.query(query, function(err, res) {
                if (err) throw err;
                console.log('Department added to system');
                landing();
            })               
        })
};

//Add a role
function addARole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: 'new_role',
                type: 'input',
                message: "Please enter a new role"
            },
            {
                name: 'salary',
                type: 'input',
                message: "Please enter the salary of this role in numbers only"
            },
            {
                name: 'department',
                type: 'input',
                message: "Please enter the department of this role",
                choices: function() {
                    var deptArr = [];
                    for (let i = 0; i < res.length; i++) {
                        deptArr.push(res[i].department_name);
                        }
                        return deptArr;
                    },
                }  
            ]).then(function(ans) {
                let department_id;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].department_name == ans.department) {
                        department_id = res[i].id;
                    }
                }
                connection.query(
                    'INSERT INTO roles SET ?', {
                        title: ans.new_role,
                        salary: ans.salary,
                        department_id: department_id
                    },
                    function(err, res) {
                        if (err) throw err;
                        console.log('Role added to system');
                        landing();
                    })     
                })
            });
};

function updateRole() {
}

function quitTracker() {
    connection.end();
    console.log('Bye!')
}