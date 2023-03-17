import {connect} from "amqplib";

const run = async () => {
    try {
        const connection = await connect('amqp://localhost')
        const channel = await connection.createChannel()
        await channel.assertExchange('test-1', 'topic', {durable:true})
        const replyQueue = await channel.assertQueue('', {exclusive: true})
        channel.consume(replyQueue.queue, (message) => {
            console.log(message?.content.toString())
            console.log(message?.properties.correlationId)
        })
        channel.publish('test-1', 'my.command', Buffer.from('Work!!!'), {replyTo: replyQueue.queue, correlationId: '1'})
    } catch (e){
        console.error(e)
    }
}

run()