const mongoose =require('mongoose')
const bcrypt = require('bcryptjs')
const path = require('path')

require('dotenv').config({
    path: path.resolve(__dirname, '../.env'),
})

const User = require('../model/User')

const createAdmin = async()=>{
    try{

        if(!process.env.MONGO_URI){
            throw new Error('MONGO_URI is missing in .env')
        }

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Admin credentials are missing in .env");
    }

  await mongoose.connect(process.env.MONGO_URI, {
      dbName: "pooja-boutique",
    });
     console.log("mongodb connected")

     const email = process.env.ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    if(existingUser){
        if(existingUser.role ==="admin "){
             console.log("Admin account already exists.");
        }else {
        console.log("This email is already registered as a customer.");
      }
      return; 
    }
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      12
    );

    await User.create({
      name: "Pooja Boutique Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });
 console.log("Admin account created successfully!");

    }catch(error){
          console.log('error', error.message);
          
    }finally{
        await mongoose.disconnect()
    }
}

createAdmin()