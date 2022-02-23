const mongoose  = require('mongoose')
const bcrypt    = require('bcrypt')

const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        ref: 'User',
        type: mongoose.Types.ObjectId
    }],
    followings: [{
        ref: 'User',
        type: mongoose.Types.ObjectId
    }],
    liked: [{
        ref: 'Post',
        type: mongoose.Types.ObjectId
    }]
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);