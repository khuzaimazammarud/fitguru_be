const CommentModel = require('../models/comment');
const PostModel = require("../models/post");

const createComment = async (req, res) => {
    try {

        const { authorId, content, postId } = req.body;

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = new CommentModel({
            author: authorId,
            content,
            postId,
        });

        await newComment.save();

        post.comments.push(newComment._id);
        await post.save();

        const populatedComment = await CommentModel.findById(newComment._id).populate('author', 'username');

        res.status(201).json({
            message: 'Comment created successfully',
            comment: newComment,
            user: populatedComment.author.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }
}

const getComment = async (req, res) => {

    try {

        const post = await PostModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const populatedComments = await Promise.all(
            post.comments.map(async (commentId) => await CommentModel.findById(commentId).populate('author', 'username'))
        );

        res.status(200).json({
            message: 'Comments retrieved successfully',
            comments: populatedComments ? populatedComments : post.comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }

}

module.exports = { createComment, getComment };
