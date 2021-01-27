const io = require("socket.io")();

const socketapi = {
  io: io
};

io.on("connection", function(socket) {
  console.log(socket.id + " connected");
});

module.exports = socketapi;