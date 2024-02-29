const PostModel = require("../models/post");
const UserModel = require("../models/user");
const axios = require("axios")


const createPost = async (req, res) => {
    const imageURL = req.cloudinary.url ? req.cloudinary.url : null;
    const { authorId, content } = req.body;

    try {
        const user = await UserModel.findById(authorId);

        if (!user) {
            throw 'No User found';
        }

        const payload = {
            text: content
        }
        const response = await axios.post(`http://127.0.0.1:8000/predict`, payload);
        if (!response.data.is_fitness_related) {
            throw "Ony fitness related posts are allowed"
        }

        const newPost = new PostModel({
            author: authorId,
            content,
            picture: imageURL
        });

        const savedPost = await newPost.save();

        user.posts.push(savedPost._id);

        await user.save();

        res.status(201).json({ savedPost, message: 'Post is Created' });

    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

const editPost = async (req, res) => {
    const { content } = req.body;
    try {
        const post = await PostModel.findByIdAndUpdate(req.params.id, { content }, { new: true });

        if (!post) {
            throw 'Post not found';
        }

        res.status(200).json({ post, message: 'Post is Edit' });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

const deletePost = async (req, res) => {
    try {
        const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

        if (!deletedPost) {
            throw "Post not found!";
        }

        const user = await UserModel.findById(deletedPost.author);
        if (user) {
            user.posts.pull(deletedPost._id);
            await user.save();
        }

        res.status(200).json({ deletePost, message: 'Post Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

const getPost = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author', 'username profilePicture');

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

const getPostByID = async (req, res) => {
    try {
        const posts = await PostModel.findById(req.params.id).populate('author', 'profilePicture username');

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

const getPostByFollowing = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);

        if (!user) {
            throw "User not found!"
        }

        const followingUserIds = user.following.map(follower => follower._id);

        const posts = await PostModel.find({ author: { $in: followingUserIds } })
            .populate('author', 'username profilePicture');

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}


const getPostByUserId = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await PostModel.find({ author: user._id });

        if (!posts) {
            throw 'Post not found';
        }

        res.status(200).json({
            message: 'Posts retrieved successfully',
            posts,
        });

    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

module.exports = {
    createPost,
    editPost,
    getPost,
    deletePost,
    getPostByID,
    getPostByFollowing,
    getPostByUserId
};
