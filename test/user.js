//During the test the env variable is set to test
import 'babel-polyfill'

process.env.NODE_ENV = 'test'

import mongoose from 'mongoose'
import models, { connectDb } from '../models'
//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')
let should = chai.should()


chai.use(chaiHttp)
//Our parent block
describe('Users', () => {
	beforeEach(async (done) => { //Before each test we empty the database
		await models.User.remove()
		done()
	})
	/**
	 * Sample test
	 */
	describe('/Get Sample', () => {
		it('it should get sample info', (done) => {
			chai.request(server)
				.get('/info')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.info.should.be.a('string')
					done()
				})
		})
	})
	describe('/Get Sample', () => {
		it('it should get sample info', (done) => {
			chai.request(server)
				.get('/docs')
				.end((err, res) => {
					res.should.have.status(200)
					done()
				})
		})
	})
/*
  * Test the /GET route
  */
  describe('/GET all Users', () => {
		beforeEach(async (done) => { //Before each test we empty the database
			await connectDb()
			await models.User.remove()
			done()
    })
		it('it should GET empty users', (done) => {
			chai.request(server)
				.get('/v1/user/')
				.end((err, res) => {
					res.should.have.status(201)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('Users not found.')
					done()
				})
		})
		it('it should GET all the users', async (done) => {
			await new models.User({
				username: 'srinivas',
				email: 'srinivas625@krify.net'
			}).save()
			chai.request(server)
				.get('/v1/user/')
				.end((err, res) => {
							res.should.have.status(200)
							res.body.status.should.be.a('object')
							res.body.status.code.should.be.equals(0)
							res.body.users.should.be.a('array')
							res.body.users.length.should.be.equals(1)
							let user = res.body.users[0]
							user.should.be.a('object')
							user.username.should.be.a('string')
							user.username.should.be.equals('srinivas')
					done()
				})
		})
	})
	/**
	 * Test User add
	 */
	describe('/POST user', () => {
		beforeEach(async (done) => {
			await models.User.remove({})
			done()
		})
		it('it should add a new user',  (done) => {
			chai.request(server)
				.post('/v1/user/')
				.send({
					email: 'srinivas625.4u@gmail.com',
					username: 'srinivas625'
				})
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.id.should.be.a('string')
					res.body.id.length.should.not.equals(0)
					done()
				})
		})
		it('it should reject adding a new user',  async (done) => {
			await new models.User({
				email: 'srinivas625.4u@gmail.com',
				username: 'srinivas625'
			}).save()
			chai.request(server)
				.post('/v1/user/')
				.send({
					email: 'srinivas625.4u@gmail.com',
					username: 'srinivas625'
				})
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('User with same email already exists')
					done()
				})
		})
	})
	describe('/Get single User', () => {
		let newUser
		beforeEach(async (done) => {
			await models.User.remove({})
			newUser=await new models.User({
				username: 'srinivas',
				email: 'srinivaskada@krify.net'
			}).save()
			done()
		})
		it('It should get a user', (done) => {
			chai.request(server)
				.get('/v1/user/'+newUser._id.toString())
				.end((err, res) => {
					res.should.have.status(200)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(0)
					done()
				})
		})
		it('It should fail to get a user', async (done) => {
			await newUser.remove()
			chai.request(server)
				.get('/v1/user/'+newUser._id.toString())
				.end((err, res) => {
					res.should.have.status(404)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('User not found')
					done()
				})
		})
		it('It should fail to get a user with internal error', async (done) => {
			let randomId='SRINIVAS625'
			chai.request(server)
				.get(`/v1/user/${randomId}`)
				.end((err, res) => {
					res.should.have.status(500)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('Internal error')
					done()
				})
		})
	})
	describe('/Update User', () => {
		let newUser
		beforeEach(async (done) => { //Before each test we empty the database
			await models.User.remove()
			newUser=await new models.User({
				username: 'srinivas',
				email: 'srinivaskada@krify.net'
			}).save()
			done()
    })
		it('it should Update a user', (done) => {
			chai.request(server)
				.put('/v1/user/'+newUser._id.toString())
				.send({username: 'updated-srinivas'})
				.end((err, res) => {
					res.should.have.status(200)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(0)
					chai.request(server)
						.get('/v1/user/'+newUser._id.toString())
						.end((err, res) => {
							res.should.have.status(200)
							res.body.status.should.be.a('object')
							res.body.status.code.should.be.equals(0)
							res.body.user.should.be.a('object')
							let user = res.body.user
							user.username.should.be.equals('updated-srinivas')
							done()
						})
				})
		})
		it('it should should fail to update user', async (done) => {
			await newUser.remove({})
			chai.request(server)
				.put(`/v1/user/${newUser._id.toString()}`)
				.send({username: 'updated-srinivas'})
				.end((err, res) => {
					res.should.have.status(404)
					res.body.should.be.a('object')
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					done()
				})
		})
		it('It should fail to get a user with internal error', async (done) => {
			let randomId='SRINIVAS625'
			chai.request(server)
				.put(`/v1/user/${randomId}`)
				.send({username: 'updated-srinivas'})
				.end((err, res) => {
					res.should.have.status(500)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('Internal error')
					done()
				})
		})
	})
	describe('/Delete user', () => {
		let newUser
		beforeEach(async (done) => {
			newUser = await new models.User({
				username: 'srinivas',
				email: 'srinivas625.4u@gmail.com'
			}).save()
			done()
		})
		it('It should delete the user', (done) => {
			chai.request(server)
				.delete(`/v1/user/${newUser._id.toString()}`)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(0)
					done()
				})
		})
		it('it should should fail to delete the user', async (done) => {
			await newUser.remove({})
			chai.request(server)
				.delete(`/v1/user/${newUser._id.toString()}`)
				.send({username: 'updated-srinivas'})
				.end((err, res) => {
					res.should.have.status(404)
					res.body.should.be.a('object')
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					done()
				})
		})
		it('It should fail to get a user with internal error', async (done) => {
			let randomId='SRINIVAS625'
			chai.request(server)
				.delete(`/v1/user/${randomId}`)
				.end((err, res) => {
					res.should.have.status(500)
					res.body.status.should.be.a('object')
					res.body.status.code.should.be.equals(1)
					res.body.status.message.should.be.a('string')
					res.body.status.message.should.be.equals('Internal error')
					done()
				})
		})
	})
})