import mongoose from "mongoose";

const usrSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true},     
    createdAt: {type: Date, default: Date.now}
})

const user = mongoose.model("User", usrSchema); 

export default user;


