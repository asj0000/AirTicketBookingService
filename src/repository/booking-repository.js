const { where } = require('sequelize');
const { Booking } = require('../models/index');
const { ValidationError, AppError } = require('../utils/errors/index');
const { StatusCodes}  = require( 'http-status-codes')

class BookingRepository{
    async create( data){
        try {
            const newBooking = Booking.create(data);
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


}

module.exports = BookingRepository;