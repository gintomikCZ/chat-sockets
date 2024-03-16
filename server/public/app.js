const socket = io('https:///chat-sockets-fmad.onrender.com')

const activity = document.querySelector('.activity')
const msgInput = document.querySelector('#message')
const nameInput = document.querySelector('#name')
const chatRoom = document.querySelector('#room')
const usersList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')


function sendMessage (e) {
  e.preventDefault()
  if (nameInput.value && msgInput.value && chatRoom.value) {
    socket.emit('message', {
      'text': msgInput.value,
      'name': nameInput.value
    })
    msgInput.value = ''
  }
  msgInput.focus()
}

function enterRoom (e) {
  e.preventDefault()
  if (nameInput.value && chatRoom.value) {
    socket.emit('enterRoom', {
      'text': msgInput.value,
      'room': chatRoom.value
    })
  }
}

document.querySelector('.form-msg')
  .addEventListener('submit', sendMessage)

document.querySelector('.form-join')
  .addEventListener('submit', enterRoom)

msgInput.addEventListener('keypress', () => {
  socket.emit('activity', nameInput.value)
})

socket.on('message', (data) => {
  activity.textContent = ''
  const { name, text, time } = data
  const li = document.createElement('li')
  li.className = 'post'
  if (name === nameInput.value) li.className = 'post post--left'
  if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right'
  if (name !== 'Admin') {
    li.innerHTML = `<div class="post__header ${name === nameInput.value ? 'post __header--user' : 'post__header--reply'}">
    <span class="post__header--name">${name}</span>
    <span class="post__header--time">${time}</span>
    </div>
    <div class="post__text>${text}</div>`
  } else {
    li.innerHTML = `<div class="post__text">${text}</div>`
  }
  chatDisplay.appendChild(li)
  chatDisplay.scrollTop = chatDisplay.scrollHeight
})

let activityTimer

socket.on('activity', (name) => {
  activity.textContent = `${name} is typing ...`
  clearTimeout(activityTimer)
  activitTimer = setTimeout(() => {
    activity.textContent = ''
  }, 3000)
})

socket.on('userList', ({ users }) => {
  showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
  showRooms(rooms)
})

function showUsers (users) {
  usersList.textContent = ''
  if (users) {
    usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
    users.forEach((user, i) => {
      usersList.textContent += `${user.name}`
      if (users.length > 1 && i !== users.length - 1) {
        usersList.textContent += ', '
      }
    })
  }
}

function showRooms (rooms) {
  roomList.textContent = ''
  if (rooms) {
    roomList.innerHTML = `<em>Active rooms:</em>`
    rooms.forEach((room, i) => {
      roomList.textContent += `${room}`
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.textContent += ', '
      }
    })
  }
}