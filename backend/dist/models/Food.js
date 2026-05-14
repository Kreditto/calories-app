"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Food = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const foodSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    caloriesPer100: { type: Number, required: true },
    bilkyPer100: { type: Number, required: true },
    zhyryPer100: { type: Number, required: true },
    vuglevodyPer100: { type: Number, required: true },
});
exports.Food = mongoose_1.default.model('Food', foodSchema);
//# sourceMappingURL=Food.js.map