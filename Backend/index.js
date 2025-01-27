require("dotenv").config();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const express=require("express");
const cors=require("cors");
const jwt=require("jsonwebtoken");
const User=require("./models/user.model")

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000 // Increase socket timeout to 45 seconds
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const app=express();
app.use(express.json());
app.use(cors({origin: "*"}));

//create account
app.post("/create-account", async(req, res)=>{
    const {fullName, email, password}=req.body;

    if(!fullName || !email || !password){
        return res
        .send(400)
        .json({error:true, message: "All Fields are Required"});
    }

    try{

        const isUser=await User.findOne({email});

        if(isUser){
            return res
                .status(400)
                .json({error:true, message:"User already exist!"});
        }

        //hsah the password
        const hashedPassword=await bcrypt.hash(password, 10);

        //create and save the user
        const user=new User({
            fullName, 
            email,
            password:hashedPassword,
        });

        await user.save();

        //generate token
        const acessToken=jwt.sign(
            {userId:user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"72h",}
        );

        //respond with sucess
        return res.status(201).json({
            error:false,
            user:{fullName:user.fullName, email:user.email},
            acessToken,
            message:"Registration Sucessful",
        });

    }catch(error){
        //catch and handle error
        return res
            .status(500)
            .json({error:true, message:"Internal Server Error"});
    }
});


//login account
app.post("/login", async(req, res)=>{
    const {email, password}=req.body;

    //chech if email and password are provided
    if(!email || !password){
        return res
        .status(400)
        .json({error:true, message:"Email and password fields are required"});
    }

    //check if user exist   
    const user=await User.findOne({email});

    //if user does not exist
    if(!user){
        return res
        .status(400)
        .json({message:"user not found"});
    }

    //check if password is correct
    const validPassword=await bcrypt.compare(password, user.password);

    //if password is not correct
    if(!validPassword){
        return res
        .status(400)
        .json({message:"Invalid credentials"});
    }

    const acessToken=jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"72h"},
    );

    //respond with sucess
    return res.json({
        error:false,
        message:"Login sucessful",
        user:{fullName:user.fullName, email:user.email},
        acessToken,
    });
});


app.listen(8000);
module.exports=app;