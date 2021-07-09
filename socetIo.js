const Message = require('./models/messages.model');

module.exports = io => {
    io.on('connection', async (socket) => {
        console.log(socket.id, 'connect')
        socket.join('All');

        try {
            const getMessages = await Message.find();

            socket.emit('history', getMessages);
        } catch (err) {
            console.error(err);
        }

        socket.on("sendMessage", async (msg, callback) => {
            const newMessage = new Message({
                sender: msg.sender,
                avatar: msg.avatar,
                text: msg.text,
                date: msg.date
            });

            try {
                await newMessage.save()
                io.to('All').emit('message', newMessage);

            } catch (err) {
                console.error(err);
            }
        });
    });
};
