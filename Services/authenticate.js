const JWT = require("jsonwebtoken");

const secret = "hhcsxWW&ghcgc457";

function createToken(user){
    const payload = {
        id :user._id,
        _fullname : user.fullName,

    }

    const Token = JWT.sign(payload,secret);
    return Token;
}

function validateToken(Token){
    const payload = JWT.verify(Token,secret);
    return payload
}

module.exports = {createToken,validateToken};