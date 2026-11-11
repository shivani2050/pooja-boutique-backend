const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt  = require("jsonwebtoken") ;

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// register

const RegisterUser = async(req,res)=>{
   try{
     const { name, email, phone, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: 'Name , Email, Password are required'
        })
    }


if(password.length < 8){
     return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });

}

const normalizeEmail = email.trim().toLowerCase();
const existingUser = await User.findOne({
    email: normalizeEmail
})

  if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

 const hashedPassword = await bcrypt.hash(password, 12);

 const user = await User.create({
            name: name.trim(),
            email: normalizeEmail,
            phone: phone || '',
            password: hashedPassword
        });
 const token = generateToken(user._id);
 
 return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

   }catch(error){
    console.error('Register error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
   }
 

    }


    // login
    const UserLogin = async(req,res)=>{
        try{
            const {email, password}= req.body

            if(!email || !password){
                return  res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            }

            const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

         if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

         const isMatch = await bcrypt.compare(
            password,
            user.password
        );

          if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
const token = generateToken(user._id);

  return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
        }catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
    }

    module.exports = {RegisterUser,UserLogin}















