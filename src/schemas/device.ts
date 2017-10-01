import { Schema } from "mongoose";

export var deviceSchema: Schema = new Schema({
  name: String,
  token: String,
  type: String,
  status: String,
  startedAt: Number,
  procPid: Number,
  apiLevel: String
});

deviceSchema.pre("save", function (next) {
  next();
});