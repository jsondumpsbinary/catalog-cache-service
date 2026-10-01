# Product API

A small Express.js REST API for reading products from a local JSON file. The project demonstrates a layered Node.js application with routes, controllers, services, a file-backed data access module, and an in-memory response cache.

## Features

- List all products.
- Retrieve one product by numeric ID.
- Read product data from `db.json` without an external database.
- Add a simulated 1.5-second data-access delay to make cache behavior observable.
- Cache responses in memory for 60 seconds.
- Report cache status with the `X-Cache` response header.
- Return JSON responses and standard error status codes.

## Requirements

- Node.js 18 or newer is recommended.
- npm, which is included with Node.js.

## Installation

Clone or download the project, then install its dependencies from the project root:

```bash
npm install
```

## Running the server

Start the development server with Nodemon:

```bash
npm run server
```

Start the server directly with Node.js:

```bash
npm start
```

The API listens on port `3000` by default:

```text
http://localhost:3000
```

When the server starts successfully, it prints:

```text
Example app listening on port 3000
```

There is currently no environment-variable configuration for the port. To use another port, change the `port` constant in `Server.js`.

## API Endpoints

### Get all products

```http
GET /products
```

Example request:

```bash
curl -i http://localhost:3000/products
```

Example response on a cache miss:

```json
[
	{ "id": 1, "name": "Keyboard", "price": 49.99 },
	{ "id": 2, "name": "Mouse", "price": 19.99 },
	{ "id": 3, "name": "Monitor", "price": 199 },
	{ "id": 4, "name": "Mouse", "price": 19 }
]
```

### Get a product by ID

```http
GET /products/:id
```

Example request:

```bash
curl -i http://localhost:3000/products/1
```

Example successful response:

```json
{
	"id": 1,
	"name": "Keyboard",
	"price": 49.99
}
```

The ID is converted to a number before it is compared with the IDs in `db.json`.

### Error responses

If the requested product does not exist, the API returns `404 Not Found`:

```json
{
	"error": "Product not found"
}
```

Unexpected errors in a controller return `500 Internal Server Error`:

```json
{
	"error": "Internal Server Error"
}
```

## Caching

Caching is applied to both product routes by `middleware/cacheMiddleware.js`.

- Cache keys use the complete request URL, such as `/products` or `/products/1`.
- Entries remain valid for 60 seconds.
- The cache is stored in process memory and is lost whenever the server restarts.
- There is no cache persistence, distributed cache, or invalidation endpoint.
- The first request for a URL is logged as a cache miss and sends `X-Cache: MISS`.
- A repeated request within 60 seconds is logged as a cache hit and sends `X-Cache: HIT`.
- Expired entries are removed when that URL is requested again.

The current middleware serializes the internal cache entry on a cache hit. Therefore, a cache-hit body has this shape:

```json
{
	"value": {
		"id": 1,
		"name": "Keyboard",
		"price": 49.99
	},
	"createdAt": 1790841600000
}
```

On a cache miss, the controller returns the product or product array directly. This difference is part of the current implementation and should be normalized if clients require an identical response body for hits and misses.

## Project structure

```text
.
├── Server.js                       # Express application entry point
├── package.json                    # Scripts and dependencies
├── db.json                         # Local product data
├── controller/
│   └── productController.js        # HTTP request and response handling
├── database/
│   └── db.js                       # Reads and parses db.json
├── middleware/
│   └── cacheMiddleware.js          # In-memory cache and 60-second TTL
├── routes/
│   └── productRoutes.js            # Product route definitions
└── services/
		└── productService.js           # Product lookup operations
```

## Request flow

```text
HTTP request
		|
		v
Server.js -> /products router
		|
		v
cacheMiddleware
		| cache hit                  | cache miss
		v                            v
cached response            productController
																 |
																 v
													productService
																 |
																 v
														database/db.js
																 |
																 v
															db.json
```

The application enables `express.json()`, although the current API only exposes GET endpoints and does not accept a request body.

## Data format

Products are stored as a JSON array in `db.json`. Each product currently contains:

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Unique product identifier used by `/products/:id` |
| `name` | string | Product name |
| `price` | number | Product price |

Example:

```json
[
	{ "id": 1, "name": "Keyboard", "price": 49.99 }
]
```

If `db.json` contains invalid JSON or cannot be read, the database module logs the error. Requests may then fail in the controller and return a 500 response.

## Useful commands

```bash
# Install dependencies
npm install

# Start with automatic restart on file changes
npm run server

# Start once without Nodemon
npm start

# Check the collection endpoint
curl -i http://localhost:3000/products

# Check one product
curl -i http://localhost:3000/products/1
```

## Troubleshooting

### `npm error Missing script: "server"`

Run the command from the project root, where `package.json` is located. The current package defines `npm run server` and `npm start`.

### `EADDRINUSE: address already in use :::3000`

Another process is already using port 3000. Stop that process, or change the `port` constant in `Server.js`.

### `Cannot find module ...`

Run `npm install` from the project root and verify that relative imports match the directory structure shown above.

### Requests appear slow

The database module intentionally waits 1.5 seconds before reading `db.json`. Repeat the same request within 60 seconds to observe the in-memory cache behavior.

## Testing status

The project does not currently include automated tests. The `npm test` script is still the default placeholder and exits with an error. Manual smoke testing can be performed with the `curl` commands above.

## License

This project currently uses the `ISC` license value declared in `package.json`.
