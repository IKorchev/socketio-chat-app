const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const inTheChat = document.querySelector(".in-the-chat")
const chosenColor = document.querySelector(".colorInput")
const notificationSound = document.querySelector("audio")
const body = document.querySelector("body")
const userTyping = document.querySelector(".user-typing")
const username = prompt("Name (max 20 characters):").substring(0, 20)

window.onload = () => {
  message.focus()
}

const sendButtonHandler = (e) => {
  e.preventDefault()
  const data = {
    color: chosenColor.value.slice(1, 7),
    name: username,
    msg: message.value,
  }
  if (!data.name || data.name == "") {
    data.name = "Guest"
  }
  if (data.msg === "") {
    alert("Seems like you are trying to send an empty message. Please type something!")
  } else {
    formatData(data, data.color, "my-message")
    socket.emit("client-message", data)
  }
  message.value = ""
  output.scrollTop = output.scrollHeight
}

message.addEventListener("input", () => {
  socket.emit("user-typing", message.value)
})

socket.on("client-disconnected", (name) => {
  output.innerHTML += setHtml(name, "danger", "left the chat!")
  output.scrollTop = output.scrollHeight
})

socket.on("connect", () => {
  socket.emit("send-username", username)
})

socket.on("all-usernames", (usernames) => {
  let html = ""
  usernames.forEach((user) => {
    html += `
      <li class="card m-1 col-md-2 user">
        <div class="card-body px-1 py-2 text-truncate">
          <strong><i class="bi bi-person-fill"></i> ${user}</strong>
        </div>
      </li>`
    // <li class="d-flex align-items-center justify-content-center users-in-chat"></li>
  })
  inTheChat.innerHTML = html
  document.querySelectorAll(".users-in-chat").forEach((item) => {
    setTimeout(() => {
      item.classList.add("transition-class")
    }, 1)
  })
})




socket.on("server-message", (data) => {
  formatData(data, data.color)
  notificationSound.play()
})
socket.on("client-joined", (name) => {
  if (!name) {
    name = "Guest"
  }
  output.innerHTML += setHtml(name, "success", "joined the chat!")
  output.scrollTop = output.scrollHeight
})
socket.on("client-disconnected-message", (client) => {
  console.log(`${client} has disconnected!`)
})

sendBtn.addEventListener("click", sendButtonHandler)
