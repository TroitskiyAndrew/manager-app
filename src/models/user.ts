import mongoose from 'mongoose';

const { Schema } = mongoose;
const userScheme = new Schema({ name: String, age: Number }, { versionKey: false });

export default mongoose.model('User', userScheme);