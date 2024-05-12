import mongoose from "mongoose";
import { IStudent } from "./student_model";

export interface IPost {
    message: string;
    owner: IStudent;
    date?: Date;
    _pid?: string;
    image?: string;
}

const postSchema = new mongoose.Schema<IPost>({
    message: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },

    

});

export default mongoose.model<IPost>("Post", postSchema);
