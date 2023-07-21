import mongoose, { Schema, model } from "mongoose";

const adminShema = new Schema({
    adminId: {
        type:String,
        required:true 
    },
    time : {
        type:Boolean,
        required : true
    }
   
})
const Admin = model('Admin',adminShema);

export default Admin;
