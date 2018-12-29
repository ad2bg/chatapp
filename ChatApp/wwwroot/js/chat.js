"use strict";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .configureLogging(signalR.LogLevel.Information) // Error=> errors only; Warning=> W+Errors; Information=>I+W+E; Trace=> everything, incl. the data
    .build();

connection
    .start()
    .catch((err) => console.error(err.toString()));

connection.onclose(async () => { await start(); });

async function start() {
    const now = new Date();

    try {
        await connection.start();
        console.log('connected ' + now.toUTCString);
    } catch (err) {
        console.log(`${now.toUTCString}\n${err}`);
        setTimeout(() => start(), 5000);
    }
};


// receive a message
connection.on("ReceiveMessage", (user, message) => {

    const msg = escapeHtml(message);

    const encodedMsg = user + " says " + msg;
    const li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

document.getElementById("sendButton")
    .addEventListener("click", (event) => {

        event.preventDefault();

        const user = document.getElementById("userInput").value;
        const message = document.getElementById("messageInput").value;

        connection
            .invoke("SendMessage", user, message) // invoking the Hub's SendMessage method
            .catch(err => console.error(err.toString()));

    });


function escapeHtml(unsafe) {    return unsafe        .replace(/&/g, "&amp;")        .replace(/</g, "&lt;")        .replace(/>/g, "&gt;")        .replace(/"/g, "&quot;")        .replace(/'/g, "&#039;");}
