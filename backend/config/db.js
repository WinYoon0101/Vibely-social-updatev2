const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const mongoUri = process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_ATLAS
            : process.env.MONGO_URI_LOCAL;

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Đã kết nối cơ sở dữ liệu MongoDB: ${process.env.NODE_ENV === 'production' ? 'Atlas (Cloud)' : 'Local'}`);
    } catch (error) {
        console.error('Không thể kết nối tới cơ sở dữ liệu MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDb;
