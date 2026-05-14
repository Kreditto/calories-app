"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFood = void 0;
const Food_1 = require("../models/Food");
const searchFood = async (req, res) => {
    const query = req.query.q;
    if (!query || query.length < 2) {
        return res.json([]);
    }
    const products = await Food_1.Food.find({
        name: { $regex: query, $options: 'i' }
    }).limit(15);
    res.json(products);
};
exports.searchFood = searchFood;
//# sourceMappingURL=foodController.js.map