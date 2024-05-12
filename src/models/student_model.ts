import mongoose from "mongoose";
// import { IPost } from "./post_model";
// import { File } from 


export interface IStudent {
  faculty: string;
  year: number;
}

const studentSchema = new mongoose.Schema<IStudent>({

  faculty: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },



});

export default mongoose.model<IStudent>("Student", studentSchema);
