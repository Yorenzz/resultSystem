const { querySql } = require('../db')
const { table } = require('../config')

const Login = (username, password) => {
	return querySql(`select * from admin_user where username='${username}' and password='${password}'`)
}

const Register = (username, password) => {
	return querySql(`insert into \`${table.users}\` (username, password, role) values ('${username}', '${password}', 'visitor')`)
}

module.exports = {
	Login,
	Register
}
