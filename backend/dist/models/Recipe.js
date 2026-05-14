"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recipe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const recipeSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    authorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
    description: { type: String },
    statusRep: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    ingredients: [{
            name: { type: String, required: true },
            calories100: { type: Number, required: true },
            bilky100: { type: Number, required: true },
            zhyry100: { type: Number, required: true },
            vuglevody100: { type: Number, required: true },
            gramsInPortion: { type: Number, required: true },
        }],
    caloriesPer100: { type: Number, required: true },
    bilkyPer100: { type: Number, required: true },
    zhyryPer100: { type: Number, required: true },
    vuglevodyPer100: { type: Number, required: true },
});
exports.Recipe = mongoose_1.default.model('Recipe', recipeSchema);
//# sourceMappingURL=Recipe.js.map