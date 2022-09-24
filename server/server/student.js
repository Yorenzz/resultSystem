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
    `select Chinese, Math, English, Politics, History, Physical, Chemistry, Biology, Geography, Sport, Composite, Total from ${table.result} where StudentID = '${id}' and TestTime = '1'`,
  )
}

const getPerStudentMessage = id => {
  return querySql(`select * from ${table.student} where StudentID = '${id}]'`)
}

const keywordSearch = keyword => {
  return querySql(
    `select * from ${table.student} where Name like '%${keyword}%'`,
  )
}

const changeInformation = (ID, changeData, type) => {
  return querySql(
    `update ${table.student} set ${type} = '${changeData}' where StudentID = '${ID}'`,
  )
}

const addInformation = (ID, name, grade, Class) => {
  return querySql(
    `insert into ${table.student} (StudentID, Name, Grade, Class) values (${ID}, '${name}', ${grade}, ${Class})`,
  )
}

const deleteInformation = id => {
  return Promise.all(
    id.map(async item => {
      console.log(item, 'id')
      return (
        await querySql(`delete from ${table.student} where StudentID = ${item}`)
      )[0]
    }),
  )
}

const isHaveStudent = ID => {
  return querySql(
    `select COUNT(StudentID) as isHave from ${table.student} where StudentID = '${ID}'`,
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
  addInformation,
  deleteInformation,
}
