import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      maxLength: 30,
    },
    description: { 
      type: String, 
    },
    isComplete: { 
      type: Boolean, 
      default: false, 
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models["Task"] || mongoose.model("Task", TaskSchema); //mongoDB.collections.name = tasks

export default Task;