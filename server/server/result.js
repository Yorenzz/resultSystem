const { querySql } = require('../db')
const { table, GRADE_SUBJECT } = require('../config')
const time = 1
const getNewTestTime = () => {
  return querySql(`select min(TestTime) as time from ${table.testTime}`)
}

const getResult = (id, testTime = time) => {
  return querySql(
    `select Chinese, Math, English, Politics, History, Physical, Chemistry, Biology, Geography, Sport, Composite, Total from ${table.result} where StudentId = '${id}' and TestTime = '${testTime}'`,
  )
}


const getAdvantage = (grade, Class, testTime = time) => {
  return Promise.all(
    GRADE_SUBJECT[grade].map(async (item) => {
      let sql = `select`
      sql = sql + ` AVG(${item}) as ${item}Adv from ${table.resultDetail} where ${item} is not null and TestTime = ${testTime}`
      Class && (sql = sql + ` and Class = ${Class}`)
      const res = (await querySql(sql))[0]
      return res
    })
  )
}

module.exports = {
    getAdvantage,
    getResult,
    getNewTestTime
}
