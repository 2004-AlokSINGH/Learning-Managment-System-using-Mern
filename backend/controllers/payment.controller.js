
import User from '../models/user.model.js';

import Payment from '../models/payment.model.js';

import AppError from '../utils/error.util.js';
import {razorpay} from '../server.js'



const getRazorpayApiKey=async(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:'Razorpay API key',
        key:process.env.RAZORPAY_KEY_ID

    })

}

const buySubscription = async (req, res, next) => {
    try {
      const { id } = req.user;
      const user = await User.findById(id);
  
      if (!user) {
        return next(new AppError('Unauthorized user, please login again', 400));
      }
      if (user.role === 'ADMIN') {
        return next(new AppError('Admin can\'t purchase subscription', 400));
      }
  
      // Debug log to check environment variables
      console.log('Razorpay Plan ID:', process.env.RAZORPAY_PLAN_ID);
      console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
      console.log('Razorpay Secret:', process.env.RAZORPAY_SECRET);
  
      // Properly await the subscription creation
      const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notify: 1
      });
  
      // Log the subscription details after it is resolved
      console.log(subscription.id);
  
      user.subscription.id = subscription.id;
      user.subscription.status = subscription.status;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Subscribed successfully",
        subscription_id: subscription.id
      });
  
    } catch (e) {
      console.log(e);
      return next(new AppError(e.message, 400));
    }
  };
  
const verifySubscription = async (req, res, next) => {
    const { id } = req.user;
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    const user = await User.findById(id);

    if (!user) {
        return next(new AppError('Unauthorized user', 400));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        return next(new AppError('Payment not done, plz try again', 400));
    }

    // Save payment details to the database
    const payment = new Payment({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature
    });

    user.subscription.status='active';

    await payment.save();

    

    res.status(200).json({ success: true, message: 'Subscription assigned successfully' });
};


const cancelSubscription=async(req,res,next)=>{
    const {id}=req.user;
    const user =await User.findById(id);
    if(!user){
        return next(new AppError('Unauthorized user,please login again',400))
    }
    if(user.role==='ADMIN'){
        return next(new AppError('Admin cant puchase subscription',400))
    }

    const subscriptionId= user.subscription.id;

    const subscription= await razorpay.subscription.cancel(subscriptionId)

    user.subscription.status=subscription.status;

    await user.save();

}

const allPayment=async(req,res,next)=>{
    const {count}=req.query;

    const payments= await razorpay.subscription.all({
        count : count || 10,
    });

    res.status(200).json({
        success:true,
        message:'All payments',
        payments

    })

}

export{
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayment
}
