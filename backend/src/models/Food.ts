import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    caloriesPer100: { type: Number, required: true },
    bilkyPer100: { type: Number, required: true },
    zhyryPer100: { type: Number, required: true },
    vuglevodyPer100: { type: Number, required: true },
});

export const Food = mongoose.model('Food', foodSchema);