const jwt = require('jsonwebtoken');

const secret = "#^shatanu&&"
function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileURL: user.profileURL,
        role: user.role
    }

    const token = jwt.sign(payload, secret);
    return token
}

function verifyToken(token) {
    try {
        let decoded = jwt.verify(token, secret)
        return decoded
    } catch (error) {
        console.log(error);
    }

}

module.exports = { verifyToken, createTokenForUser }