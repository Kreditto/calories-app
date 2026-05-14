import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String, enum: ['def', 'premium', 'admin'], default: 'def' },

    //physicalData
    vaga: { type: Number, default: 0 },
    zrist: { type: Number, default: 0 },
    vik: { type: Number, default: 0 },
    stat: { type: String, enum: ['male', 'female'], default: 'female' },
    activity: { type: String, default: '1.2' },
    goal: { type: String, default: 'maintain' },
   
    //targets
    calories: { type: Number, default: 0 },
    bilky: { type: Number, default: 0 },
    zhyry: { type: Number, default: 0 },
    vuglevody: { type: Number, default: 0 },
 
    cardData: {
        cardNumber: { type: String },
        expiryDate: { type: String }, 
        cardHolder: { type: String }
    },

    //moderationStats
    CreatedFood: { type: Number, default: 0 },
    approvedRecipes: { type: Number, default: 0},
    CreatedRecipes: { type: Number, default: 0}
   
});


export const User = mongoose.model('User', UserSchema);