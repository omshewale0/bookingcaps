# Backend Documentation

## API Endpoints

### User Endpoints

| Method | Endpoint | Description | Required Body / Headers |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/register` | Register a new user | `email`, `fullname` (min 3 chars), `password` (min 6 chars) |
| `POST` | `/user/login` | Login existing user | `email`, `password` (min 6 chars) |
| `GET` | `/user/profile` | Get user profile | **Header**: `Authorization: Bearer <token>` or Cookie `token` |
| `GET` | `/user/logout` | Logout user | **Header**: `Authorization: Bearer <token>` or Cookie `token` |

### Captain Endpoints

| Method | Endpoint | Description | Required Body / Headers |
| :--- | :--- | :--- | :--- |
| `POST` | `/captain/register` | Register a new captain | `email`, `fullname` (min 3 chars), `password` (min 6 chars), `mobile` (min 10 chars), `vehicle` object |
| `POST` | `/captain/login` | Login existing captain | `email`, `password` (min 6 chars) |
| `GET` | `/captain/profile` | Get captain profile | **Header**: `Authorization: Bearer <token>` or Cookie `token` |
| `GET` | `/captain/logout` | Logout captain | **Header**: `Authorization: Bearer <token>` or Cookie `token` |

#### Captain Registration Body Example
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "vehicle": {
    "color": "Red",
    "numberplate": "AB-12-CD-3456",
    "vehicletype": "car",
    "year": "2020",
    "capacity": 4
  }
}
```

## Setup & Run

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create `.env` file with `DB_CONNECT` and `JWT_SECRET`.
3.  Run development server:
    ```bash
    npm run dev
    ```
