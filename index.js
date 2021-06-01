const inquirer = require('inquirer');
const mysql = require('mysql');
const env =require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your username
    user: process.env.DB_USER,
    // Be sure to update with your own MySQL password!
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect((err) => {
    if (err) throw err;
    init();
  });
  
    
      
  // await connection.query(`SELECT * FROM Department`, (err, res) => {
  //   if (err){ console.log(err);}
  //   for(let i =0; i < res.length; i++){
  //     departments.push({
  //       name: res[i].name,
  //       value: res[i].id
  //     });
  //   }
  // });
  //var departments = [];
function init() {
    console.log(" -------------------------------\n | Welcome to Employee Manager!|\n -------------------------------\n ");

   inquirer.prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Employee List",
        "Add Employee",
        "Update Employee",
        "Delete Employee",
        "Department List",
        "Add Department",
        "Update a Department",
        "Delete a Department",
        "List Roles",
        "Add Role",
        "Update a Role",
        "Delete a Role",
        "Exit"
      ],
    }).then((answer) => {
      switch (answer.action) {
      case "Employee List":
        listEmployees();
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee":
        updateEmployee();
        break;

      case "Delete Employee":
        deleteEmployee();
        break;

      case "Department List":
        listDepartments();
        break;

      case "Add Department":
        addDepartment();
        break;

      case "Update a Department":
        updateDepartment();
        break;
  
      case "Delete a Department":
        deleteDepartment();
        break;

      case "List Roles":
        listRoles();
        break;

      case "Add Role":
        addRole();
        break;

      case "Update a Role":
        updateRole();
        break;

      case "Delete a Role":
        deleteRole();
        break;
      
      case "Exit":
        exit();
        break;

      default:
        console.log(`Error!! Not an option: ${answer.action}`);
        connection.end();
        break;
      }
    });
  }

const listEmployees =()=>{
  const query = 'SELECT * FROM Employee';
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        
        init();
        });
    };
  
  const addEmployee = async () =>{
    var roles =[];
    var managers = [];
    await connection.query(`SELECT * FROM Role`, (err, res) => {
      if (err){ console.log(err);}
      for(let i =0; i < res.length; i++){
        roles.push({
          name: res[i].title,
          value: res[i].id
        });
      }
    });

    await connection.query(`SELECT * FROM Employee WHERE isManager = 1`, (err, res) => {
      if (err){ console.log(err);}
      for(let i =0; i < res.length; i++){
        managers.push({
          name: res[i].first_name + " " + res[i].last_name,
          value: res[i].id
        });
      }
      managers.push({
        name: "None",
        value: null
      })
    });

    inquirer.prompt([
      {
      name: 'firstName',
      type: 'input',
      message: "Please enter the new employee's first name" 
    },
    {
      name: 'lastName',
      type: 'input',
      message: "Please enter the new employee's last name" 
    },
    {
      name: 'role',
      type: 'list',
      message: "Please select the new employee's role",
      choices: roles
    },
    {
      name: 'isManager',
      type: 'confirm',
      message: "Is this employee a manager?"
    },
    {
      name: 'manager',
      type: 'list',
      message: "Please select your employee's manager",
      choices: managers
    }
  ]).then((answers) =>{
    connection.query('INSERT INTO Employee SET ?',
    {
      first_name: answers.firstName, 
      last_name: answers.lastName, 
      role_id: answers.role, 
      manager_id: answers.manager,
      isManager: answers.isManager
    }, (err, res) => {
      if (err) {console.log(err);}
      console.log(`New Employee ${answers.first_name} ${answers.last_name} added!`);
      init();
      });
    });
  }

  const updateEmployee = async () =>{
    var roles =[];
    var managers = [];

    await connection.query(`SELECT * FROM Role`, (err, res) => {
      if (err){ console.log(err);}
      for(let i =0; i < res.length; i++){
        roles.push({
          name: res[i].title,
          value: res[i].id
        });
      }
    });

    await connection.query(`SELECT * FROM Employee WHERE isManager = 1`, (err, res) => {
      if (err){ console.log(err);}
      for(let i =0; i < res.length; i++){
        managers.push({
          name: res[i].first_name + " " + res[i].last_name,
          value: res[i].id
        });
      }
      managers.push({
        name: "None",
        value: null
      })
    });

 

  await inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: "Please enter the employee's first name" 
      },
      {
        name: 'lastName',
        type: 'input',
        message: "Please enter the employee's last name" 
      },
      {
        name: 'newFirstName',
        type: 'input',
        message: "Type in employee's updated first name"
      },
      {
        name: 'newLastName',
        type: 'input',
        message: "Type in employee's updated last name" 
      },
      {
        name: 'newRole',
        type: 'list',
        message: "Select the employee's updated role",
        choices: roles
      },
      {
        name: 'newManager',
        type: 'list',
        message: "Select the employee's updated Manager",
        choices: managers
      },
      {
        name: 'isManager',
        type: 'confirm',
        message: "Is this employee a manager?"
      }
    ]).then((ans) =>{
          const query = `UPDATE Employee SET ? WHERE first_name = "${ans.firstName}" AND last_name = "${ans.lastName}"`;
          connection.query(query, 
            {
            first_name: ans.newFirstName,
            last_name: ans.newLastName,
            role_id: ans.newRole,
            manager_id: ans.newManager,
            isManager: ans.isManager
            }, 
            (err, res) => {
            if (err) throw err;
            console.log("Updated Employee!");
            init();
            });
          });
      }

const deleteEmployee = async () =>{
  var people = [];

  await connection.query('SELECT employee.id , employee.first_name , employee.last_name , role.title FROM employee LEFT JOIN role ON Employee.role_id = Role.id', (err, res) => {
    if (err){ console.log(err);}
    for(let i=0; i<res.length; i++){
      people.push({
        name: res[i].first_name +" " + res[i].last_name + " Role:" + res[i].title ,
        value: res[i].id
      });
    }
    people.push({
      name: "None",
      value: null
    });
    });
    inquirer.prompt([
      {
        name: 'delete',
        type: 'confirm',
        message: "Are you sure you want to delete an employee?"
      }
    ]).then((res)=>{
      if(res.delete === false){
        return init();
      }
    
    inquirer.prompt([
      {
        name: 'terminate',
        type: 'list',
        message: "Select the employee you wish to delete",
        choices: people
      },
    ]).then((answer)=>{
      if(answer.terminate === null){
        console.log("Changed your mind did you?");
       return init();
      }
      connection.query(`DELETE FROM Employee WHERE id = ${answer.terminate}`, (err, res) => {
        if (err) throw err;
        console.log("User Deleted!");
      });
      init()
    });
  });
}

const listDepartments= () =>{
  const query = 'SELECT * FROM Department';
      connection.query(query, (err, res) => {
        if (err) {console.log(err);}
        console.log("\n");
        console.table(res);
        return init();
  });
}

const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'departmentQuery',
      type: 'confirm',
      message: "Would you like to add a department?"
    }
  ]).then((res)=> {
    if(res.departmentQuery === false){
      return init();
    }
    
    inquirer.prompt([
      {
        name: 'departmentName',
        type: 'input',
        message: "What is the new department's name?"
      }
    ]).then((ans)=>{
      connection.query('INSERT INTO Department SET ?',
    {
      name: ans.departmentName, 
    }, (err, res) => {
      if (err) {console.log(err);}
      console.log(`New Department ${ans.departmentName} added!`);
      init();
      });
    });
  });
}

const updateDepartment = async () =>{
  var departments = [];
 await connection.query('SELECT * FROM Department', (err, res) => {
    if (err) {console.log(err);}
    for(let i=0; i<res.length; i++){
      departments.push({
        name: res[i].name ,
        value: res[i].id
      })
    }
    departments.push({
      name: 'None',
      value: null
    });
  });

 inquirer.prompt([
    {
      name: 'updateQuery',
      type: 'confirm',
      message: "Would you like to update a department name?"
    },
  ]).then((ans)=>{
    if(ans.updateQuery === false){
      return init();
    }

    inquirer.prompt([
      {
        name: 'choice',
        type: 'list',
        message: "Which department would you like to update?",
        choices: departments
      },
      {
        name: 'newName',
        type: 'input',
        message: "What's the new department name?"
      }
    ]).then((answer)=>{
      const query = `UPDATE Department SET ? WHERE id = "${answer.choice}"`;
      connection.query(query, 
        {
        name: answer.newName
        }, 
        (err, res) => {
        if (err) {console.log(err);}
        console.log("Updated Department!");
        init();
    });

  });
});
}

const deleteDepartment = async () =>{
  var departments = [];
  await connection.query('SELECT * FROM Department', (err, res) => {
     if (err) {console.log(err);}
     for(let i=0; i<res.length; i++){
       departments.push({
         name: res[i].name ,
         value: res[i].id
       })
     }
     departments.push({
       name: 'None',
       value: null
     });
   });
 
  inquirer.prompt([
     {
       name: 'deleteQuery',
       type: 'confirm',
       message: "Would you like to delete a department?"
     },
   ]).then((ans)=>{
     if(ans.deleteQuery === false){
       return init();
     }
 
     inquirer.prompt([
       {
         name: 'choice',
         type: 'list',
         message: "Which department would you like to delete?",
         choices: departments
       }
      ]).then((ans)=>{
        connection.query(`DELETE FROM Department WHERE id = ${ans.choice}`, (err, res) => {
          if (err) throw err;
          console.log("Department Deleted!");
        });
        init()
      });
    });
}

const listRoles = () =>{
  const query = 'SELECT * FROM Role';
  connection.query(query, (err, res) => {
    if (err) {console.log(err);}
    console.log("\n");
    console.table(res);
    return init();
});
}

const addRole = async () =>{
  var departments = [];
  await connection.query('SELECT * FROM Department', (err, res) => {
     if (err) {console.log(err);}
     for(let i=0; i<res.length; i++){
       departments.push({
         name: res[i].name ,
         value: res[i].id
       })
     }
     departments.push({
       name: 'None',
       value: null
     });
   });
  inquirer.prompt([
    {
      name: 'roleQuery',
      type: 'confirm',
      message: "Would you like to add a role?"
    }
  ]).then((res)=> {
    if(res.roleQuery === false){
      return init();
    }
    
    inquirer.prompt([
      {
        name: 'roletTitle',
        type: 'input',
        message: "What is the new role's title?"
      },
      {
        name: 'roleSalary',
        type: 'number',
        message: "What is the role's salary (numbers only)?"
      },
      {
        name: 'roleDepartment',
        type: 'list',
        message: "Which department does this role belong to?",
        choices: departments
      }
    ]).then((ans)=>{
      connection.query('INSERT INTO Role SET ?',
    {
      title: ans.roletTitle,
      salary: ans.roleSalary,
      department_id: ans.roleDepartment
    }, (err, res) => {
      if (err) {return console.log(err);}
      console.log(`New Role ${ans.roletTitle} added!`);
      init();
      });
    });
  });
}

const updateRole = async () =>{
  var departments = [];
  var roles = [];
  await connection.query('SELECT * FROM Department', (err, res) => {
     if (err) {console.log(err);}
     for(let i=0; i<res.length; i++){
       departments.push({
         name: res[i].name ,
         value: res[i].id
       })
     }
     departments.push({
       name: 'None',
       value: null
     });
   });

  await connection.query('SELECT * FROM Role', (err, res) => {
    if (err) {return console.log(err);}
    for(let i = 0; i<res.length;i++){
      roles.push({
        name: res[i].title + " Salary:" + res[i].salary,
        value: res[i].id
      })
    }
});
 
  inquirer.prompt([
     {
       name: 'updateQuery',
       type: 'confirm',
       message: "Would you like to update a role?"
     },
   ]).then((ans)=>{
     if(ans.updateQuery === false){
       return init();
     }
 
     inquirer.prompt([
       {
         name: 'choice',
         type: 'list',
         message: "Which role would you like to update?",
         choices: roles
       },
       {
         name: 'newTitle',
         type: 'input',
         message: "What's the new role name?"
       },
       {
         name: 'newSalary',
         type: 'number',
         message: "Enter the role's new salary. (Numbers only)"
       },
       {
         name: 'newDepartment',
         type: 'list',
         message: "What department does this role belong to?",
         choices: departments
       }
     ]).then((answer)=>{
       const query = `UPDATE Role SET ? WHERE id = "${answer.choice}"`;
       connection.query(query, 
         {
         title: answer.newTitle ,
         salary: answer.newSalary ,
         department_id: answer.newDepartment
         }, 
         (err, res) => {
         if (err) {return console.log(err);}
         console.log("Updated Role!");
         init();
     });
 
   });
 });
}

const deleteRole = async () =>{
  var roles = [];
  await connection.query('SELECT * FROM Role', (err, res) => {
    if (err) {return console.log(err);}
    for(let i = 0; i<res.length;i++){
      roles.push({
        name: res[i].title + " Salary:" + res[i].salary,
        value: res[i].id
      })
    }
});

inquirer.prompt([
  {
    name: 'deleteQuery',
    type: 'confirm',
    message: "Would you like to delete a role?"
  },
]).then((ans)=>{
  if(ans.deleteQuery === false){
    return init();
  }

  inquirer.prompt([
    {
      name: 'choice',
      type: 'list',
      message: "Which role would you like to delete?",
      choices: roles
    }
   ]).then((ans)=>{
     connection.query(`DELETE FROM Role WHERE id = ${ans.choice}`, (err, res) => {
       if (err) {return console.log(err);}
       console.log("Role Deleted!");
     });
     init()
   });
 });
}

const exit = () => {
  connection.end();
  return;
  }


