import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    UserRole: { 
        type: String, 
        enum: ['def', 'premium'], 
        default: 'def' 
    },
    vaga: { type: Number, default: 0 },
    zrist: { type: Number, default: 0 },
    vik: { type: Number, default: 0 },
    stat: { type: String, enum: ['male', 'female'], default: 'female' },
    activity: { type: String, default: '1.2' },
    goal: { type: String, default: 'maintain' },

    // цілі КБЖВ (результат розрахунку)
    calories: { type: Number, default: 0 },
    bilky: { type: Number, default: 0 },
    zhyry: { type: Number, default: 0 },
    vuglevody: { type: Number, default: 0 },

    //додати карту пдідписки +
    CardData: {
        cardNumber: { type: String, default: "" },
        expiryDate: { type: String, default: "" }, 
        cardHolder: { type: String, default: "" },
        cvv: { type: String, default: "" } 
    }      
});


export const User = mongoose.model('User', UserSchema);