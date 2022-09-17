const { querySql } = require('../db')
const { table } = require('../config')

const getStudent = (grade, Class) => {
  let sql = `select * from ${table.student} `
  if (grade) {
    sql = sql + `where Grade = '${grade}' `
    if (Class) {
      sql = sql + `and Class = '${Class}'`
    }
  }
  return querySql(sql)
}

const getClass = grade => {
  return querySql(
    `select distinct Class from ${table.student} where Grade = '${grade}'`,
  )
}

const getResult = id => {
  return querySql(
    `select Chinese, Math, English, Politics, History, Physical, Chemistry, Biology, Geography, Sport, Composite, Total from ${table.result} where StudentId = '${id}' and TestTime = '1'`,
  )
}

const getPerStudentMessage = id => {
  return querySql(`select * from ${table.student} where StudentId = '${id}]'`)
}

const keywordSearch = keyword => {
  return querySql(
    `select * from ${table.student} where Name like '%${keyword}%'`,
  )
}

const changeInformation = (ID, changeData, type) => {
  return querySql(
    `update ${table.student} set ${type} = '${changeData}' where StudentId = '${ID}'`,
  )
}

const isHaveStudent = ID => {
  return querySql(
    `select COUNT(StudentId) as isHave from ${table.student} where StudentId = '${ID}'`,
  )
}

module.exports = {
  getStudent,
  getClass,
  getResult,
  getPerStudentMessage,
  keywordSearch,
  changeInformation,
  isHaveStudent,
}
