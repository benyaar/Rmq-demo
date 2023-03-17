import {connect} from "amqplib";

const run = async () => {
    try {
        const connection = await connect('amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertExchange('test-1', 'topic', {durable:true})
        const queue = await channel.assertQueue('my-cool-queue', {durable: true})
        channel.bindQueue(queue.queue, 'test-1', 'my.command')
        channel.consume(queue.queue, (message) => {
            if (!message){
                return
            }
            console.log(message.content.toString())
            if(message.properties.replyTo){
                console.log(message.properties.replyTo)
                channel.sendToQueue(message.properties.replyTo, Buffer.from('Response'), {correlationId: message.properties.correlationId})
            }
        }, {
            noAck:true
        })
    } catch (e){
        console.error(e)
    }
}

run()