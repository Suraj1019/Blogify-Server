const authModel = require('../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

const authService = {};

authService.register = async (userObj) => {
    const user = await authModel.checkUser(userObj.email);
    if (user) {
        let err = new Error('User already exists');
        err.status = 409;
        throw err;
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userObj.password, salt)
    userObj.password = hash;
    const newUser = await authModel.register(userObj);
    if (newUser === null) {
        let err = new Error('Registration Failed');
        err.status = 400;
        throw err;
    }

    return newUser;
}

authService.login = async (email, password) => {
    const user = await authModel.checkUser(email);
    if (user === null) {
        let err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    if (!bcrypt.compareSync(password, user.password)) {
        let err = new Error('Password did not match');
        err.status = 401;
        throw err;
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return { name: user.name, email: user.email, token: token, userId: user._id };
}

module.exports = authService;
