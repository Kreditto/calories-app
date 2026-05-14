"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = require("./db/connect");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mealRoutes_1 = __importDefault(require("./routes/mealRoutes"));
const foodRoutes_1 = __importDefault(require("./routes/foodRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, connect_1.pidkluchennyaDoBazy)();
app.use('/api/auth', authRoutes_1.default);
app.use('/api/meals', mealRoutes_1.default);
app.use('/api/food', foodRoutes_1.default);
app.use('/api/recipes', recipeRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.listen(PORT, () => {
    console.log("Сервер на порту", { PORT });
});
//# sourceMappingURL=index.js.map