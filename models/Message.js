import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema({
  text: {
    type: String,
    required: true
  }
})

const Message = mongoose.model('Message', messageSchema)

export default Message
