const { BookingService }= require( '../services/index');
const bookingServiceObj = new BookingService();
const { StatusCodes } = require('http-status-codes')

const create = async ( req , res )=>{
    try {
        const response = await bookingServiceObj.createBooking( req.body );
        return res.status( StatusCodes.OK).json({
            data: response,
            success: true,
            message: "Successfuly created a booking",
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json({
            data:{},
            success: false,
            message: error.message,
            err: error.explanation
        })
    }

}

const get = async( req , res )=>{
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

const update = async( req, res )=>{
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

module.exports = {
    create,
    get,
    update
}