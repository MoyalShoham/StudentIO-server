import mongoose from "mongoose";
// import { File } from 


export interface IStudent {
  name: string;
  faculty: string;
  year: number;
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
  gender: {
    type: String,
    required: true,
  },
  posts: {
    type: [String],
  },

});

export default mongoose.model<IStudent>("Student", studentSchema);
