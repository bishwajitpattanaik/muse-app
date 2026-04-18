# Muse

> One track. One album. Infinite vibes.

A clean, fast full-stack web app for streaming music. No noise — just your content, front and center.

---

## 💻 Tech Stack

**Frontend**

| Technology | Version | Purpose |
|---|---|---|
| React.js | ^18.x | UI library |
| React Router DOM | ^6.x | Page navigation |
| CSS | - | Styling & responsive design |

**Backend**

| Technology | Version | Purpose |
|---|---|---|
| Node.js | latest | Runtime environment |
| Express.js | ^5.2.1 | Web framework |
| MongoDB | - | Database |
| Mongoose | ^9.3.2 | MongoDB object modelling |
| Multer | ^2.1.1 | File upload handling |
| CORS | ^2.8.6 | Cross origin requests |
| Dotenv | ^17.3.1 | Environment variables |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.0.3 | Auth tokens |

**Cloud Services**

| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| ImageKit | Audio storage & delivery |

---

## ✨ Features

**🎧 Listener (role: `user`)**
- Register / Login
- Browse all tracks and albums
- View album tracks
- Play music via the Now Playing bar

**🎤 Artist (role: `artist`)**
- Everything a Listener can do, plus:
- Upload tracks (audio file via ImageKit)
- Create albums and select tracks for them

---

## 📁 Project Structure

```
Muse/
├── Backend/
│   └── src/
│       ├── db/
│       │   └── db.js                  # MongoDB connection using Mongoose
│       ├── models/
│       │   ├── user.model.js          # User schema (username, email, role)
│       │   ├── music.model.js         # Music schema (uri, title, artist)
│       │   └── album.model.js         # Album schema (title, musics[], artist)
│       ├── controllers/
│       │   ├── auth.controller.js     # Register, login, logout logic
│       │   └── music.controller.js    # Upload music, create album, fetch all
│       ├── routes/
│       │   ├── auth.routes.js         # Auth routes & middleware
│       │   └── music.routes.js        # Music routes & middleware
│       ├── middlewares/
│       │   └── auth.middleware.js     # authArtist, authUser guards
│       ├── services/
│       │   └── storage.service.js     # ImageKit upload service
│       ├── app.js                     # Express routes & middleware setup
│       └── .gitignore
├── package.json
└── server.js                          # Entry point
│
├── Frontend/
│   ├── public/                        # Static assets
│   └── src/
│       ├── context/
│       │   └── AuthContext.js         # Auth context & useAuth hook
│       ├── pages/
│       │   ├── AuthPage.jsx           # Login / Register page
│       │   ├── AuthPage.css
│       │   ├── Dashboard.jsx          # Feed, albums, upload pages
│       │   └── Dashboard.css
│       ├── services/
│       │   └── api.js                 # All API calls
│       ├── App.jsx                    # Root with auth state
│       ├── index.js                   # Entry point
│       └── index.css                  # Global styles
│   ├── index.html
│   └── package.json
```

---

## ⚙️ Setup & Installation

### 🔧 Backend

**1. Clone the repository**

```bash
git clone https://github.com/bishwajitpattanaik/muse.git
cd muse
```

**2. Install Backend dependencies**

```bash
cd Backend
npm install
```

**3. Configure environment variables**

Create a `.env` file inside the `Backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
PORT=3001
```

- Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your ImageKit keys from [ImageKit Dashboard](https://imagekit.io/dashboard)

**4. Start the Backend server**

```bash
npx nodemon server.js
```

> Server runs on `http://localhost:3001`

---

### 🎨 Frontend

**5. Install Frontend dependencies**

```bash
cd ../Frontend
npm install
```

**6. Start the Frontend**

```bash
npm run dev
```

> Frontend runs on `http://localhost:5173`

**7. Open in browser**

Visit `http://localhost:5173/` to start listening!

> Note: Both Backend and Frontend servers must be running simultaneously for the app to work correctly.

---

## 🔗 Backend API Endpoints

Base URL: `http://localhost:3001/api`

---

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required | Body |
|---|---|---|---|---|
| POST | `/api/auth/register` | Create a new account | No | `json: username, email, password, role` |
| POST | `/api/auth/login` | Login to account | No | `json: username, password` |
| POST | `/api/auth/logout` | Logout, clears JWT cookie | No | - |

**Example Request — POST `/api/auth/register`**

```json
{
  "username": "bishwajit",
  "email": "b@example.com",
  "password": "secret123",
  "role": "artist"
}
```

**Example Response — POST `/api/auth/login`**

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "abc123",
    "username": "bishwajit",
    "email": "b@example.com",
    "role": "artist"
  }
}
```

---

### 🎵 Music Routes — `/api/music`

| Method | Endpoint | Description | Auth Required | Body |
|---|---|---|---|---|
| POST | `/api/music/upload` | Upload an audio track | Artist only | `form-data: title, music` |
| POST | `/api/music/album` | Create an album | Artist only | `json: title, musics[]` |
| GET | `/api/music/` | Fetch all tracks | Any logged-in user | - |
| GET | `/api/music/albums` | Fetch all albums | Any logged-in user | - |
| GET | `/api/music/albums/:albumId` | Fetch a single album with full track list | Any logged-in user | - |

**Example Response — GET `/api/music/`**

```json
{
  "message": "Audios fetched successfully",
  "musics": [
    {
      "_id": "abc123",
      "uri": "https://ik.imagekit.io/your_id/track.mp3",
      "title": "My First Track",
      "artist": {
        "username": "bishwajit",
        "email": "b@example.com"
      }
    }
  ]
}
```

**Example Response — POST `/api/music/upload`**

```json
{
  "message": "Music created successfully",
  "music": {
    "id": "abc123",
    "uri": "https://ik.imagekit.io/your_id/track.mp3",
    "title": "My First Track",
    "artist": "user_id_here"
  }
}
```

**Example Response — GET `/api/music/albums/:albumId`**

```json
{
  "message": "Album fetched successfully",
  "album": {
    "_id": "alb456",
    "title": "My First Album",
    "artist": {
      "username": "bishwajit",
      "email": "b@example.com"
    },
    "musics": [
      {
        "_id": "abc123",
        "title": "My First Track",
        "uri": "https://ik.imagekit.io/your_id/track.mp3"
      }
    ]
  }
}
```

---

## 🖥️ Frontend Routes

| Route | Component | Description |
|---|---|---|
| `/` | `AuthPage.jsx` | Login or register |
| `/dashboard` | `Dashboard.jsx` | All tracks feed |
| `/dashboard/albums` | `Dashboard.jsx` | Albums view |
| `/dashboard/upload` | `Dashboard.jsx` | Upload a track *(artist only)* |
| `/dashboard/create-album` | `Dashboard.jsx` | Create album *(artist only)* |

**Frontend → Backend API Mapping**

| Frontend Action | Backend Endpoint |
|---|---|
| Register | POST `/api/auth/register` |
| Login | POST `/api/auth/login` |
| Logout | POST `/api/auth/logout` |
| Upload Track | POST `/api/music/upload` |
| Get All Tracks | GET `/api/music/` |
| Create Album | POST `/api/music/album` |
| Get All Albums | GET `/api/music/albums` |
| Get Album by ID | GET `/api/music/albums/:albumId` |

---

## 🗄️ Database Schema

**User Collection**

| Field | Type | Description |
|---|---|---|
| _id | ObjectId | Auto generated by MongoDB |
| username | String | Unique username |
| email | String | Unique email address |
| password | String | Hashed with bcryptjs |
| role | String | `user` or `artist` |

**Music Collection**

| Field | Type | Description |
|---|---|---|
| _id | ObjectId | Auto generated by MongoDB |
| uri | String | ImageKit URL of uploaded audio |
| title | String | Title of the track |
| artist | ObjectId | Reference to User collection |

**Album Collection**

| Field | Type | Description |
|---|---|---|
| _id | ObjectId | Auto generated by MongoDB |
| title | String | Album name |
| musics | ObjectId[] | Array of Music references |
| artist | ObjectId | Reference to User collection |

---

## 📝 Notes

- JWT is stored in an **HttpOnly cookie** (set by the backend), so `credentials: "include"` is used in every fetch call from the frontend.
- The `proxy` in `package.json` forwards `/api/*` calls to the Express server during development.
- Make sure the backend has CORS configured to allow `http://localhost:5173` with `credentials: true`.
- Roles are encoded in the JWT at login — middleware enforces `authArtist` and `authUser` guards on protected routes.

---

## 👤 Author

Built with ❤️ by **Bishwajit Pattanaik**

---

## 🛠️ Support

For issues or questions, open an issue in the repository — [github.com/bishwajitpattanaik/muse/issues](https://github.com/bishwajitpattanaik/muse/issues)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
