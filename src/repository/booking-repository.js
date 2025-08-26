const { where } = require('sequelize');
const { Booking } = require('../models/index');
const { ValidationError, AppError } = require('../utils/errors/index');
const { StatusCodes}  = require( 'http-status-codes')

class BookingRepository{
    async create( data){
        try {
            const newBooking = await Booking.create(data);
            console.log( 'new booking data in repo layer , ', newBooking);
            return newBooking;
        } catch (error) {
            if( error.name == 'SequelizeValidationError'){
                throw new ValidationError( error)
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue in creating Booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )  
        }
    }

    async getBooking( bookingId ){
        try {
            const bookingDetails = await Booking.findByPk( bookingId );
            if( bookingDetails == null ){
                console.log("If block in getBooking repo method")
                throw new AppError(
                    "WrongBookingIdError",
                    'Cannot fetch booking details',
                    "No booking found for the given booking ID. Please check the ID and try again.",
                    StatusCodes.NOT_FOUND
                )
            }
            return bookingDetails;
        } catch (error) {
            if( error.name == 'WrongBookingIdError' ){
                throw error;
            }
            if( error.name == 'SequelizeValidationError'){
                throw new ValidationError( error)
            }
            throw new AppError(
                'RepositoryError',
                'Cannot fetch booking details',
                'There was some issue in fetching Booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )    
        }
    }

    async update( bookingId , data ){
      try{
        const bookingObj = await Booking.findByPk( bookingId);
        // if(  data.status ){
        //     bookingObj.status = data.status;
        // }
        Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            bookingObj[key] = data[key];
        }
        });

        await bookingObj.save()
        return bookingObj;

      }  
       catch (error) {
            console.log( "Error in update booking repo method : ", error);
            throw new AppError(
                'RepositoryError',
                'Cannot update booking',
                'There was some issue in updating Booking , please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )  
        }
    }
    


}

module.exports = BookingRepository;