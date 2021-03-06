const path = require("path")
const express = require("express")
const app = express()
const server = require("http").Server(app)
const PORT = process.env.PORT || 80
const io = require("socket.io")(server)

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
app.use(express.static(path.join(__dirname, "public")))

let peopleInChat = []
io.on("connection", (socket) => {
  socket.on("send-username", (username) => {
    // SET THE NAME
    if (username) {
      socket.username = username
    } else {
      socket.username = "Guest"
    }
    // ADD NAME TO THE ARRAY OF NAMES
    peopleInChat.push(socket.username)
    socket.broadcast.emit("client-joined", username)
    io.emit("all-usernames", peopleInChat)
  })
  socket.on("client-message", (data) => {
    socket.broadcast.emit("server-message", data)
    socket.color = data.color
  })

  socket.on("disconnect", () => {
    // SEND THE NAME OF DISCONNECTED SOCKET TO CLIENT
    socket.broadcast.emit("client-disconnected", socket.username)
    // REMOVE THE NAME FROM THE ARRAY
    for (let i = 0; i < peopleInChat.length; i++) {
      if (peopleInChat[i] == socket.username) {
        peopleInChat.splice(i, 1)
      }
    }
    // EMIT THE UPDATED LIST
    io.emit("all-usernames", peopleInChat)
  })
})
