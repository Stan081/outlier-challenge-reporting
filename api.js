const knex = require('./db')
const gradesData = require('./json_data/course-grades-data.json')
const { calculateCourseStats } = require('./util/services.js')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {
  try {
    const id = req.params.id
    const studentDetails = await knex('students').where({ id }).first()
    res.json({ studentDetails })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student record: ' + error.message })
  }
}

async function getStudentGradesReport (req, res, next) {
  const id = parseInt(req.params.id)
  try {
    const studentDetails = await knex('students').where({ id }).first()
    res.json({
      studentDetails: studentDetails,
      studentGrades: gradesData.filter(grade => grade.id === id)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student record: ' + error.message })
  }
}

async function getCourseGradesReport (req, res, next) {
  try {
    res.json({
      courseGradesReport: await calculateCourseStats(gradesData)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student record: ' + error.message })
  }
}
