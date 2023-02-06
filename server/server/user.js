const { querySql } = require('../db')
const { table } = require('../config')

const Login = (username, password) => {
	return querySql(`select * from admin_user where username='${username}' and password='${password}'`)
}

const Register = async (username, password) => {
	return querySql(`insert into \`${table.users}\` (username, password, role) values ('${username}', '${password}', 'visitor')`)
}

const isHaveUsername = (username) => {
	return querySql(`select COUNT(username) as isHave from ${table.users} where username = '${username}'`)
}

module.exports = {
	Login,
	Register,
	isHaveUsername,
}
