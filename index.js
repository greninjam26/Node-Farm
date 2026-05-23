// file system modules
const fs = require("fs");
// webserver
const http = require("http");
const url = require("url");

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

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);

	if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

	return output;
};

// we can keep it syncrinsis, blocking the code doesn't matter in this case
// the top level code is only run once at the start anyway
// __dirname, will make the path start from the folder the current script is located in
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8",
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8",
);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// req: request
// res: response
// this will be run once at every request
const server = http.createServer((req, res) => {
	const pathname = req.url;

	// Overview page
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "content-type": "text/html" });

		const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
		const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);

		res.end(output);
	}
	// Product page
	else if (pathname == "/product") {
		res.writeHead(200, { "content-type": "text/html" });

		const productHTML = dataObj.map(el => replaceTemplate(tempProduct, el)).join("");

		res.end(productHTML);
	}
	// API
	else if (pathname == "/api") {
		// this is not efficient, because everytime something go to the route, the data is fetched
		// we should keep the fetching outside and only do it once
		// fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (error, data) => {
		// 	const productData = JSON.parse(data);
		// 	res.writeHead(200, { "content-type": "application/json" });
		// 	res.end(data);
		// });
		res.writeHead(200, { "content-type": "application/json" });
		res.end(data);
	}
	// Not Found page
	else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello-world",
		});
		res.end("<h1>Page not Found!</h1>");
	}
});

// port, host(default localhost address), callback function(optional)
server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
