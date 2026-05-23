// file system modules
const fs = require("fs");
// webserver
const http = require("http");
const url = require("url");
// modules
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////////////////////////
// Server
////////////////////////////////////////////////////

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

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));

console.log(slugs);

// req: request
// res: response
// this will be run once at every request
const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

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
		// this works because we assume the id of the element matches the location it is in the data array
		const product = dataObj[query.id];
		if (!product) return res.end("<h1>Product not found!</h1>");
		const output = replaceTemplate(tempProduct, product);

		res.end(output);
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
