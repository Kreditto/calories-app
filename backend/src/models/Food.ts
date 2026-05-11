import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    caloriesPer100: { type: Number, required: true },
    bilkyPer100: { type: Number, required: true },
    zhyryPer100: { type: Number, required: true },
    vuglevodyPer100: { type: Number, required: true },
    source: { 
        type: String, 
        enum: ['system', 'user_contributed'], 
        default: 'system' 
    },
    addedBy: { type: String, ref: 'User' } 
});

export const Food = mongoose.model('Food', foodSchema);