"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pidkluchennyaDoBazy = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pidkluchennyaDoBazy = async () => {
    try {
        const urlDb = process.env.MONGO_URI || '';
        await mongoose_1.default.connect(urlDb);
        console.log('База підключена');
    }
    catch (error) {
        console.error('помилка підключення до бази:', error);
        process.exit(1);
    }
};
exports.pidkluchennyaDoBazy = pidkluchennyaDoBazy;
//# sourceMappingURL=connect.js.map