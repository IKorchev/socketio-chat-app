const socket = io()
const output = document.querySelector(".output")
const message = document.querySelector(".message")
const sendBtn = document.querySelector(".sendBtn")
const msgForm = document.querySelector(".messageForm")
const chosenColor = document.querySelector(".colorInput")

const username = prompt("Your name please ?")

const formatData = (data, h5ClassName, listItemClassName) => {
  output.innerHTML += `
  <li class="list-group-item ${listItemClassName}">
    <h5 class="d-inline ${h5ClassName}">${data.name} </h5><i>says:</i>
    <p class="mx-3 my-1">${data.msg}</p>
  </li>`
  const array = document.querySelectorAll(`.${h5ClassName}`)
  array.forEach((item) => {
    item.style.color = data.color
  })
  const listItems = document.querySelectorAll(`.${listItemClassName}`)
  listItems.forEach((item) => {
    item.style.borderColor = data.color
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
    formatData(data, "myName", "list-item")
    message.value = ""
  } else {
    alert("Something went wrong! Please make sure to type your name and message to send!")
  }
})

socket.on("server-message", (data) => {
  formatData(data, "nameFromServer", "other-list-item")
})
