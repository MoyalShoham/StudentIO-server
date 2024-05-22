import mongoose from "mongoose";

export interface IUser {
    email?: string;
    password?: string;
    tokens?: string[];
    _id?: string;
    year?: string;
    faculty?: string;
    profile_picture?: string;
    full_name: string;
    gender?: string;
    posts?: string[];

    connectId?: string;

}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    tokens: {
        type: [String]
    },
    year: {
        type: String,
        required: false
    },
    faculty: {
        type: String,
        required: false
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
        required: false
    },
    posts: {
        type: [String],
        required: false,
        default: [],
      },
});

export default mongoose.model<IUser>("User", userSchema);
