import mongoose from 'mongoose';
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
import User from './User';
import Message from './Message';

const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27017/node-express-mongodb-server');
};
connectDb()
const models = { User, Message };

export { connectDb };

export default models;