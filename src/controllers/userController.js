const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
    try {
        let {username, password} = req.body
        let user =  await User.create({username, password})

        //don't return the password
        user.password = undefined

        res.send(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.authenticateUser = async (req, res) => {
    try {
        let {username, password} = req.body

        //Throw error if username is not valid
        let user = await User.findOne({username})
        if(!user)  throw Error('Authentication failed')

        //Throw error if password doesn't match
        let match = await user.matchPassword(password)
        if(!match) throw Error('Authentication failed');
        
        //return jwt with _id and username otherwise
        let token = jwt.sign({id: user._id, username}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (error){
        res.status(500).json({ error: error.message })
    }
}

exports.followUser = async (req, res) => {
    try {
        //Throw error if user tries to follow self
        if(req.body.id===req.params.id) throw Error('Cannot follow self')

        //add in database
        await User.findOneAndUpdate({_id: req.body.id}, {$addToSet: {"followings": req.params.id}}, {new: true})
        await User.findOneAndUpdate({_id: req.params.id}, {$addToSet: {"followers": req.body.id}}, {new: true})
        res.send({message: 'User followed successfully'})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.unfollowUser = async (req, res) => {
    try {
        //remove from database
        await User.findOneAndUpdate({_id: req.body.id}, {$pull: {"followings": req.params.id}}, {new: true})
        await User.findOneAndUpdate({_id: req.params.id}, {$pull: {"followers": req.body.id}}, {new: true})
        res.send({message: 'User unfollowed successfully'})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        //select everything except the password
        let user =  await User.find({}).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getFollowers = async (req, res) => {
    try {
        //select only id ans usernames of the followers
        let user =  await User.findOne({username: req.body.username}).populate({path: 'followers', select: ['_id', 'username']})
        res.send(user.followers)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getFollowings = async (req, res) => {
    try {
        //select only id ans usernames of the followings
        let user =  await User.findOne({username: req.body.username}).populate({path: 'followings', select: ['_id', 'username']})
        res.send(user.followings)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

