const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "FITGURUAPI"

const signup = async (req, res) => {
    const {username, email, password, confirmPassword, gender, age, weight, height} = req.body;
    try {

        const existingUser = await userModel.findOne({email : email});
        if(existingUser) {
            return res.status(400).json({message : "User already exist"});
        }

        if(password !== confirmPassword) {
            return res.status(400).json({message : "Password doesnot matches"});
        }

        const hashedPassword  = await bcrypt.hash(password, 10);

        const result = await userModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            gender: gender,
            age: parseInt(age),
            weight: parseFloat(weight),
            height: parseFloat(height)

        });

        const token = jwt.sign({email : result.email, id: result._id}, SECRET_KEY);
        res.status(201).json({user : result, token: token, message: 'Account is Created'});

    } catch(error) {
        res.status(500).json({message: "something went wrong"});
    }
}

const signin =async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await userModel.findOne({email : email});
        if(!existingUser) {
            return res.status(404).json({message : "invalid username or passowrd"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword) {
            return res.status(404).json({message : "invalid username or passowrd"});
        }

        const token = jwt.sign({email : existingUser.email, id: existingUser._id}, SECRET_KEY);
        res.status(200).json({user : existingUser, token: token, message: "Login successfull"});

    }catch(error) {
        console.log("🚀 ~ file: userController.js:47 ~ signin ~ error:", error)
        res.status(500).json({message: "something went wrong"});
    }
}

module.exports = {signup, signin}