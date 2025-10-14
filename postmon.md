# API Documentation

## Base URL

```
http://localhost:4000/api
```

---

## Authentication

### Register

- **Endpoint:** `/auth/register`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "username": "testuser",
    "password": "testpass"
  }
  ```
- **Response:**
  ```json
  {
    "id": "USER_ID",
    "username": "testuser"
  }
  ```

---

### Login

- **Endpoint:** `/auth/login`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "username": "testuser",
    "password": "testpass"
  }
  ```
- **Response:**
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": "USER_ID",
      "username": "testuser"
    }
  }
  ```

---

## Products

### List Products

- **Endpoint:** `/products`
- **Method:** `GET`
- **Response:**
  ```json
  [
    {
      "id": "1",
      "title": "T-shirt",
      "description": "Comfortable cotton",
      "price": 399,
      "image": "",
      "stock": 10
    },
    ...
  ]
  ```

---

### Get Product by ID

- **Endpoint:** `/products/{id}`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": "1",
    "title": "T-shirt",
    "description": "Comfortable cotton",
    "price": 399,
    "image": "",
    "stock": 10
  }
  ```

---

### Create Product

- **Endpoint:** `/products`
- **Method:** `POST`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON):**
  ```json
  {
    "title": "New Product",
    "description": "Product description",
    "price": 100,
    "image": "",
    "stock": 10
  }
  ```
- **Response:**  
  Product object

---

### Update Product

- **Endpoint:** `/products/{id}`
- **Method:** `PUT`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON):**
  ```json
  {
    "title": "Updated Product",
    "price": 150
  }
  ```
- **Response:**  
  Updated product object

---

### Delete Product

- **Endpoint:** `/products/{id}`
- **Method:** `DELETE`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  { "message": "deleted" }
  ```

---

## Cart

### Get Cart

- **Endpoint:** `/cart`
- **Method:** `GET`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Response:**  
  Cart object

---

### Add to Cart

- **Endpoint:** `/cart`
- **Method:** `POST`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Body (JSON):**
  ```json
  {
    "productId": "PRODUCT_ID",
    "quantity": 2
  }
  ```
- **Response:**  
  Updated cart object

---

### Remove from Cart

- **Endpoint:** `/cart/{productId}`
- **Method:** `DELETE`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Response:**  
  Updated cart object

---

## Notes

- Replace `{id}` and `{productId}` with actual IDs.
- Replace `<JWT_TOKEN>` with the token received from login.
- All
