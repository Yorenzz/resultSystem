const { querySql, querySqlOne } = require('../db')
const { table, GRADE_SUBJECT, GOOD_MAP, TOTAL_GOOD_MAP, PASS_MAP, TOTAL_PASS_MAP } = require('../config')
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
			let sql = 'select'
			sql
        = sql
        + ` round(AVG(${item}),2) as ${item} from ${table.resultDetail} where ${item} is not null and TestTime = ${testTime} and Grade = ${grade}`
			if (Class.length) {
				sql = sql + ' and ('
				Class.map(item => {
					sql = sql + `Class = ${item} or `
					return item
				})
				sql = sql.slice(0, -4) + ')'
			}
			return (await querySql(sql))[0]
		}),
	)
}

const getAdvantageBySubject = (grade, Class, subject, testTime = time) => {
	const sql = `select round(AVG(${subject}, 2) as ${subject} from ${table.resultDetail} where ${subject} is not null and TestTime = ${testTime} and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''})`
	return querySqlOne(sql)
}

const getPerAdvantageByGrade = async (grade, testTime = 1) => {
	const perClass = await getClass(grade)
	return Promise.all(
		perClass.map(perClass => {
			return Promise.all(
				GRADE_SUBJECT[grade].map(async item => {
					let sql = 'select'
					sql
            = sql
            + ` round(AVG(${item}),2) as ${item} from ${table.resultDetail} where ${item} is not null and TestTime = ${testTime} and Grade = ${grade} and Class = ${perClass.Class}`
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

// 原有人数、实考人数、最高分、最低分
const getInitialNumber = (grade, Class, testTime = time) => {
	const sql = `select count(*) as num from ${table.resultDetail} where Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`
	return querySqlOne(sql)
}

const getActualNumber = (grade, Class, subject, testTime = time) => {
	const sql = `select count(*) as num from ${table.resultDetail} where Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and ${subject} is not null and TestTime = ${testTime}`
	return querySqlOne(sql)
}

const getEstScore = (flag, grade, Class, subject, testTime = time) => {
	const est = flag === 'high' ? 'MAX' : 'MIN'
	const sql = `select ${est}(${subject}) as num from ${table.resultDetail} where Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and ${subject} is not null and TestTime = ${testTime}`
	// console.log(sql)
  	return querySqlOne(sql)
}

const getGoodNum = (grade, Class, subject, testTime = time) => {
	let sql = ''
	if (subject === 'Total') {
		sql = `select count(${subject}) as num from ${table.resultDetail} where ${subject}>${TOTAL_GOOD_MAP[grade]} and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`
	} else {
		sql = `select count(${subject}) as num from ${table.resultDetail} where ${subject}>${GOOD_MAP[subject]} and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`
	}
	console.log(sql, grade, Class, subject)
	return querySqlOne(sql)
}

const getPassNum = (grade, Class, subject, testTime = time) => {
	let sql = ''
	if (subject === 'Total') {
		sql = `select count(${subject}) as num from ${table.resultDetail} where ${subject}>${TOTAL_PASS_MAP[grade]} and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`
	} else {
		sql = `select count(${subject}) as num from ${table.resultDetail} where ${subject}>${PASS_MAP[subject]} and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`
	}
	console.log(sql, grade, Class, subject)
	return querySqlOne(sql)
}

const getScoreRange = (range, grade, Class, subject, testTime = time) => {
	const sql = `select count(${subject}) as num from ${table.resultDetail} 
								where ${subject}>=${range.min} and ${subject}<=${range.max}
								and Grade = ${grade} ${Class ? `and Class = ${Class}` : ''} and TestTime = ${testTime}`

	return querySqlOne(sql)
}

module.exports = {
	getAdvantage,
	getResult,
	getNewTestTime,
	getPerAdvantageByGrade,
	getResultRank,
	insertStudentResult,
	getInitialNumber,
	getActualNumber,
	getAdvantageBySubject,
	getEstScore,
	getGoodNum,
	getPassNum,
	getScoreRange,
}
