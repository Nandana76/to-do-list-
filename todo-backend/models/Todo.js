import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    category: { type: String, default: "General" },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);
