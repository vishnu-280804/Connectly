import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
  
      const user = await User.findOne({ email });
  
      if (user) return res.status(400).json({ message: "Email already exists" });
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
  
      if (newUser) {
        // generate jwt token here
        generateToken(newUser._id, res);
        await newUser.save();
  
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
      } else {
        return res.status(400).json({ message: "Invalid user data" });
      }
    } catch (error) {
      console.log("Error in signup controller", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
export const login = async (req,res)=>{
    const {email,password} = req.body;
    try {
      const user = await User.findOne({email});
      if(!user)
      {
        return res.status(401).json({message:"User does not exist"});
      }
      const isPasswordCorrect = await bcrypt.compare(password,user.password);
      if(!isPasswordCorrect)
      {
        return res.status(401).json({message:"Invalid Credentials"});
      }
      generateToken(user._id,res);
      res.status(201).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic,
      })
    } catch (error) {
      console.log("Error Message:"+(error.message));
    }
};

export const logout = (req,res)=>{
  try {
    res.cookie("jwt","",{maxAge:0});
    return res.status(201).json({message:"Valid Login Successfully"});
  } catch (error) {
    console.log("Error Message:"+(error.message))
    return res.status(400).json({message:"Invalid logout Check the erro"});
  }
};

export const updateProfile = async (req,res)=>{
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;
    if(!profilePic)
    {
      return res.status(401).json({message:"There is no profile pic"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
    return res.status(201).json(updatedUser);

  } catch (error) {
    console.log("Error Message:"+(error.message));
    return res.status(401).json({message:"Internal Server Error"});
  }
}

export const checkAuth = (req,res)=>{
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error Message:"+error.message);
    return res.status(400).json({message:"Internal Server Error"});
  }
}