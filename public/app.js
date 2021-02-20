const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const chosenColor = document.querySelector(".colorInput")

const username = prompt("Your name please ?")

const formatData = (data, nameOfClass) => {
  output.innerHTML += `
  <li class="list-group-item">
    <h5 class="d-inline ${nameOfClass}">${data.name} </h5><i>says:</i>
    <p class="mx-3 my-1">${data.msg}</p>
  </li>`
  const array = document.querySelectorAll(`.${nameOfClass}`)
  array.forEach((item) => {
    item.style.color = data.color
  })
}

sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const data = {
    color: chosenColor.value,
    name: username,
    msg: message.value,
  }
  if (data.msg !== "" && data.name !== "") {
    socket.emit("client-message", data)
    formatData(data, "myName")
    message.value = ""
  } else {
    alert("Something went wrong! Please make sure to type your name and message to send!")
  }
})

socket.on("server-message", (data) => {
  formatData(data, "nameFromServer")
})
