const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String
	},
	email: {
		type: String,
		unique: true
	},
	city: {
		type: String
	}
});
userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ user: this._id }, next);
});
const User = mongoose.model('User', userSchema);

export default User;