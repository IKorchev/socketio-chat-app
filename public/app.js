const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const chosenColor = document.querySelector(".colorInput")
const notificationSound = document.querySelector("audio")
const username = prompt("Your name please ?")

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

sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const data = {
    color: chosenColor.value.slice(1, 7),
    name: username,
    msg: message.value,
  }
  if (data.name == "") {
    data.name = "Guest"
  }
  if (data.msg !== "") {
    formatData(data, data.color)
    socket.emit("client-message", data)
    message.value = ""
  } else {
    alert("Something went wrong! Please make sure to type your name and message to send!")
  }
})

socket.on("server-message", (data) => {
  formatData(data, data.color)
  notificationSound.play()
})
