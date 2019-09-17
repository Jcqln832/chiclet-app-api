process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '3h'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://postgres@localhost/chiclet-auth-test"


const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest

//As you progress with libraries such as chai, 
//you might want to install plugins that add features to chai
// add that here!