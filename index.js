// file system modules
const fs = require("fs");
// webserver
const http = require("http");

////////////////////////////////////////////////////
// Files
////////////////////////////////////////////////////

// Blocking
// read from files
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

// write to files
const textOut = `This is what we know about hte avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");

// Non-Blocking
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
	if (err) return console.log("ERROR!!!");

	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
		console.log(data2);
		fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
			console.log(data3);

			// writting
			fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", error => {
				console.log("Written");
			});
		});
		console.log("Reading Again...");
	});
	console.log("Still Reading...");
});
console.log("Reading...");

////////////////////////////////////////////////////
// Server
////////////////////////////////////////////////////

// req: request
// res: response
const server = http.createServer((req, res) => {
	// console.log(req);
	res.end("Hello from the server");
});

// port, host(default localhost address), callback function(optional)
server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
