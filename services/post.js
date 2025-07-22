const postModel = require('../models/post');

const postService = {};

postService.getPosts = async (search) => {
    return await postModel.getPosts(search);
}

postService.postByPostId = async (id) => {
    const post = await postModel.postByPostId(id);
    if (post === null) {
        let err = new Error('Post not found');
        err.status = 404;
        throw err;
    }

    return post;
}

postService.postByUserId = async (id) => {
    const posts = await postModel.postByUserId(id);
    if (posts === null) {
        let err = new Error('No posts found for this user');
        err.status = 404;
        throw err;
    }

    return posts;
}

postService.create = async (postObj) => {
    if (!postObj || !postObj.title || !postObj.content) {
        let err = new Error('Bad Request: Missing required fields');
        err.status = 400;
        throw err;
    }

    const post = await postModel.create(postObj);
    if (post === null) {
        let err = new Error('Failed creating post');
        err.status = 500;
        throw err;
    }

    return post;
}

postService.update = async (postId, postObj) => {
    const post = await postModel.checkPost(postId);

    if (!post) {
        let err = new Error("Post not found");
        err.status = 404;
        throw err;
    }

    const updatedPost = await postModel.update(postId, postObj);
    if (updatedPost === null) {
        let err = new Error('Failed updating post');
        err.status = 500;
        throw err;
    }

    return updatedPost;
}

postService.updateViews = async (postId, visitor) => {


    const updatedPost = await postModel.updateViews(postId, visitor);
    if (updatedPost === null) {
        let err = new Error('Failed updating views');
        err.status = 500;
        throw err;
    }

    return updatedPost;
}

postService.update = async (postId, postObj) => {
    const post = await postModel.checkPost(postId);

    if (!post) {
        let err = new Error("Post not found");
        err.status = 404;
        throw err;
    }

    const updatedPost = await postModel.update(postId, postObj);
    if (updatedPost === null) {
        let err = new Error('Failed updating post');
        err.status = 500;
        throw err;
    }

    return updatedPost;
}

postService.delete = async (postId) => {
    const post = await postModel.checkPost(postId);

    if (!post) {
        let err = new Error("Post not found");
        err.status = 404;
        throw err;
    }

    const deletedPostId = await postModel.delete(postId);
    if (deletedPostId === null) {
        let err = new Error('Failed deleting post');
        err.status = 500;
        throw err;
    }

    return { message: "Post deleted successfully", postId: deletedPostId };
}

postService.comment = async (postId, data) => {
    const updatedPost = await postModel.comment(postId, data);
    if (updatedPost === null) {
        let err = new Error('Failed comment');
        err.status = 500;
        throw err;
    }

    return updatedPost;
}

postService.reply = async (postId, commentId, message, replyDate) => {
    const updatedPost = await postModel.reply(postId, commentId, message, replyDate);
    if (updatedPost === null) {
        let err = new Error('Failed reply');
        err.status = 500;
        throw err;
    }

    return updatedPost;
}

postService.getComments = async (userId) => {
    const comments = await postModel.getComments(userId);
    if (comments === null) {
        let err = new Error('Failed fetching comments');
        err.status = 500;
        throw err;
    }

    return comments;
}

postService.approveComment = async (postId, commentId, status) => {
    const data = await postModel.approveComment(postId, commentId, status);
    if (data === null) {
        let err = new Error('Failed fetching comments');
        err.status = 500;
        throw err;
    }

    return data;
}

postService.deleteComment = async (postId, commentId) => {
    const data = await postModel.deleteComment(postId, commentId);
    if (data === null) {
        let err = new Error('Failed deleting comments');
        err.status = 500;
        throw err;
    }

    return data;
}

module.exports = postService;
