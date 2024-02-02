const { Router } = require("express");
const UserModel = require("../Models/user");
const { validateToken } = require("../Services/authenticate");

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin",{
        navbar : "/images/logo.png",
    });
});

router.get("/signup", (req, res) => {
    return res.render("signup",
    {
        navbar : "/images/logo.png"
    });
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await UserModel.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/user/signin");
    } catch (error) {
        console.error("Error signing up:", error.message);
        return res.render("signup.ejs",{message : " user already exists"});
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const Token = await UserModel.matchPasswordandGenerateToken(email, password);
        const user = validateToken(Token);
        console.log("Authenticated User:", user);
        return res.cookie("token",Token).redirect("/");
    } catch (error) {
        console.error("Error signing in:", error.message);
        return res.status(401).render("signin", { message: error.message,
            navbar : "/images/logo.png" });
    }
});

router.get("/logout",(req, res) => {
    return res.clearCookie("token").redirect("/");
});

module.exports = router;
