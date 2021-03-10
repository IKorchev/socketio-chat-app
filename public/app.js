const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const inTheChat = document.querySelector(".in-the-chat")
const chosenColor = document.querySelector(".colorInput")
const notificationSound = document.querySelector("audio")
const body = document.querySelector("body")
const username = prompt("Name:")

window.onload = () => {
  message.focus()
}

const formattedDate = () => {
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

const setHtml = (name, background, string) => {
  return `<li class="client-action bg-${background} mt-1 p-3">
            <div class="d-flex flex-row justify-content-between">
              <div>
                <h4 class="d-inline">${name}</h4><span class="lead"> ${string} </span>
              </div>
              <i class="text-dark">${formattedDate()}</i>
            </div>
          </li>`
}
const formatData = (data, color, classname) => {
  output.innerHTML += `
  <li class="messages ${classname} mt-1">
    <div class="border-bottom border-dark p-1 d-flex flex-row justify-content-between">
      <div>
        <h5 class="d-inline a${color}">${data.name}</h5>
      </div>
      <i class="text-dark"><sup>${formattedDate()}</sup></i>
    </div>
    <p class="lead mx-3 pt-2 message-text">${data.msg}</p>
  </li>`
  const array = document.querySelectorAll(`.a${color}`)
  array.forEach((item) => {
    item.style.color = `#${color}`
    item.style.borderColor = `#${color}`
  })
  output.scrollTop = output.scrollHeight
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

socket.on("client-disconnected", (name) => {
  output.innerHTML += setHtml(name, "danger", "has disconnected!")
  output.scrollTop = output.scrollHeight
})

socket.on("connect", () => {
  socket.emit("send-username", username)
})

socket.on("all-usernames", (usernames) => {
  let html = ""
  usernames.forEach((user) => {
    html += `<li class="list-group-item users-in-chat"><strong>${user}</strong></li>`
  })
  inTheChat.innerHTML = html
  document.querySelectorAll(".users-in-chat").forEach((item) => {
    setTimeout(() => {
      item.classList.add("bla")
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
  output.innerHTML += setHtml(name, "success", "has joined the chat!")
  output.scrollTop = output.scrollHeight
})
socket.on("client-disconnected-message", (client) => {
  console.log(`${client} has disconnected!`)
})

sendBtn.addEventListener("click", sendButtonHandler)
