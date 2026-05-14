"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealRecord = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MealRecordSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    dataPryyomu: { type: Date, default: Date.now },
    FoodType: { type: String, enum: ['snidanok', 'obid', 'vecherya', 'poludenok', 'perekus'], required: true },
    foodId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Food' },
    grams: { type: Number },
    recipeId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Recipe' },
    calculatedCalories: { type: Number, default: 0 },
    calculatedBilky: { type: Number, default: 0 },
    calculatedZhyry: { type: Number, default: 0 },
    calculatedVuglevody: { type: Number, default: 0 }
});
exports.MealRecord = mongoose_1.default.model('MealRecord', MealRecordSchema);
//# sourceMappingURL=MealRecord.js.map