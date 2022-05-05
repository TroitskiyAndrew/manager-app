import mongoose from 'mongoose';

const { Schema } = mongoose;
const columnScheme = new Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  }
}, { versionKey: false });

export default mongoose.model('Column', columnScheme);