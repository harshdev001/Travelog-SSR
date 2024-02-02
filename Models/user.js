const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const {createToken, validateToken} = require("../Services/authenticate.js");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profile_photoURL: {
        type: String,
        default: '/images/download.jpeg'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.statics.matchPasswordandGenerateToken = async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
        // User not found
        throw new Error('Invalid username or password');
    }

    const hashedPassword = createHmac('sha256', user.salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== user.password) {
        // Incorrect password
        throw new Error('Invalid username or password');
    }
    
    const Token = createToken(user);
    return Token ;
    
};

const UserModel = model("User", userSchema);

module.exports = UserModel;
