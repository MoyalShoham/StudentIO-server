import Student from "../models/student_model";
import BaseController from "./base_controller";
import { IStudent } from "../models/student_model";

class StudentController extends BaseController<IStudent> {
  constructor() {
    super(Student);
  }

}

export default new StudentController();
