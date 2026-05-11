import mongoose from 'mongoose';

const MealRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dataPryyomu: { type: Date, default: Date.now },
    FoodType: { 
        type: String, 
        enum: ['snidanok', 'obid', 'vecherya', 'poludenok', 'perekus'], 
        required: true 
    },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    grams: { type: Number },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    calculatedCalories: { type: Number, default: 0 },
    calculatedBilky: { type: Number, default: 0 },
    calculatedZhyry: { type: Number, default: 0 },
    calculatedVuglevody: { type: Number, default: 0 }
});

export const MealRecord = mongoose.model('MealRecord', MealRecordSchema);