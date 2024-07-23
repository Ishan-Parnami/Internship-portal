import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    age: { type: Number },
    dob: { type: Date },
    image: { type: String },
});

const UserModel = mongoose.model('User', UserSchema);
export { UserModel as User };
