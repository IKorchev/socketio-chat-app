const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const chosenColor = document.querySelector(".colorInput")
const notificationSound = document.querySelector("audio")
const username = prompt("Name:")

const formatDate = () => {
  let hours = new Date().getHours()
  let minutes = new Date().getMinutes()

  if (hours <= 9) {
    hours = `0${hours}`
  }
  if (minutes <= 9) {
    minutes = `0${minutes}`
  }
  return `${hours}:${minutes}`
}
const setHtml = (name, string) => {
  return `<li class="list-group-item mt-1 py-3">
<div class="d-flex flex-row justify-content-between">
  <div>
    <h4 class="d-inline">${name} ${string}</h4>
  </div>
  <i muted class="text-dark">${formatDate()}</i>
</div>
</li>`
}
const formatData = (data, color) => {
  output.innerHTML += `
  <li class="list-group-item mt-1 a${color}">
  <div class="d-flex flex-row justify-content-between">
    <div>
      <h4 class="d-inline a${color}">${data.name} </h4>
      <i class="fs-lg text-dark">says:</i>
    </div>
    <i muted class="text-dark">${formatDate()}</i>
  </div>
    <p class="mx-3 my-1 text-dark">${data.msg}</p>
  </li>`
  const array = document.querySelectorAll(`.a${color}`)
  array.forEach((item) => {
    item.style.color = `#${color}`
    item.style.borderColor = `#${color}`
  })
  output.scrollTop = output.scrollHeight
}

socket.on("connect", () => {
  socket.emit("send-username", username)
})
socket.on("client-disconnected", (name) => {
  output.innerHTML += setHtml(name, "has disconnected!")
})

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
  if (!data.msg || data.msg !== "") {
    formatData(data, data.color)
    socket.emit("client-message", data)
    message.value = ""
  }
}

socket.on("server-message", (data) => {
  formatData(data, data.color)
  notificationSound.play()
})
socket.on("client-joined", (name) => {
  if (!name) {
    name = "Guest"
  }
  output.innerHTML += setHtml(name, "has joined the chat!")
})

socket.on("client-disconnected-message", (client) => {
  console.log(`${client} has disconnected!`)
})

sendBtn.addEventListener("click", sendButtonHandler)
