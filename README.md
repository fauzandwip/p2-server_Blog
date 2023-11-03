[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=12633446&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

# Blog Website API Documentation

## Endpoints :

List of available endpoints:

- `POST /add-user`
- `POST /login`

- `GET /posts`
- `POST /posts`
- `GET /posts/:id`
- `PUT /posts/:id`
- `DELETE /posts/:id`
- `PATCH /posts/:id/img-url`

- `GET /categories`
- `POST /categories`
- `PUT /categories`

- `GET /pub/posts`
- `GET /pub/posts/:id`

&nbsp;

## 1. POST /add-user

Request:

- body:

```json
{
	"username": "string",
	"email": "string",
	"password": "string",
	"phoneNumber": "string",
	"address": "string"
}
```

_Response (201 - created)_

```json
{
  {
    "id": "integer",
    "email": "string"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Email already exists"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Password must be equal to or more than 5 characters"
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
	"email": "string",
	"password": "string"
}
```

_Response (200 - OK)_

```json
{
	"access_token": "string",
	"email": "string",
	"role": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
	"message": "Invalid email/password"
}
```

&nbsp;

## 3. GET /posts

Description:

- Get all posts from database

Request:

- headers:

```json
{
	"authorization": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "title": "Fight, Zatoichi, Fight (Zatôichi kesshô-tabi) (Zatôichi 8)",
    "content": "Beam Radiation of Spleen using Heavy Particles (Protons,Ions)",
    "imgUrl": "http://dummyimage.com/291x272.png/dddddd/000000",
    "categoryId": 1,
    "authorId": 6,
    "createdAt": "2023-01-03T01:18:04.000Z",
    "updatedAt": "2023-08-02T21:29:13.000Z",
    "Author": {
        "id": 6,
        "username": "staf2",
        "email": "staff2@gmail.com",
        "role": "staff",
        "phoneNumber": "089123456789",
        "address": "Tortuga, Switzerland",
        "createdAt": "2023-11-02T13:46:04.116Z",
        "updatedAt": "2023-11-02T13:46:04.116Z"
    }
  },
  {
    "id": 2,
    "title": "Jacob the Liar (Jakob, der Lügner)",
    "content": "Dilation of Sigmoid Colon, Percutaneous Approach",
    "imgUrl": "http://dummyimage.com/251x266.png/cc0000/ffffff",
    "categoryId": 2,
    "authorId": 8,
    "createdAt": "2022-11-29T10:08:11.000Z",
    "updatedAt": "2023-08-20T08:31:10.000Z",
    "Author": {
        "id": 8,
        "username": "staf4",
        "email": "staff4@gmail.com",
        "role": "staff",
        "phoneNumber": "089123456789",
        "address": "Tortuga, Switzerland",
        "createdAt": "2023-11-02T13:46:04.252Z",
        "updatedAt": "2023-11-02T13:46:04.252Z"
    }
  }
  ...,
]
```

&nbsp;

## 4. POST /posts

Description:

- Create post to database

Request:

- headers:

```json
{
	"authorization": "string"
}
```

- body:

```json
{
	"title": "string",
	"content": "string",
	"imgUrl": "string",
	"categoryId": "integer"
}
```

_Response (201 - Created)_

```json
{
	"id": 1,
	"title": "Fight, Zatoichi, Fight (Zatôichi kesshô-tabi) (Zatôichi 8)",
	"content": "Beam Radiation of Spleen using Heavy Particles (Protons,Ions)",
	"imgUrl": "http://dummyimage.com/291x272.png/dddddd/000000",
	"categoryId": 1,
	"authorId": 6,
	"createdAt": "2023-01-03T01:18:04.000Z",
	"updatedAt": "2023-08-02T21:29:13.000Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Title is required"
}
OR
{
  "message": "Content is required"
}
OR
{
  "message": "Category is required"
}
```

&nbsp;

## 5. GET /posts/:id

Description:

- Get post by id from database

Request:

- headers:

```json
{
	"authorization": "string"
}
```

- params:

```json
{
	"id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
	"id": 1,
	"title": "Fight, Zatoichi, Fight (Zatôichi kesshô-tabi) (Zatôichi 8)",
	"content": "Beam Radiation of Spleen using Heavy Particles (Protons,Ions)",
	"imgUrl": "http://dummyimage.com/291x272.png/dddddd/000000",
	"categoryId": 1,
	"authorId": 6,
	"createdAt": "2023-01-03T01:18:04.000Z",
	"updatedAt": "2023-08-02T21:29:13.000Z"
}
```

_Response (404 - Not Found)_

```json
{
	"message": "Post with id 1 not found"
}
```

&nbsp;
