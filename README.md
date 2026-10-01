# Product API

A small Express.js API that reads products from `db.json`. It uses separate route, controller, service, database, and middleware layers.

## Setup

Requirements: Node.js and npm.

```bash
npm install
npm run server
```

The server runs at `http://localhost:3000`. To start it without Nodemon, use:

```bash
npm start
```

## Endpoints

### Get all products

```http
GET /products
```

```bash
curl -i http://localhost:3000/products
```

### Get one product

```http
GET /products/:id
```

```bash
curl -i http://localhost:3000/products/1
```

Successful response:

```json
{
  "id": 1,
  "name": "Keyboard",
  "price": 49.99
}
```

If the product does not exist, the API returns `404`:

```json
{ "error": "Product not found" }
```

Unexpected errors return `500`:

```json
{ "error": "Internal Server Error" }
```

## Caching

Both endpoints use an in-memory cache with a 60-second lifetime.

- `X-Cache: MISS` indicates that data was read from `db.json`.
- `X-Cache: HIT` indicates that a cached entry was used.
- The cache is cleared when the server restarts.
- The first database read includes an intentional 1.5-second delay.

## Data format

Products are stored as an array in `db.json`:

```json
[
  { "id": 1, "name": "Keyboard", "price": 49.99 }
]
```

Each product has a numeric `id`, a string `name`, and a numeric `price`.

## Project structure

```text
Server.js                    # Express application
routes/productRoutes.js      # Product routes
controller/productController.js
services/productService.js   # Product operations
database/db.js               # Reads db.json
middleware/cacheMiddleware.js
db.json                      # Product data
```

## Troubleshooting

- Run commands from the project root, where `package.json` is located.
- If port `3000` is busy, stop the other process or change the port in `Server.js`.
- The project currently has no automated tests. `npm test` is a placeholder script.
