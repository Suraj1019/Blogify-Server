const express = require('express');
const postService = require('../services/post');
const { default: mongoose } = require('mongoose');
const authMiddleware = require('../utilities/auth')
const router = express.Router();

router.get('/', async (req, res, next) => {
   try {
      const posts = await postService.getPosts(req.query.search);
      if (posts) res.status(201).json(posts);
   } catch (error) {
      next(error)
   }
})

router.get('/:id', async (req, res, next) => {
   try {
      const post = await postService.postByPostId(new mongoose.Types.ObjectId(req.params.id));
      if (post) res.status(201).json(post);
   } catch (error) {
      next(error)
   }
})

router.get('/userId/:id', authMiddleware, async (req, res, next) => {
   try {
      const posts = await postService.postByUserId(new mongoose.Types.ObjectId(req.params.id));
      if (posts) res.status(201).json(posts);
   } catch (error) {
      next(error)
   }
})

router.post('/', authMiddleware, async (req, res, next) => {
   try {
      const postData = req.body;
      postData.authorId = new mongoose.Types.ObjectId(postData.authorId)
      const post = await postService.create(postData);
      if (post) res.status(201).json({ message: 'Post created successfully' });
   } catch (error) {
      next(error)
   }
})

router.put('/', authMiddleware, async (req, res, next) => {
   try {
      const { _id, ...postData } = req.body;
      const updatedPost = await postService.update(_id, postData);
      if (updatedPost) res.status(200).json({ message: 'Post updated successfully' });
   } catch (error) {
      next(error)
   }
})

router.put('/updateviews', async (req, res, next) => {
   try {
      const { postId, visitor } = req.body;
      const updatedPost = await postService.updateViews(postId, visitor);
      if (updatedPost) res.status(200).json({ message: 'Views updated successfully' });
   } catch (error) {
      next(error)
   }
})

router.delete('/:postId', authMiddleware, async (req, res, next) => {
   try {
      const deletedPostId = await postService.delete(req.params.postId);
      if (deletedPostId) res.status(200).json({ message: 'Post deleted successfully' });
   } catch (error) {
      next(error)
   }
})

router.put('/comment', async (req, res, next) => {
   try {
      let data = {
         message: req.body.message,
         status: 'pending',
         userId: new mongoose.Types.ObjectId(req.body.userId),
         userName: req.body.userName,
         commentDate: new Date(),
         commentId: new mongoose.Types.ObjectId()
      }
      const updatedPost = await postService.comment(req.body.postId, data);
      if (updatedPost) res.status(200).json({ message: 'Comment added successfully' });
   } catch (error) {
      next(error)
   }
})

router.put('/reply', async (req, res, next) => {
   try {
      const { postId, commentId, message } = req.body;
      const replyDate = new Date()
      const updatedPost = await postService.reply(postId, commentId, message, replyDate);
      if (updatedPost) res.status(200).json({ message: 'Reply added successfully' });
   } catch (error) {
      next(error)
   }
})

router.get('/getcomments/:userId', async (req, res, next) => {
   try {
      const { userId } = req.params;
      const comments = await postService.getComments(userId);
      if (comments) res.status(200).json(comments);
   } catch (error) {
      next(error)
   }
})

router.put('/approve/comment', async (req, res, next) => {
   try {
      const { postId, commentId, status } = req.body;
      const data = await postService.approveComment(postId, commentId, status);
      if (data) res.status(200).json(data);
   } catch (error) {
      next(error)
   }
})
router.put('/delete/comment', async (req, res, next) => {
   try {
      const { postId, commentId } = req.body;
      const data = await postService.deleteComment(postId, commentId);
      if (data) res.status(200).json(data);
   } catch (error) {
      next(error)
   }
})


module.exports = router;