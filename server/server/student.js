const { querySql } = require('../db')
const { table } = require('../config')

const getStudent = () => {
    return querySql(`select * from ${table.student}`)
}

module.exports = {
	getStudent
}