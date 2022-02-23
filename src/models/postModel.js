const mongoose = require('mongoose')

const PostSchema  = new mongoose.Schema({
    content: {
        required: true,
        type: String
    },
    author: {
        required: true,
        ref: 'User',
        type: mongoose.Types.ObjectId
    },
    likes: [{
        ref: 'User',
        type: mongoose.Types.ObjectId
    }]
}, {timestamps: true})
 
module.exports = mongoose.model('Post', PostSchema);