import mongoose from 'mongoose';

const { Schema } = mongoose;
const boardScheme = new Schema({
  title: {
    type: String,
    required: true,
  }
}, { versionKey: false });

export default mongoose.model('Board', boardScheme);