const express = require('express');
const authService = require('../services/auth')
const router = express.Router();

router.post('/signup', async (req, res, next) => {
   try {
      const user = await authService.register(req.body);
      if (user) res.status(201).json({ message: "User created successfully" });
   } catch (error) {
      next(error)
   }
})

router.post('/login', async (req, res, next) => {
   try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      if (user) res.status(200).json(user);
   } catch (error) {
      next(error)
   }
})

module.exports = router;