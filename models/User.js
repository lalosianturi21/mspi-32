import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const UserSchema = new Schema (
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true },
        admin: { type: Boolean, default: false }
    },
    {timestamps: true}
);

UserSchema.pre("save", async function (next){
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
        return next();
    }
    return next();
})

UserSchema.methods.generateJWT = async function () {
    return await sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
}

const User = model("User",  UserSchema);
export default User;