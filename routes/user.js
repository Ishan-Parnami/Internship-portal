import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/userModel.js";
import { Applied } from "../models/Applied.js";
const router = express.Router()

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email })
    if (user) {
        return res.status(409).send("user already existed");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();
    return res.json({ status: true, message: "User Created" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).send("User does not exist");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.json({ message: "Password is incorrect!" })
    }
    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: "3h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 720000 });
    return res.json({ status: true, message: "login successfully" });
});

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ status: false, message: 'Authentication failed' });
        }
        const decode = await jwt.verify(token, process.env.KEY);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
}

router.post('/apply', verifyUser, async (req, res) => {
    try {
        const { opportunity } = req.body;
        const appliedOpportunity = new Applied({
            userId: req.user.username,
            id: opportunity.id,
            profile_name: opportunity.profile_name,
            stipend: opportunity.stipend.salary,
            company_name: opportunity.company_name,
            duration: opportunity.duration,
        });
        await appliedOpportunity.save();
        res.status(201).json({ message: 'Opportunity applied successfully.' });
    } catch (error) {
        console.error('Error applying for opportunity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get("/verify", verifyUser, (req, res) => {
    return res.json({ status: true, message: "Authorized" })
});

router.put('/update-profile', verifyUser, async (req, res) => {
    try {
        const { name, age, dob, image } = req.body;
        const user = await User.findOneAndUpdate(
            { username: req.user.username }, 
            { name, age, dob, image },
            { new: true } 
        );
        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user-details', verifyUser, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/applied-opportunities', verifyUser, async (req, res) => {
    try {
        const appliedOpportunities = await Applied.find({ userId: req.user.username });
        res.json(appliedOpportunities);
    } catch (error) {
        console.error('Error fetching applied opportunities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true, message: 'Logged out Successfully!' })
})
export { router as UserRouter };