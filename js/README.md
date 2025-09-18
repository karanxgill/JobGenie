# JobGenie Client-Side API Integration

This document explains how to use the API service to interact with the backend server.

## API Service

The `api-service.js` file provides functions to interact with the backend API. It handles all the HTTP requests and responses.

## Usage

### Including the API Service

Include the API service in your HTML file:

```html
<script src="js/api-service.js"></script>
```

### Loading Data from the API

```javascript
// Study materials data from API
let studyNotesData = [];
let ebooksData = [];
let videosData = [];
let mockTestsData = [];

// Load data from API
async function loadDataFromApi() {
    try {
        // Load all data types
        studyNotesData = await apiService.getNotes();
        console.log('Loaded notes:', studyNotesData);
        
        ebooksData = await apiService.getEbooks();
        console.log('Loaded ebooks:', ebooksData);
        
        videosData = await apiService.getVideos();
        console.log('Loaded videos:', videosData);
        
        mockTestsData = await apiService.getMockTests();
        console.log('Loaded mock tests:', mockTestsData);
    } catch (error) {
        console.error('Error loading data from API:', error);
        throw error;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await loadDataFromApi();
        // Do something with the data
    } catch (error) {
        console.error('Error:', error);
    }
});
```

### Adding a New Item

```javascript
// Add a new video
async function addVideo(videoData) {
    try {
        const response = await apiService.addVideo(videoData);
        console.log('Video added:', response);
        return response;
    } catch (error) {
        console.error('Error adding video:', error);
        throw error;
    }
}

// Example usage
const newVideo = {
    title: 'Interview Tips',
    description: 'Tips for job interviews',
    category: 'interview',
    video_link: 'https://www.youtube.com/watch?v=example',
    thumbnail_image: 'https://i.ytimg.com/vi/example/maxresdefault.jpg',
    featured: true
};

addVideo(newVideo)
    .then(response => {
        console.log('Video added with ID:', response.id);
    })
    .catch(error => {
        console.error('Failed to add video:', error);
    });
```

### Updating an Item

```javascript
// Update a video
async function updateVideo(id, videoData) {
    try {
        const response = await apiService.updateVideo(id, videoData);
        console.log('Video updated:', response);
        return response;
    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }
}

// Example usage
const updatedVideo = {
    title: 'Updated Interview Tips',
    description: 'Updated tips for job interviews',
    category: 'interview',
    video_link: 'https://www.youtube.com/watch?v=updated',
    thumbnail_image: 'https://i.ytimg.com/vi/updated/maxresdefault.jpg',
    featured: true
};

updateVideo(1, updatedVideo)
    .then(response => {
        console.log('Video updated:', response);
    })
    .catch(error => {
        console.error('Failed to update video:', error);
    });
```

### Deleting an Item

```javascript
// Delete a video
async function deleteVideo(id) {
    try {
        const response = await apiService.deleteVideo(id);
        console.log('Video deleted:', response);
        return response;
    } catch (error) {
        console.error('Error deleting video:', error);
        throw error;
    }
}

// Example usage
deleteVideo(1)
    .then(response => {
        console.log('Video deleted:', response);
    })
    .catch(error => {
        console.error('Failed to delete video:', error);
    });
```

## API Endpoints

The API service provides the following functions:

### Notes

- `apiService.getNotes()` - Get all study notes
- `apiService.addNote(data)` - Add a new study note
- `apiService.updateNote(id, data)` - Update a study note
- `apiService.deleteNote(id)` - Delete a study note

### E-Books

- `apiService.getEbooks()` - Get all e-books
- `apiService.addEbook(data)` - Add a new e-book
- `apiService.updateEbook(id, data)` - Update an e-book
- `apiService.deleteEbook(id)` - Delete an e-book

### Videos

- `apiService.getVideos()` - Get all videos
- `apiService.addVideo(data)` - Add a new video
- `apiService.updateVideo(id, data)` - Update a video
- `apiService.deleteVideo(id)` - Delete a video

### Mock Tests

- `apiService.getMockTests()` - Get all mock tests
- `apiService.addMockTest(data)` - Add a new mock test
- `apiService.updateMockTest(id, data)` - Update a mock test
- `apiService.deleteMockTest(id)` - Delete a mock test

## Error Handling

The API service includes error handling. If an API request fails, it will throw an error with the error message from the server. You should always wrap API calls in try-catch blocks to handle errors properly.
