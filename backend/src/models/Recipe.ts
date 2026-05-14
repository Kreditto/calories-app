import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    description: { type: String },
    statusRep: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    
    ingredients: [{
        name: { type: String, required: true },
        calories100: { type: Number, required: true },
        bilky100: { type: Number, required: true },
        zhyry100: { type: Number, required: true },
        vuglevody100: { type: Number, required: true },
        gramsInPortion:{ type: Number, required: true, default: 100 },
    }],

    caloriesPer100: { type: Number, required: true },
    bilkyPer100: { type: Number, required: true },
    zhyryPer100: { type: Number, required: true },
    vuglevodyPer100: { type: Number, required: true },
});


export const Recipe = mongoose.model('Recipe', recipeSchema);