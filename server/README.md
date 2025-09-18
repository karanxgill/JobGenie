# JobGenie Server

This is the backend server for the JobGenie website. It provides API endpoints for managing study materials.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Configure the database:

Edit the `config.js` file to match your MySQL database settings:

```javascript
const config = {
    database: {
        host: 'localhost',
        user: 'root',
        password: '', // Set your MySQL password here
        database: 'jobgenie',
        port: 3306
    },
    server: {
        port: 3000
    }
};
```

3. Initialize the database:

```bash
node init-db.js
```

This will create the database, tables, and insert sample data.

4. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Study Notes

- `GET /api/study-materials/notes` - Get all study notes
- `POST /api/study-materials/notes` - Add a new study note
- `PUT /api/study-materials/notes/:id` - Update a study note
- `DELETE /api/study-materials/notes/:id` - Delete a study note

### E-Books

- `GET /api/study-materials/ebooks` - Get all e-books
- `POST /api/study-materials/ebooks` - Add a new e-book
- `PUT /api/study-materials/ebooks/:id` - Update an e-book
- `DELETE /api/study-materials/ebooks/:id` - Delete an e-book

### Videos

- `GET /api/study-materials/videos` - Get all videos
- `POST /api/study-materials/videos` - Add a new video
- `PUT /api/study-materials/videos/:id` - Update a video
- `DELETE /api/study-materials/videos/:id` - Delete a video

### Mock Tests

- `GET /api/study-materials/mock-tests` - Get all mock tests
- `POST /api/study-materials/mock-tests` - Add a new mock test
- `PUT /api/study-materials/mock-tests/:id` - Update a mock test
- `DELETE /api/study-materials/mock-tests/:id` - Delete a mock test

## Request and Response Examples

### Adding a new video

**Request:**

```http
POST /api/study-materials/videos
Content-Type: application/json

{
  "title": "Interview Preparation Guide",
  "description": "Tips and tricks for acing your job interview",
  "category": "interview",
  "video_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "thumbnail_image": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "featured": true
}
```

**Response:**

```json
{
  "id": 3,
  "message": "Video added successfully"
}
```

### Deleting a video

**Request:**

```http
DELETE /api/study-materials/videos/3
```

**Response:**

```json
{
  "message": "Video deleted successfully"
}
```

## Troubleshooting

If you encounter any issues, check the following:

1. Make sure MySQL is running
2. Verify your database credentials in `config.js`
3. Check the server logs for error messages

## License

This project is licensed under the MIT License.
