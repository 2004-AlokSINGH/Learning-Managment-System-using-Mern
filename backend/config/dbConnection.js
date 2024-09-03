import mongoose from "mongoose";
mongoose.set('strictQuery', false);

const connectiontoDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || `mongodb://127.0.0.1:27017/LMS`
        );

        if (conn) {
            console.log(`Connected to DB ${conn.connection.host}`);
        }

    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

export default connectiontoDB;
