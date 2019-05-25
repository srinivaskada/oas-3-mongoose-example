//During the test the env variable is set to test
import 'babel-polyfill'

process.env.NODE_ENV = 'test'

import mongoose from 'mongoose'
import models, { connectDb } from '../models'
//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()


chai.use(chaiHttp)
//Our parent block
describe('Users', () => {
	beforeEach(async () => { //Before each test we empty the database
		await models.User.remove()
	})
	/**
	 * Sample test
	 */
	describe('/Get Sample', () => {
		it('it should get sample info', async () => {
			const res = await chai.request(server).get('/info')
			res.should.have.status(200)
			res.body.should.be.a('object')
			res.body.info.should.be.a('string')
		})
	})
	describe('/Get Docs', () => {
		it('it should get sample info', async () => {
			const res = await chai.request(server).get('/docs')
			res.should.have.status(200)
		})
	})
/*
  * Test the /GET route
  */
  describe('/GET all Users', () => {
		beforeEach(async () => { //Before each test we empty the database
			await models.User.remove()
    })
		it('it should GET empty users', async () => {
			const res = await chai.request(server).get('/v1/user/')
			res.should.have.status(201)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(1)
			res.body.status.message.should.be.a('string')
			res.body.status.message.should.be.equals('Users not found.')
		})
		it('it should GET all the users', async () => {
			await new models.User({
				username: 'srinivas',
				email: 'srinivas625@krify.net'
			}).save()
			const res = await chai.request(server).get('/v1/user/')
			res.should.have.status(200)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(0)
			res.body.users.should.be.a('array')
			res.body.users.length.should.be.equals(1)
			let user = res.body.users[0]
			user.should.be.a('object')
			user.username.should.be.a('string')
			user.username.should.be.equals('srinivas')
		})
	})
	/**
	 * Test User add
	 */
	describe('/POST user', () => {
		beforeEach(async () => {
			await models.User.remove({})
		})
		it('it should add a new user',  async () => {
			const res = await chai.request(server).post('/v1/user/').send({
				email: 'srinivas625.4u@gmail.com',
				username: 'srinivas625'
			})
			res.should.have.status(200)
			res.body.should.be.a('object')
			res.body.id.should.be.a('string')
			res.body.id.length.should.not.equals(0)
		})
		it('it should reject adding a new user',  async () => {
			await new models.User({
				email: 'srinivas625.4u@gmail.com',
				username: 'srinivas625'
			}).save()
			try{
				const res = await chai.request(server).post('/v1/user/').send({
					email: 'srinivas625.4u@gmail.com',
					username: 'srinivas625'
				})
			}catch({response: res}){
				res.should.have.status(400)
				res.body.should.be.a('object')
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
				res.body.status.message.should.be.a('string')
				res.body.status.message.should.be.equals('User with same email already exists')
			}
		})
	})
	describe('/Get single User', () => {
		let newUser
		beforeEach(async () => {
			await models.User.remove({})
			newUser=await new models.User({
				username: 'srinivas',
				email: 'srinivaskada@krify.net'
			}).save()
		})
		it('It should get a user', async () => {
			const res = await chai.request(server).get('/v1/user/'+newUser._id.toString())
			res.should.have.status(200)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(0)
		})
		it('It should fail to get a user', async () => {
			await newUser.remove()
			try{
				const res = await chai.request(server).get('/v1/user/'+newUser._id.toString())
			}catch({response: res}){
				res.should.have.status(404)
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
				res.body.status.message.should.be.a('string')
				res.body.status.message.should.be.equals('User not found')
			}
		})
		it('It should fail to get a user with internal error', async () => {
			let randomId='SRINIVAS625'
			try{
				const res = await chai.request(server).get(`/v1/user/${randomId}`)
			}catch({response: res}){
				res.should.have.status(500)
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
				res.body.status.message.should.be.a('string')
				res.body.status.message.should.be.equals('Internal error')
			}
		})
	})
	describe('/Update User', () => {
		let newUser
		beforeEach(async () => { //Before each test we empty the database
			await models.User.remove()
			newUser=await new models.User({
				username: 'srinivas',
				email: 'srinivaskada@krify.net'
			}).save()
    })
		it('it should Update a user', async () => {
			let res = await chai.request(server).put('/v1/user/'+newUser._id.toString()).send({username: 'updated-srinivas'})
			res.should.have.status(200)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(0)
			res = await chai.request(server).get('/v1/user/'+newUser._id.toString())
			res.should.have.status(200)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(0)
			res.body.user.should.be.a('object')
			let user = res.body.user
			user.username.should.be.equals('updated-srinivas')
		})
		it('it should should fail to update user', async () => {
			await newUser.remove({})
			try{
				const res = await chai.request(server).put(`/v1/user/${newUser._id.toString()}`).send({username: 'updated-srinivas'})
			}catch({response: res}){
				res.should.have.status(404)
				res.body.should.be.a('object')
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
			}
		})
		it('It should fail to get a user with internal error', async () => {
			let randomId='SRINIVAS625'
			try{
				const res = await chai.request(server).put(`/v1/user/${randomId}`).send({username: 'updated-srinivas'})
			}catch({response: res}){
				res.should.have.status(500)
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
				res.body.status.message.should.be.a('string')
				res.body.status.message.should.be.equals('Internal error')
			}
		})
	})
	describe('/Delete user', () => {
		let newUser
		beforeEach(async () => {
			newUser = await new models.User({
				username: 'srinivas',
				email: 'srinivas625.4u@gmail.com'
			}).save()
		})
		it('It should delete the user', async () => {
			const res = await chai.request(server).delete(`/v1/user/${newUser._id.toString()}`)
			res.should.have.status(200)
			res.body.status.should.be.a('object')
			res.body.status.code.should.be.equals(0)
		})
		it('it should should fail to delete the user', async () => {
			await newUser.remove({})
			try{
				const res = await chai.request(server).delete(`/v1/user/${newUser._id.toString()}`).send({username: 'updated-srinivas'})
			}catch({response: res}){
				res.should.have.status(404)
				res.body.should.be.a('object')
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
			}
		})
		it('It should fail to get a user with internal error', async () => {
			let randomId='SRINIVAS625'
			try{
				const res = await chai.request(server).delete(`/v1/user/${randomId}`)
			}catch({response: res}){
				res.should.have.status(500)
				res.body.status.should.be.a('object')
				res.body.status.code.should.be.equals(1)
				res.body.status.message.should.be.a('string')
				res.body.status.message.should.be.equals('Internal error')
			}
		})
	})
})