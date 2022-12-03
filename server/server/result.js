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
          // console.log(sql)
          return (await querySql(sql))[0]
        }),
      )
    }),
  )
}

const getResultRank = (grade, Class, subject) => {
  console.log(grade, Class, subject)
  if (Class) {
    return querySql(
      `SELECT ${subject}, StudentID, Class, Name, rank() over (ORDER BY ${subject} DESC) t_rank FROM ${table.resultDetail} where Grade = ${grade} and Class = ${Class} and ${subject} is not null ORDER BY '${subject}' DESC`,
    )
  } else {
    return querySql(
      `SELECT ${subject}, StudentID, Class, Name, rank() over (ORDER BY ${subject} DESC) t_rank FROM ${table.resultDetail} where Grade = ${grade} and ${subject} is not null ORDER BY '${subject}' DESC`,
    )
  }
}

const insertStudentResult = data => {
  let sql = `insert into \`${table.result}\` (StudentID, Chinese, Math, English, Politics, History, Physical, Chemistry, Biology, Geography, Sport, Composite, Total, TestTime) values `
  const insertData = data.map(item => {
    if ((item.StudentID + '').length < 4) {
      item.StudentID < 10 && (item.StudentID = '0' + item.StudentID)
      item.StudentID = '' + item.Grade + item.Class + item.StudentID
    }
    item.TestTime = time
    sql += `(${item.StudentID}, ${item.Chinese || null}, ${
      item.Math || null
    }, ${item.English || null}, ${item.Politics || null}, ${
      item.History || null
    }, ${item.Physical || null}, ${item.Chemistry || null}, ${
      item.Biology || null
    }, ${item.Geography || null}, ${item.Sport || null}, ${
      item.Composite || null
    }, ${item.Total || null}, ${item.TestTime || null}), `
    return item
  })
  return querySql(sql.slice(0, -2))
}

module.exports = {
  getAdvantage,
  getResult,
  getNewTestTime,
  getPerAdvantageByGrade,
  getResultRank,
  insertStudentResult,
}
