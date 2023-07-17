# WebSSH

WebSSH is a web-based SSH client using xterm.js, socket.io, and ssh2. 

## Installation

Before running WebSSH, you will need to install necessary dependencies. This project uses Node.js. If you don't have Node.js installed, you can download it from [https://nodejs.org](https://nodejs.org).

After installing Node.js, navigate to the project directory in your terminal and run the following command to install dependencies:

```npm install```

This will install all necessary packages including `fs`, `http`, `socket.io`, `path`, `xterm`, `xterm-addon-fit`, and `ssh2`.

## Running the Application

To start the application, use the following command:

```node server.js```

This command will start the server on port 8000.

## Accessing the Application

Once the server is running, you can access the application by opening your web browser and navigating to `localhost:8000`.

Enjoy using my simple implementation of the WebSSH!