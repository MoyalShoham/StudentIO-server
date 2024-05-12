import mongoose from "mongoose";
import { IStudent } from "./student_model";


export interface IUser {
    email: string;
    password: string;
    tokens: string[];
    _id?: string;
    student?: IStudent;
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
    student: {
        type: mongoose.Schema.Types.ObjectId,
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
