import mongoose from 'mongoose';

const userCollection = 'users';
const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rol: {
        type: String,
        default: 'usuario'
    },
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;