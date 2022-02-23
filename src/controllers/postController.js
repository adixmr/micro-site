const Post = require('../models/postModel')
const User = require('../models/userModel')

exports.createPost = async (req, res) => {
    try {
        //add in database
        let {content, id} = req.body
        let post = await Post.create({content, author: id})
        res.send(post)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.likePost = async (req, res) => {
    try {
        //add in database
        await Post.findOneAndUpdate({_id: req.params.id}, {$addToSet: {"likes": req.body.id}})
        await User.findOneAndUpdate({_id: req.body.id}, {$addToSet: {"liked": req.params.id}})
        res.send({message: 'Post liked successfully'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.unlikePost = async (req, res) => {
    try {
        //remove in database
        await Post.findOneAndUpdate({_id: req.params.id}, {$pull: {"likes": req.body.id}})
        await User.findOneAndUpdate({_id: req.body.id}, {$pull: {"liked": req.params.id}})
        res.send({message: 'Post unliked successfully'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getFeed = async (req, res) => {
    try {
        //get type from query string
        let { type } = req.query
        let sort;

        //if the requested type is latest, sort desc by time and if popular, sort desc by likes count
        if(type == 'latest'){
            sort = {'createdAt':-1}
        } else if(type=='popular'){
            sort = {'likes': -1}
        }

        //if limit is not given in query string, set it to 0 (no limit)
        let limit = req.query.limit ?? 0

        //convert the page number to number of items to be skipped
        let skip = req.query.page ? (req.query.page-1)*limit : 0

        let posts = await Post.find({}).sort(sort).limit(limit).skip(skip).populate({path: 'author', select: ['_id', 'username']})
        res.send(posts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getSinglePost = async (req, res) => {
    try {
        //get details of a single post
        let post = await Post.findOne({_id: req.params.id}).populate({path: 'author', select: ['_id', 'username']})
        res.send(post)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}