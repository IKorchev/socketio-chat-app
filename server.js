const path = require("path")
const express = require("express")
const app = express()
const server = require("http").Server(app)
const PORT = 5500
const io = require("socket.io")(server)

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
app.use(express.static(path.join(__dirname, "public")))

let peopleInChat = []
io.on("connection", (socket) => {
  socket.on("send-username", (username) => {
    socket.username = username
    peopleInChat.push(username)
    console.log(peopleInChat)
    socket.broadcast.emit("client-joined", username)
    io.emit("all-usernames", peopleInChat)
  })
  socket.on("client-message", (data) => {
    socket.broadcast.emit("server-message", data)
  })
  socket.on("disconnect", () => {
    socket.broadcast.emit("client-disconnected", socket.username)
    for (let i = 0; i < peopleInChat.length; i++) {
      if (peopleInChat[i] == socket.username) {
        peopleInChat.splice(i, 1)
      }
    }
    console.log(peopleInChat)
    io.emit("all-usernames", peopleInChat)
  })
})
