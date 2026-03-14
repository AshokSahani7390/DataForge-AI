import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const verifyWebhookSignature = (body: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
};

export const createOrder = async (amount: number, currency: string = 'INR') => {
  return await razorpay.orders.create({
    amount: amount * 100, // Razorpay works in paise
    currency,
    receipt: `receipt_${Date.now()}`,
  });
};
