import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const { Schema, models, model } = mongoose;

const noteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.plugin(AutoIncrement(mongoose), {
  id: "ticketNo",
  inc_field: "ticket",
  start_seq: 500,
});

export default models.Note || model("Note", noteSchema);
