import user from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

import { registerSchema, loginSchema } from "../validations/userValidation.js"; 

export const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body); 
        if (error) {
            return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
        }

        const {username, email, password} = req.body ; 
        const userExist = await user.findOne({email}); 
        if (userExist) {
            return res.status(400).json({ message: "User with this email already exists" });
        } 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 
        const newUser = new user({ username, email, password: hashedPassword }); 
        await newUser.save(); 
        // Inside your register try block, after newUser.save()
       const token = jwt.sign({ id: newUser._id,email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(201).json({ 
    message: "User registered successfully", 
    token, // Send this so frontend can log them in
    user: { id: newUser._id, username: newUser.username, email: newUser.email }
});
    }
    catch(error){
        console.log("Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
};

export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body); 
        if (error) {
            return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
        }
        const {email, password} = req.body; 
        const userExists = await user.findOne({email});
        if (!userExists) {
            return res.status(400).json({ message: "Invalid email or password" });
        }   
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: userExists._id,email: userExists.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token, message: "Login successful", user: {
                id: userExists._id,
                username: userExists.username,
                email: userExists.email
            } });
        
    }
    catch(error){
        console.log("Error during login:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" }); 
    }
};