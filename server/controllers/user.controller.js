const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const bcrypt = require('bcrypt')


// Register a new User 

module.exports = {
    findAll: (req,res) =>{
        User.find()
            .then(allUsers =>res.json(allUsers))
            .catch(err => res.status(400).json(err))
    },
    findOneUser: (req,res) =>{
        User.findOne({email: req.body.email} )
            .then((user) =>{
                const {_id, firstName,lastName,...other} = user;
                res.json(user)
            })
            .catch(err => res.status(400).json(err))
    },
    register: async (req, res) =>{
        try { 
            const potentialUser = await User.findOne({email: req.body.email});
            if (potentialUser){
                res.status(400).json({message:"Email already exists"});
            }else {
                const newUser = await User.create(req.body);
                
                const userToken = jwt.sign({_id:newUser.id, 
                    email:newUser.email,
                    firstName:newUser.firstName,
                    lastName: newUser.lastName}, secret, {expiresIn: "1d"});
                res.cookie("usertoken", userToken, {
                    httpOnly: true
                } ).json({message:"succed!", user : newUser});
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({message:"failed", error});
        }
    },
    // Login function
    login: async (req, res) => {
        try {
            const user = await User.findOne({email: req.body.email});
            if (user){
                const {_id,firstName,lastName,...other}=user;
                const passwordMatch = await bcrypt.compare(req.body.password, user.password);
                if(passwordMatch){
                    const userToken = jwt.sign({
                        _id:user.id, 
                        email:user.email,
                        firstName:user.firstName,
                        lastName: user.lastName
                }, secret, {expiresIn: "1d"});
                
                res.cookie("usertoken", userToken, {
                    httpOnly: true
                }).json({message:"succeed!", user : {id:_id, firstName:firstName, lastName: lastName}});
                }
                else{
                    res.status(400).json({message:"Invalid login attempt"})
                }
            }else{
                res.status(400).json({message:"Invalid login attempt"})
            }
        } catch (error) {
            console.log(error);
            return res.status(400).json({message:"failed", error});
        }
    },
    // Logout Function 
    logout: (req, res)=>{
        res.clearCookie("usertoken").json({message:"success"})
    },
    isLoggedIn : async (req, res) =>{
        jwt.verify(req.cookies.usertoken, secret, async (err, payload) =>{
            if(err){
                console.log("Authetication failed!");
                res.status(401).json({verified: false});
            }else{
                const user = await User.findOne({_id:payload._id})
                const { _id, firstName, lastName } = user
                return res.json({id:_id, firstName:firstName, lastName: lastName})
            }
        } )
    }
}

