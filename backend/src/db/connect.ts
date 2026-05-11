import mongoose from 'mongoose';

export const pidkluchennyaDoBazy = async () => {
    try {
        const urlDb = process.env.MONGO_URI || '';
        await mongoose.connect(urlDb);
        console.log('База підключена');
    } catch (error) {
        console.error('помилка підключення до бази:', error);
        process.exit(1);
    }
};