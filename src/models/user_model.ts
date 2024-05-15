import mongoose from "mongoose";

export interface IUser {
    email: string;
    password: string;
    tokens: string[];
    _id?: string;
    year: string;
    faculty: string;
    profile_picture?: string;
    full_name: string;
    gender: string;
    posts: string[];

}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        type: [String]
    },
    year: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        default: 'null',
        required: true
    },
    full_name: {
        type: String,
        default: 'null'
    },
    gender: {
        type: String,
        required: true
    },
    posts: {
        type: [String],
        required: true,
        default: [],
      },
});

export default mongoose.model<IUser>("User", userSchema);
