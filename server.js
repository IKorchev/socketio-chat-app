const path = require("path")
const express = require("express")
const app = express()
const server = require("http").Server(app)
const PORT = 5500
const io = require("socket.io")(server)

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
app.use(express.static(path.join(__dirname, "public")))

const users = {}

io.on("connection", (socket) => {

  socket.on("client-message", (data) => {
    socket.broadcast.emit("server-message", data)
  })
})
