const { BookingService }= require( '../services/index');
const bookingServiceObj = new BookingService();
const { StatusCodes } = require('http-status-codes')
const { createChannel, publishMessage } = require('../utils/messageQueue')
const { REMINDER_BINDING_KEY}  = require('../config/serverConfig')

class BookingController{
    
    async sendToQueue(req , res ){
        try {
            const channel = await createChannel();
            console.log("Channel created in controller");
            const data = { message: 'Success'};
            publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify( data ));
            return res.status(StatusCodes.OK).json({
                message: "Successfully published the event",
                err: {}
            });
        } catch (error) {
            return res.status(500).json({
                data: {},
                success: false,
                message: error.message,
                err: error.explanation
            });
        }
    }
    async create(req, res) {
        try {
            const response = await bookingServiceObj.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                data: response,
                success: true,
                message: "Successfully created a booking",
                err: {}
            });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.message,
                err: error.explanation
            });
        }
    }
    async get( req , res ){
        try {
            const bookingId = req.params.id ;
            const response = await bookingServiceObj.getBooking( bookingId);
            return res.status( StatusCodes.OK).json({
                data: response,
                success: true,
                message: "Successfuly fetched a booking",
                err: {}
            }) 
        } catch (error) {
            console.log("error caught in controller ",error);
            return res.status(error.statusCode).json({
                data:{},
                success: false,
                message: error.message,
                err: error.explanation
            })
            
        }
    }

    async update( req , res){
        try {
            const response = await bookingServiceObj.updateBooking( req.params.id , req.body);
            return res.status( StatusCodes.OK).json({
                data: response,
                success: true,
                message: "Successfuly updated a booking",
                err: {}
            }) 
        } catch (error) {
            console.log("error caught in controller ",error);
            return res.status(error.statusCode).json({
                data:{},
                success: false,
                message: error.message,
                err: error.explanation
            })
        }
    }

}




module.exports  = BookingController;