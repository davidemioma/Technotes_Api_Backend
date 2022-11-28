import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATASET_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("Connected to mongo DB");
  } catch (err) {
    console.log(err);
  }
};
