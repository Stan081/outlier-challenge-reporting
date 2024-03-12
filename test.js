const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})

tape('Get student detail using their Id', async function (t) {
  const studentId = 1
  const url = `${endpoint}/student/${studentId}`
  try {
    const { data, response } = await jsonist.get(url)
    t.equal(response.statusCode, 200, 'Endpoint accessed successfully')
    t.ok(data, 'Student record gotten successfully')
    t.equal(data.studentDetails.id, 1, 'Returned Student has correct Id')
    t.end()
  } catch (error) {
    t.fail('Error getting student by Id: ' + error.message)
  }
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
