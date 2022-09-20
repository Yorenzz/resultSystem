const { querySql } = require('../db')
const { table, GRADE_SUBJECT, SUBJECT_TRANSLATE } = require('../config')
const { getClass } = require('../server/student')
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
    GRADE_SUBJECT[grade].map(async item => {
      let sql = `select`
      sql =
        sql +
        ` AVG(${item}) as ${item} from ${table.resultDetail} where ${item} is not null and TestTime = ${testTime} and Grade = ${grade}`
      // Class && (sql = sql + ` and Class = ${Class}`)
      if (Class.length) {
        sql = sql + ` and (`
        Class.map(item => {
          sql = sql + `Class = ${item} or `
        })
        sql = sql.slice(0, -4) + ')'
      }
      return (await querySql(sql))[0]
    }),
  )
}

const getPerAdvantageByGrade = async (grade, testTime = 1) => {
  console.log('grade', grade)
  const perClass = await getClass(grade)
  return Promise.all(
    perClass.map(perClass => {
      return Promise.all(
        GRADE_SUBJECT[grade].map(async item => {
          let sql = `select`
          sql =
            sql +
            ` AVG(${item}) as ${item} from ${table.resultDetail} where ${item} is not null and TestTime = ${testTime} and Grade = ${grade} and Class = ${perClass.Class}`
          console.log(sql)
          return (await querySql(sql))[0]
        }),
      )
    }),
  )
}

module.exports = {
  getAdvantage,
  getResult,
  getNewTestTime,
  getPerAdvantageByGrade,
}
