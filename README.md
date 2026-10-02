# Product API

An Express.js REST API for managing products stored in the local `db.json` file. The application separates routing, request handling, business logic, database access, caching, and error handling.

## Setup

Requirements: Node.js and npm.

```bash
npm install
npm run server
```

The server runs at `http://localhost:3000`. To run without Nodemon:

```bash
npm start
```

## API

All endpoints use JSON. Send `Content-Type: application/json` with requests that contain a body.

### Read products

```http
GET /products
GET /products/:id
```

Example:

```bash
curl -i http://localhost:3000/products/2
```

A successful product response is:

```json
{
  "id": 2,
  "name": "Mouse",
  "price": 49.99
}
```

### Create a product

```http
POST /products
```

Request body:

```json
{
  "name": "Keyboard",
  "price": 49.99
}
```

Returns `201 Created`. The API assigns the next available numeric ID.

### Replace a product

```http
PUT /products/:id
```

The request may include `name` and `price`. Fields that are not provided keep their current values.

```json
{
  "name": "RGB Mechanical Keyboard",
  "price": 89.99
}
```

### Partially update a product

```http
PATCH /products/:id
```

Only the fields included in the request body are changed.

```json
{
  "price": 79.99
}
```

### Delete a product

```http
DELETE /products/:id
```

Returns a confirmation message and the deleted product.

### Errors

- `400`: required create fields are missing.
- `404`: the requested product does not exist.
- `500`: an unexpected application or database error occurred.

Example `404` response:

```json
{ "error": "Product not found" }
```

## Cache and request flow

Only `GET /products` and `GET /products/:id` use the cache.

1. The request enters the matching route in `routes/productRoutes.js`.
2. `cacheMiddleware` checks the request URL.
3. A valid entry returns immediately with `X-Cache: HIT`.
4. On a miss, the controller calls the product service and returns `X-Cache: MISS`.
5. The service reads `db.json` through `database/db.js`.
6. POST, PUT, PATCH, and DELETE write changes and clear all cached entries. The terminal logs `[CACHE INVALIDATED]`.

Cache entries are stored in memory for 60 seconds and disappear when the server restarts. Database reads include an intentional 1.5-second delay so cache hits are easy to observe.

## Project structure

```text
.
|-- Server.js
|   `-- Express setup, JSON parsing, route mounting, and startup
|-- routes/
|   `-- productRoutes.js
|       `-- Maps product URLs to controller handlers
|-- controller/
|   `-- productController.js
|       `-- Handles requests, responses, validation, and status codes
|-- services/
|   `-- productService.js
|       `-- Contains product lookup and mutation operations
|-- database/
|   `-- db.js
|       `-- Reads and writes db.json
|-- middleware/
|   |-- cacheMiddleware.js
|   |   `-- 60-second cache and cache invalidation
|   `-- errorMiddleware.js
|       `-- Centralized unexpected-error responses
|-- db.json
|   `-- Local product data
|-- package.json
|   `-- Scripts and project dependencies
`-- package-lock.json
    `-- Locked dependency versions
```

### Request flow

```text
Client
  |
  v
Server.js
  |
  v
routes/productRoutes.js
  |
  +--> cacheMiddleware.js  (GET requests)
  |
  v
productController.js
  |
  v
productService.js
  |
  v
database/db.js <--> db.json
  |
  v
errorMiddleware.js  (unexpected errors)
```

## Product data

Products are stored as a JSON array. Each product has a numeric `id`, a string `name`, and a numeric `price`.

```json
[
  { "id": 2, "name": "Mouse", "price": 49.99 }
]
```

Changes made through POST, PUT, PATCH, or DELETE are written directly to `db.json`.

## Testing manually

1. Start the server with `npm run server`.
2. Send the same GET request twice and check `X-Cache: MISS`, then `X-Cache: HIT`.
3. Update or delete that product.
4. Repeat the GET and confirm it returns `MISS` with the new data or `404` after deletion.

The project does not currently contain automated tests; `npm test` is still a placeholder script.
