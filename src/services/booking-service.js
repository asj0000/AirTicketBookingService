const axios = require('axios');
const { BookingRepository } = require( '../repository/index')
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const {ServiceError, AppError} = require('../utils/errors/index');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking( data ){
        try {
            const flightId  = data.flightId;
            const getFlightRequestURL =   `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOftheFlight = flightData.price;

            if( data.NumberOfSeats > flightData.totalSeats){
                throw new ServiceError(
                    'Something went wrong in booking process', //message
                    'insufficient seats', // explanation
                )    
            }
            const TotalCost = priceOftheFlight * data.NumberOfSeats;
            const bookingPayload = { ...data , TotalCost};
            const booking  = await this.bookingRepository.create( bookingPayload );
            const updateFlightRequestURL =  `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}` ;
            console.log("updateFlightRequestURL ", updateFlightRequestURL);
            await axios.patch( updateFlightRequestURL , { totalSeats: flightData.totalSeats - booking.NumberOfSeats});
            const finalBooking  = await this.bookingRepository.update(booking.id , { status : 'Booked'});

            return finalBooking;



        } catch (error) {
            if( error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }

    async getBooking( bookingId ){
        try {
            const response = await this.bookingRepository.getBooking( bookingId );
            return response;
        } catch (error) {
            console.log( "Error name in service layer ", error.name);
            console.log( "Error code in service layer ", error.statusCode);

            if( error.name == 'WrongBookingIdError' || error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }

    async updateBooking( bookingId , data ){

        try{
            let bookingData = await this.bookingRepository.getBooking(bookingId);
            
            const flightId  = data.flightId;
            const getFlightRequestURL =   `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            
            let priceOftheFlight = flightData.price;
            let updatedBookingDetails = { ...bookingData.toJSON() , ...data};
            console.log("updatedBookingDetails number of seats before update ", updatedBookingDetails.NumberOfSeats );
            // this code is when user cancels all seats at once
            if( data.status && data.status == 'Cancelled'){
                const updateFlightRequestURL =  `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}` ;
                const newTotalSeats = flightData.totalSeats + updatedBookingDetails.NumberOfSeats;
                console.log("PATCH URL:", updateFlightRequestURL);
                console.log("PATCH PAYLOAD:", { totalSeats: newTotalSeats });
                await axios.patch( updateFlightRequestURL , { totalSeats: newTotalSeats });
                updatedBookingDetails.NumberOfSeats = 0;
                updatedBookingDetails.TotalCost = 0;

            }
            if( data.NumberOfSeats && data.NumberOfSeats !== bookingData.NumberOfSeats ){
                if( data.NumberOfSeats > flightData.totalSeats){
                    throw new ServiceError(
                        'Something went wrong in booking process', //message
                        'insufficient seats', // explanation
                    )    
                }
                const seatsToAdd = Number(data.NumberOfSeats);
                const currentSeats = Number(updatedBookingDetails.NumberOfSeats);

                const newTotalSeats = currentSeats + seatsToAdd;
                const newTotalCost = priceOftheFlight * newTotalSeats;

                updatedBookingDetails.NumberOfSeats = newTotalSeats;
                updatedBookingDetails.TotalCost = newTotalCost;
            }
            console.log("booking data in service before passing to repo ", updatedBookingDetails);
            const updatedBookingObj = await this.bookingRepository.update( bookingId , updatedBookingDetails );
            return updatedBookingObj ;

        }catch( error ){
            console.log("Error ", error)
            if( error.name == 'WrongBookingIdError'|| error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;