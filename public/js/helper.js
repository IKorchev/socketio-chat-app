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
                  <h4 class="d-inline"><i class="bi bi-person-fill"></i> ${name}</h4><span class="lead"> ${string} </span>
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
  // Make sure page scrolls down as messages come
  output.scrollTop = output.scrollHeight
}
