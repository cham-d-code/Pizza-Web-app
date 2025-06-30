const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtpSMS = async (to, otp) => {
  try {
    await client.messages.create({
      body: `Your Pizza App OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: to,
    });
    console.log(`✅ OTP sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send SMS: ${error.message}`);
  }
};

module.exports = sendOtpSMS;
