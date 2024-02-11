# PS8

The code of this repo is split in 2 folders:
* api/ manages the server. It contains a server which differentiate REST requests from HTTP file requests, and so
return either files or REST responses accordingly.
* front/ contains static files that should be returned by the HTTP server mentioned earlier.

Both folders contain a README with more details.

---

## Requirements to run the project

* [Node.js](https://nodejs.org/) should be installed.
* The repo should have been cloned.

---

## First launch

Not much in there, just launch `npm install` to install the dependencies for the server.

Note that this command should be run again every time you install / delete a package.

---

## All runs

Run `npm start`. That's it, unless you need other scripts to run before or while the server is launched,
but then you (probably?) know what you are doing.

## Start The project

To start and build the project, navigate to the root folder of the project and run `docker-compose up --build -d`. This command will build the code and automatically execute `npm start` by running the script.

## Choosing the play mode

To choose the play mode, users need to visit the following URL: `http://localhost:8000/src/mode/mode.html`. From this page, players can log in or sign up and choose between the local mode or playing against an AI.