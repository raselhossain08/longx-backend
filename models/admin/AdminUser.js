const  mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userAdminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter your name'],
        maxLength:[50, 'Your name must be at least 50 characters'],
    },
    phone:{
        type:String, 
        required:[true, 'Please enter your phone number'],
        unique:true,
    },
    email:{
        type:String,
        required:[true, 'Please enter your email'],
        unique:true,
        validate:[validator.isEmail, 'Please enter a valid email address']
    },
    password:{
        type:String,
        required:[true, 'Please enter your password'],
        minLength:[6, 'Please enter at least 6 characters'],
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire:Date
})


// compare the password
userAdminSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
// Encrypting the password  before saving user
userAdminSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password =await bcrypt.hash(this.password,10)
})
// Return JWT token
userAdminSchema.methods.getJwtToken =function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

// generate password reset token 

userAdminSchema.methods.generateResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set hashed token and expiration time
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Token expires in 30 minutes

    // Return the unhashed token (for sending in the email)
    return resetToken;
};
module.exports =mongoose.model('AdminUser',userAdminSchema)
