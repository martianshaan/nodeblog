const { Schema } = require('mongoose');
const { randomBytes } = require('node:crypto')

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
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/clipart'
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
    if (!user.isModified('password')) return;

    const salt = randomBytes(256);

})


module.exports = { userSchema }