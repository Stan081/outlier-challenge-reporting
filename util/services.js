const axios = require('axios')
const fs = require('fs').promises
const path = require('path')

const gradesUrl = 'https://outlier-coding-test-data.onrender.com/grades.json'
const FOLDER = 'json_data'
const FILE = 'course-grades-data.json'

module.exports = {
    generateGradesFile,
    calculateCourseStats
}

async function calculateCourseStats(courseGradesData) {
    const statistics = {}
    courseGradesData.forEach(({ course, grade }) => {
        if (!statistics[course]) {
            statistics[course] = {
                highestGrade: 0,
                lowestGrade: 0,
                totalGrades: 0,
                count: 0
            }
        }
        const courseStats = statistics[course]
        courseStats.highestGrade = Math.max(courseStats.highestGrade, grade)
        courseStats.lowestGrade = Math.min(courseStats.lowestGrade, grade)
        courseStats.totalGrades += grade
        courseStats.count++
    })

    Object.keys(statistics).forEach(course => {
        const courseStats = statistics[course]
        courseStats.averageGrade = courseStats.totalGrades / courseStats.count
        delete courseStats.totalGrades
        delete courseStats.count
    })
    return statistics
}

async function generateGradesFile() {
    try {
        const filePath = path.join(FOLDER, FILE)
        try {
            return JSON.parse(await fs.readFile(filePath, 'utf8'))
        } catch (readError) {
            const gradesData = await getStudentsGradesData()
            try {
                await fs.mkdir(FOLDER, { recursive: true })
                await fs.writeFile(filePath, JSON.stringify(gradesData, null, 2), 'utf8')
                console.log('Grades data successfully downloaded')
            } catch (writeError) {
                console.error(`Error creating file ${filePath}:`, writeError)
            }
        }
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`)
    }
}

async function getStudentsGradesData() {
    try {
        const response = await axios.get(gradesUrl)
        const jsonData = response.data
        return jsonData
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`)
    }
}