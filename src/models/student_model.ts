import mongoose from "mongoose";
// import { File } from 


export interface IStudent {
  name: string;
  faculty: string;
  _uid?: string;
  year: number;
  profilePic?: string;
  gender?: string;
  posts?: string[];
}

const studentSchema = new mongoose.Schema<IStudent>({
  name: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    required: true,
  },
  posts: {
    type: [String],
  },

});

export default mongoose.model<IStudent>("Student", studentSchema);
