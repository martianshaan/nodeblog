const { Schema, model } = require('mongoose');
const { randomBytes, createHmac } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    profileImageURL: {
        type: String,
        default: '/images/clipart.png'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'

    }
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = randomBytes(16).toString();
        const hashedPassword = createHmac('sha256', salt)
            .update(user.password)
            .digest('hex');
        console.log(hashedPassword);

        this.salt = salt
        this.password = hashedPassword;

        next();
    } catch (error) {
        return next(error)
    }
})

userSchema.static('verifyPasswordandGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const hashedPassword = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== user.password) throw new Error('Invalid password');

    const token = createTokenForUser(user);
    return token


    // return { ...user.toObject(), password: undefined, salt: undefined };
});

const User = model('User', userSchema)

module.exports = { User }