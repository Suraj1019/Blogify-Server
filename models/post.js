const { default: mongoose } = require('mongoose');
const dbModel = require('../utilities/connection');
const postModel = {}

postModel.checkPost = async (postId) => {
    const model = await dbModel.getPostCollection();
    const post = model.findById(postId);
    if (post) return post;
    return null;
}

postModel.getPosts = async (search) => {
    const model = await dbModel.getPostCollection();
    const posts = await model.find({
        draft: false,
        $or: [
            { categories: { $regex: `^${search}`, $options: 'i' } },
            { tags: { $regex: `^${search}`, $options: 'i' } }
        ]
    }).sort({ publishDate: -1 });

    if (posts && posts.length > 0) {
        const uniquePosts = [...new Map(posts.map(post => [post._id.toString(), post])).values()];
        return uniquePosts;
    }

    return [];
}


postModel.postByPostId = async (id) => {
    const model = await dbModel.getPostCollection();
    const post = model.findOne({ _id: id });
    if (post) return post;
    return null;
}

postModel.postByUserId = async (id) => {
    const model = await dbModel.getPostCollection();
    const post = model.find({ authorId: id });
    if (post) return post;
    return null;
}

postModel.create = async (postObj) => {
    const model = await dbModel.getPostCollection();
    const post = model.create(postObj);
    if (post) return post;
    return null;
}

postModel.update = async (postId, postObj) => {
    const model = await dbModel.getPostCollection();
    const post = await model.findByIdAndUpdate(postId, {
        $set: {
            title: postObj.title,
            content: postObj.content,
            categories: postObj.categories,
            publishDate: postObj.publishDate,
            tags: postObj.tags,
            media: postObj.media,
            draft: postObj.draft
        }
    }, { new: true });
    if (post) return post;
    return null;
}

postModel.updateViews = async (postId, visitor) => {
    const model = await dbModel.getPostCollection();
    let post;
    if (visitor) {
        post = await model.findByIdAndUpdate(postId, { $inc: { views: 1 }, $addToSet: { visitors: new mongoose.Types.ObjectId(visitor) } }, { new: true });
    } else {
        post = await model.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });
    }
    if (post) return post;
    return null;
}

postModel.delete = async (postId) => {
    const model = await dbModel.getPostCollection();
    const post = await model.findByIdAndDelete(postId);
    if (post) return postId;
    return null;
}

postModel.comment = async (postId, data) => {
    const model = await dbModel.getPostCollection();
    const post = await model.findByIdAndUpdate(postId, { $push: { comments: { ...data } } });
    if (post) return postId;
    return null;
}

postModel.reply = async (postId, commentId, message, replyDate) => {
    const model = await dbModel.getPostCollection();
    const post = await model.updateOne(
        {
            _id: new mongoose.Types.ObjectId(postId),
            comments: { $elemMatch: { commentId: new mongoose.Types.ObjectId(commentId) } }
        },
        {
            $push: {
                'comments.$.replies': { message: message, replyDate: replyDate },
            }
        }
    );

    if (post.modifiedCount > 0) return postId;
    return null;
};

postModel.getComments = async (userId) => {
    const model = await dbModel.getPostCollection();
    const comments = await model.aggregate(
        [
            { $match: { authorId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: '$comments' },
            { $match: { 'comments.status': 'pending' } },
            { $addFields: { 'comments.postId': '$_id', 'comments.postTitle': '$title' } },
            { $project: { comments: 1 } },
            {
                $replaceRoot: {
                    newRoot: '$comments'
                }
            }
        ]
    )

    return comments;
};

postModel.approveComment = async (postId, commentId, status) => {
    const model = await dbModel.getPostCollection();
    const post = await model.updateOne(
        {
            _id: new mongoose.Types.ObjectId(postId),
            comments: { $elemMatch: { commentId: new mongoose.Types.ObjectId(commentId) } }
        },
        {
            $set: {
                'comments.$.status': status
            }
        }
    );

    if (post.modifiedCount > 0) return postId;
    return null;
};

postModel.deleteComment = async (postId, commentId, status) => {
    const model = await dbModel.getPostCollection();
    const post = await model.updateOne(
        {
            _id: new mongoose.Types.ObjectId(postId),
        },
        {
            $pull: { comments: { commentId: new mongoose.Types.ObjectId(commentId) } }

        }
    );

    if (post.modifiedCount > 0) return postId;
    return null;
};

module.exports = postModel;