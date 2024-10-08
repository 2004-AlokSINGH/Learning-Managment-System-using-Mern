import app from './app.js';
import { config } from 'dotenv';
import connectiontoDB from './config/dbConnection.js';
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay';

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

config();

const PORT = process.env.PORT || 5000;

export const razorpay=new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  secret_id:process.env.RAZORPAY_SECRET
}

)

app.listen(PORT, async () => {
    await connectiontoDB();
    console.log(`App running at http://localhost:${PORT}`);
});
