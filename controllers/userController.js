'use strict'

import * as userController from './userControllerService'

import ErrorResponses from '../constants'
const executer = async (func, req, res, next) => {
	try{
		await func(req, res, next)
	}catch(error){
		const errorResponse = new Error('Internal error')
		errorResponse.statusCode = 500
		next(errorResponse)
	}
}
module.exports.getAllUsers = async (req, res, next) => {
	executer(userController.getAllUsers, req, res, next)
}
module.exports.addUser = async (req, res, next) => {
	executer(userController.addUser, req, res, next)
}
module.exports.getUser = async (req, res, next) => {
	executer(userController.getUser, req, res, next)
}
module.exports.updateUser = async (req, res, next) => {
	executer(userController.updateUser, req, res, next)
}
module.exports.deleteUser = async (req, res, next) => {
	executer(userController.deleteUser, req, res, next)
}