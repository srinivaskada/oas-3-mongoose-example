import mongoose from 'mongoose'
import User from './User'
import Message from './Message'

mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)

const connectDb = () => {
  return mongoose.connect(
    'mongodb://localhost:27017/node-express-mongodb-server'
  )
}
connectDb()
const models = { User, Message }

export { connectDb }

export default models
