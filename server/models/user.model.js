const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

var UserSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: [true, "Firstname is required"],
        minLength: [2, "Firstname must be at least 2 characters"]},
    lastName: {
        type: String, 
        required: [true, "Lastname is required"],
        minLength: [2, "Lastname must be at least 2 characters"]},
    email: {
        type: String, 
        required: [true, "Email is required "], 
        unique: [true, "Email already exists" ],
        validate:[isEmail,"Please enter a valid email"]
        },
    password :{
        type: String, 
        required: [true, "Password is required"], 
        minLength: [8, "Password must be at least 8 characters"]},
}, {timestamps: true});
    
    // Middlware to check if password matches confirm password
    UserSchema.virtual('confirmPassword') // Virtual Attribute not saved in our database 
        .get( () => this._confirmPassword )//getter
        .set( value => this._confirmPassword = value );// setter
    
    UserSchema.pre('validate', function(next) {
        if (this.password !== this.confirmPassword) {
            this.invalidate('confirmPassword', 'Password must match confirm password');
        }
        next();
        });
    
    UserSchema.pre('save', function(next) {
        bcrypt.hash(this.password, 10)
            .then(hash => {
            this.password = hash;
            next();
            });
        });
    
    const User = mongoose.model("User", UserSchema)
    module.exports = User;
    