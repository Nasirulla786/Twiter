import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required all fields" });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "email already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });


    let token;

    token = jwt.sign({id:user._id}, process.env.JWT_SECRET , {expiresIn:"2d"})
    res.cookie("token" , token)





    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Required all fields" });
    }

    const checkEmail = await User.findOne({ email });
    if (!checkEmail) {
      return res.status(400).json({ message: "email does not exist" });
    }

    const comPassword = await bcrypt.compare(password, checkEmail.password);
    if (!comPassword) {
      return res.status(400).json({ message: "incoreect pasword" });
    }

    const token = jwt.sign({ id: checkEmail._id }, process.env.JWT_SECRET , {expiresIn:"2d"});
    res.cookie("token", token);

    return res.status(200).json({ data: checkEmail });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {

    await res.clearCookie("token");

    return res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    console.log(error);
  }
};


export const getCurrentUser  = async(req , res)=>{
  try {
    const userId = req.userId
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({message:"user not found"});
    }

    return res.status(200).json({data:user});

  } catch (error) {
    console.log(error);

  }
}
