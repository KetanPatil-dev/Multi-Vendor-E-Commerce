import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
     type:String,
     unique:true,
     lowercase:true,
     trim:true,
     required:true,
     unique:true
    },
    password:{
        type:String,
        required:true,
        minlenght:[6,"Password must be atleast 6 characters long"]
    },
    cartItems:[
        {
            quantity:{
                type:Number,
                default:1
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            }
        }
    ],
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    }
},{timestamps:true})


// to hash pass before saving to db
userSchema.pre("save",async function (next){
    if(!this.isModified("password"))return next()
        
        try{
            const salt=await bcrypt.genSalt(10);
            this.password=await bcrypt.hash(this.password,salt);
        }
        catch(error)
        {
            next(error)
        }
    })
    userSchema.methods.comparePassword=async function (password) {
        return bcrypt.compare(password,this.password)
    }
const UserModel= mongoose.model("User",userSchema)
export default UserModel  