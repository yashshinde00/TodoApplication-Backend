const { UserModel } = require("../models/mongoose");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;



const signup = async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(4).email(),
    name: z.string().min(3),
    password: z.string().min(6),
  });

  const parsedPassword = requiredBody.safeParse(req.body);

  if (!parsedPassword.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedPassword.error.errors, 
    });
  }
  

  const { email, password, name } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
       return res.status(400).json({message : "Email already Exist"})
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await UserModel.create({
      email: email,
      password: hashedPassword,
      name: name,
    });
    res.status(201).json({
      message: "You are signed up",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const signin = async (req, res) => {
  const requiredBody = z.object({
    email: z.string().min(4).max(30).email(),
    password: z.string().min(6).max(15),
  });
  const parsedPassword = requiredBody.safeParse(req.body);

  if (!parsedPassword.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: parsedPassword.error.errors, 
    });
  }
  

  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({
        email: email, 
      });

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        {
          id: user._id.toString(),
        },
        JWT_SECRET
      );

      return res.json({
        token,
      });
    }else{
        res.status(400).json({
            message: "Invalid credentials"
        })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Incorrect creds",
    });
  }
};

module.exports = {
  signup,
  signin,
};
