const fs = require('fs')
const request = require('request')

const { generateGradesFile } = require('./util/services')

request('https://outlier-coding-test-data.onrender.com/students.db').pipe(fs.createWriteStream('students.db'))
console.log('Fetching students.db...')

generateGradesFile()