const express = require('express');

const { BookingController} = require('../../controllers')
const { createChannel } = require('../../utils/messageQueue')
const router = express.Router();


const bookingControllerObj = new BookingController();

router.post('/bookings' , bookingControllerObj.create);
router.post('/publish' , bookingControllerObj.sendToQueue);
router.get('/bookings/:id', bookingControllerObj.get );
router.patch('/bookings/:id', bookingControllerObj.update);


module.exports = router;