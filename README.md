# Microfrontend Backend (Express)

This backend provides a simple REST API for the microfrontend example (product-listing, shopping-cart). It supports both an **in-memory** mode (default — no database) and a **MongoDB** mode (set `MONGO_URI` in `.env`).

## Features

- JWT auth (register/login)
- Products: list, get, create, update, delete
- Cart: get cart, add item, remove item
- Switch between in-memory (fast dev) or MongoDB by populating `MONGO_URI`.

## Quick start

1. Create `backend` folder under `microfrontend-root`
2. Copy the files shown in this canvas into their respective files.
3. In the `backend` folder run:

```bash
npm install
# or
pnpm install

# dev
npm run dev
```

4. (Optional) To use MongoDB, create `.env` with `MONGO_URI` and `JWT_SECRET`.

## Notes for microfrontends

- `product-listing` should call `/api/products` to fetch product list.
- `shopping-cart` should call `/api/cart` endpoints. When using in-memory mode, cart is tied to user id from JWT. For anonymous flows either login or extend controllers to accept a local cartId.
