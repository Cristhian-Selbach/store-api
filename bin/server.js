const app = require("../src/app");
const debug = require("debug")("nodestr:server");
const http = require("http");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
console.warn("Running on port " + port);
onListening();

function normalizePort(val) {
	const port = parseInt(val, 10);

	if(isNaN(port)) {
		return val;
	}

	if(port >= 0) {
		return port;
	}

	return false;
}

function onListening() {
	const addr = server.address();
	const bind = typeof addr === "string"
		? "pipe" + addr
		: "port" + addr.port;
	debug("Listering on " + bind);
}