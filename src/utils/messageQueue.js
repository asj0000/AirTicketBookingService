const amqplib = require('amqplib')
const { MESSAGE_BROKER_URL , EXCHANGE_NAME } = require('../config/serverConfig');


const createChannel = async()=>{
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel =    await connection.createChannel();
        channel.assertExchange(EXCHANGE_NAME  , 'direct' , false);
        return channel ;
    } catch (error) {
        console.log("Error in message queue" , error);
        throw error;        
    }

}

const subscribeMessage  = async (channel , service , bindingKey)=>{
    try {
        const applicationQueue  = await channel.assertQueue(bindingKey);
        channel.bindQueue(applicationQueue.queue , EXCHANGE_NAME , bindingKey);
        channel.consume(applicationQueue.queue , msg=>{
            console.log("Received data");
            console.log(msg.content.toString());
            channel.ack(msg);
        })

    } catch (error) {
        throw error;
    }


}

const publishMessage = async(channel ,bindingKey, message)=>{
    try {
        await channel.assertQueue(bindingKey);
        await channel.publish( EXCHANGE_NAME , bindingKey , Buffer.from(message) );
    } catch (error) {
        throw error;     
        
    }

}

module.exports = {createChannel , subscribeMessage, publishMessage}