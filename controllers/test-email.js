import { sendBookingConfirmation } from './email-controller.js';

// Test data
const testUserEmail = 'aditi.dole1921@gmail.com';
const testMovieID = 0;
const testSeatNumber = 'A1';
const testShowtime = new Date().toISOString();
const testBookingID = '123456';

const testEmailFunction = async () => {
  await sendBookingConfirmation(testUserEmail, testMovieID, testSeatNumber, testShowtime, testBookingID);
};

testEmailFunction();
