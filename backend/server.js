const app = require("./app");
const { createNewMessage } = require("./services/chatService");

var http = require("http").Server(app);
const io = require("socket.io")(http);

global.io = io;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("send-message", async ({ message, user, conversation, to }) => {
    console.log(message, user, conversation);
    io.emit("receive-message", {
      data: message,
      userId: user,
      conversationId: conversation,
      for: to,
    });
    await createNewMessage(message, conversation, user);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
