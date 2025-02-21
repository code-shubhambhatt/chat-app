const socket = io("https://chat-app-0i4i.onrender.com");

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

const username = prompt('Enter your username:');
const room = 'General';
socket.emit('joinRoom', { username, room });

socket.on('message', (data) => {
    if (typeof data === 'string') {
        data = { username: 'Server', message: data, time: formatTime(new Date()) };
    } else {
        data.time = formatTime(new Date());
    }
    
    const messageElement = document.createElement('div');
    messageElement.classList.add("flex", "items-end", "gap-2", "p-2", "rounded-lg", "bg-gray-600", "animate-slideUp");

    messageElement.innerHTML = `
        <span class="font-semibold text-orange-400">${data.username}:</span>
        <span class="text-white">${data.message}</span>
        <span class="text-xs text-gray-300">${data.time}</span>
    `;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('chatMessage', { room, username, message });
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

// Function to format time in hh:mm AM/PM format (No emoji)
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Convert to 12-hour format
    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero

    return `${hours}:${minutes} ${ampm}`;
}
