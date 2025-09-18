/**
 * API Service for JobGenie
 * This file contains functions to interact with the backend API
 */

// API base URL - change this to your server URL
// IMPORTANT: If your backend runs on a different port or domain, update this URL accordingly.
// For example, if your backend runs on port 5000, use:
// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generic function to make API requests
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Request body data (for POST and PUT requests)
 * @param {number} timeout - Request timeout in milliseconds (default: 10000)
 * @returns {Promise} - Promise that resolves to the API response
 */
async function apiRequest(endpoint, method = 'GET', data = null, timeout = 10000) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`Making ${method} request to: ${url}`);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            signal: controller.signal
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
            console.log('Request body:', data);
        }

        try {
            const response = await fetch(url, options);
            // Clear timeout since request completed
            clearTimeout(timeoutId);

            console.log(`Response status: ${response.status} ${response.statusText}`);

            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                let errorMessage = `API request failed with status ${response.status}`;

                // Add specific handling for common status codes
                if (response.status === 404) {
                    errorMessage = `Resource not found (404): The requested ${endpoint.split('/').pop()} does not exist`;
                }

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('Error response data:', errorData);
                } catch (jsonError) {
                    console.error('Could not parse error response as JSON:', jsonError);
                }

                throw new Error(errorMessage);
            }

            // For DELETE requests, some APIs might return no content
            if (method === 'DELETE' && response.status === 204) {
                return { success: true, message: 'Resource deleted successfully' };
            }

            // Try to parse JSON response
            try {
                const jsonResponse = await response.json();
                console.log('Response data:', jsonResponse);
                return jsonResponse;
            } catch (jsonError) {
                console.warn('Response is not JSON:', jsonError);
                return { success: true };
            }
        } catch (fetchError) {
            // Clear timeout to prevent memory leaks
            clearTimeout(timeoutId);

            // Check if it's an abort error (timeout)
            if (fetchError.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms. The server might be down or overloaded.`);
            }

            throw fetchError;
        }
    } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error);

        // Enhance error message for common issues
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error(`Server connection failed. Please check if the server is running at ${API_BASE_URL}`);
        }

        throw error;
    }
}

/**
 * Study Materials API
 */
const studyMaterialsApi = {
    // Notes
    getNotes: async () => {
        try {
            // Try to get data from API
            return await apiRequest('/study-materials/notes');
        } catch (error) {
            console.warn('Failed to fetch notes from API, using mock data:', error);
            // Return mock data if API fails
            return getMockStudyMaterials('notes');
        }
    },
    getNote: async (id) => {
        try {
            return await apiRequest(`/study-materials/notes/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch note ${id} from API, using mock data:`, error);
            const notes = getMockStudyMaterials('notes');
            return notes.find(note => note.id === id) || null;
        }
    },
    addNote: (data) => apiRequest('/study-materials/notes', 'POST', data),
    updateNote: (id, data) => apiRequest(`/study-materials/notes/${id}`, 'PUT', data),
    deleteNote: (id) => apiRequest(`/study-materials/notes/${id}`, 'DELETE'),

    // Ebooks
    getEbooks: async () => {
        try {
            // Try to get data from API
            return await apiRequest('/study-materials/ebooks');
        } catch (error) {
            console.warn('Failed to fetch ebooks from API, using mock data:', error);
            // Return mock data if API fails
            return getMockStudyMaterials('ebooks');
        }
    },
    getEbook: async (id) => {
        try {
            return await apiRequest(`/study-materials/ebooks/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch ebook ${id} from API, using mock data:`, error);
            const ebooks = getMockStudyMaterials('ebooks');
            return ebooks.find(ebook => ebook.id === id) || null;
        }
    },
    addEbook: (data) => apiRequest('/study-materials/ebooks', 'POST', data),
    updateEbook: (id, data) => apiRequest(`/study-materials/ebooks/${id}`, 'PUT', data),
    deleteEbook: (id) => apiRequest(`/study-materials/ebooks/${id}`, 'DELETE'),

    // Videos
    getVideos: async () => {
        try {
            // Try to get data from API
            return await apiRequest('/study-materials/videos');
        } catch (error) {
            console.warn('Failed to fetch videos from API, using mock data:', error);
            // Return mock data if API fails
            return getMockStudyMaterials('videos');
        }
    },
    getVideo: async (id) => {
        try {
            return await apiRequest(`/study-materials/videos/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch video ${id} from API, using mock data:`, error);
            const videos = getMockStudyMaterials('videos');
            return videos.find(video => video.id === id) || null;
        }
    },
    addVideo: (data) => apiRequest('/study-materials/videos', 'POST', data),
    updateVideo: (id, data) => apiRequest(`/study-materials/videos/${id}`, 'PUT', data),
    deleteVideo: async (id) => {
        try {
            console.log(`Attempting to delete video with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/study-materials/videos/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteVideo for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete video: ${error.message}`);
        }
    },

    // Mock Tests
    getMockTests: async () => {
        try {
            // Try to get data from API
            return await apiRequest('/study-materials/mock-tests');
        } catch (error) {
            console.warn('Failed to fetch mock tests from API, using mock data:', error);
            // Return mock data if API fails
            return getMockStudyMaterials('mock-tests');
        }
    },
    getMockTest: async (id) => {
        try {
            return await apiRequest(`/study-materials/mock-tests/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch mock test ${id} from API, using mock data:`, error);
            const mockTests = getMockStudyMaterials('mock-tests');
            return mockTests.find(test => test.id === id) || null;
        }
    },
    addMockTest: (data) => apiRequest('/study-materials/mock-tests', 'POST', data),
    updateMockTest: (id, data) => apiRequest(`/study-materials/mock-tests/${id}`, 'PUT', data),
    deleteMockTest: (id) => apiRequest(`/study-materials/mock-tests/${id}`, 'DELETE')
};



/**
 * Jobs API
 */
const jobsApi = {
    // Get all jobs with optional filters
    getJobs: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            if (filters.status) {
                queryParams.append('status', filters.status);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/jobs${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch jobs from API, using mock data:', error);
                // Return mock data if API fails
                const mockJobs = healthCheckApi.getMockData('jobs');

                // Apply filters to mock data
                let filteredJobs = mockJobs;

                if (filters.category) {
                    filteredJobs = filteredJobs.filter(job =>
                        job.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredJobs = filteredJobs.filter(job => job.featured === filters.featured);
                }

                if (filters.status) {
                    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
                }

                return filteredJobs;
            }
        } catch (error) {
            console.error('Error in getJobs:', error);
            return [];
        }
    },

    // Get a job by ID
    getJob: async (id) => {
        try {
            return await apiRequest(`/jobs/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch job ${id} from API, using mock data:`, error);
            const mockJobs = healthCheckApi.getMockData('jobs');
            return mockJobs.find(job => job.id === id || job.id === `job-${id}`) || null;
        }
    },

    // Alias for getJob to maintain compatibility with existing code
    getJobById: async (id) => {
        try {
            return await apiRequest(`/jobs/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch job ${id} from API, using mock data:`, error);
            const mockJobs = healthCheckApi.getMockData('jobs');
            return mockJobs.find(job => job.id === id || job.id === `job-${id}`) || null;
        }
    },

    // Add a new job
    addJob: async (data) => {
        try {
            console.log('Adding new job with data:', data);

            // Add debug log if available
            if (typeof window.debugLog === 'function') {
                window.debugLog('Adding new job with data: ' + JSON.stringify(data).substring(0, 100) + '...');
            }

            // Ensure posted_date is set
            if (!data.posted_date) {
                data.posted_date = new Date().toISOString();
                console.log('Added posted_date:', data.posted_date);

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Added posted_date: ' + data.posted_date);
                }
            }

            // Generate a unique request ID to track this specific request
            const requestId = 'job_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            console.log(`Starting job creation request (ID: ${requestId})`);

            if (typeof window.debugLog === 'function') {
                window.debugLog(`Starting job creation request (ID: ${requestId})`);
            }

            // Make the API request
            const result = await apiRequest('/jobs', 'POST', data);

            console.log(`Job creation successful (Request ID: ${requestId})`, result);

            if (typeof window.debugLog === 'function') {
                window.debugLog(`Job creation successful (Request ID: ${requestId})`);
            }

            return result;
        } catch (error) {
            console.error('Error in addJob:', error);

            if (typeof window.debugLog === 'function') {
                window.debugLog('Error in addJob: ' + error.message);
            }

            // Rethrow with more specific message
            throw new Error(`Failed to add job: ${error.message}`);
        }
    },

    // Update a job
    updateJob: (id, data) => apiRequest(`/jobs/${id}`, 'PUT', data),

    // Delete a job
    deleteJob: async (id) => {
        try {
            console.log(`Attempting to delete job with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/jobs/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteJob for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete job: ${error.message}`);
        }
    }
};

/**
 * Results API
 */
const resultsApi = {
    // Get all results with optional filters
    getResults: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/results${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch results from API, using mock data:', error);
                // Return mock data if API fails
                const mockResults = healthCheckApi.getMockData('results');

                // Apply filters to mock data
                let filteredResults = mockResults;

                if (filters.category) {
                    filteredResults = filteredResults.filter(result =>
                        result.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredResults = filteredResults.filter(result => result.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredResults = filteredResults.slice(0, filters.limit);
                }

                return filteredResults;
            }
        } catch (error) {
            console.error('Error in getResults:', error);
            return [];
        }
    },

    // Get a result by ID
    getResult: async (id) => {
        try {
            return await apiRequest(`/results/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch result ${id} from API, using mock data:`, error);
            const mockResults = healthCheckApi.getMockData('results');
            return mockResults.find(result => result.id === id || result.id === `result-${id}`) || null;
        }
    },

    // Add a new result
    addResult: (data) => apiRequest('/results', 'POST', data),

    // Update a result
    updateResult: (id, data) => apiRequest(`/results/${id}`, 'PUT', data),

    // Delete a result
    deleteResult: async (id) => {
        try {
            console.log(`Attempting to delete result with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/results/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteResult for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete result: ${error.message}`);
        }
    }
};

/**
 * Admit Cards API
 */
const admitCardsApi = {
    // Get all admit cards with optional filters
    getAdmitCards: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/admit-cards${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch admit cards from API, using mock data:', error);
                // Return mock data if API fails
                const mockAdmitCards = healthCheckApi.getMockData('admit-cards');

                // Apply filters to mock data
                let filteredAdmitCards = mockAdmitCards;

                if (filters.category) {
                    filteredAdmitCards = filteredAdmitCards.filter(card =>
                        card.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredAdmitCards = filteredAdmitCards.filter(card => card.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredAdmitCards = filteredAdmitCards.slice(0, filters.limit);
                }

                return filteredAdmitCards;
            }
        } catch (error) {
            console.error('Error in getAdmitCards:', error);
            return [];
        }
    },

    // Get an admit card by ID
    getAdmitCard: async (id) => {
        try {
            return await apiRequest(`/admit-cards/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch admit card ${id} from API, using mock data:`, error);
            const mockAdmitCards = healthCheckApi.getMockData('admit-cards');
            return mockAdmitCards.find(card => card.id === id || card.id === `admit-card-${id}`) || null;
        }
    },

    // Add a new admit card
    addAdmitCard: (data) => apiRequest('/admit-cards', 'POST', data),

    // Update an admit card
    updateAdmitCard: (id, data) => apiRequest(`/admit-cards/${id}`, 'PUT', data),

    // Delete an admit card
    deleteAdmitCard: async (id) => {
        try {
            console.log(`Attempting to delete admit card with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/admit-cards/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteAdmitCard for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete admit card: ${error.message}`);
        }
    }
};

/**
 * Answer Keys API
 */
const answerKeysApi = {
    // Get all answer keys with optional filters
    getAnswerKeys: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/answer-keys${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch answer keys from API, using mock data:', error);
                // Return mock data if API fails
                const mockAnswerKeys = healthCheckApi.getMockData('answer-keys');

                // Apply filters to mock data
                let filteredAnswerKeys = mockAnswerKeys;

                if (filters.category) {
                    filteredAnswerKeys = filteredAnswerKeys.filter(key =>
                        key.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredAnswerKeys = filteredAnswerKeys.filter(key => key.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredAnswerKeys = filteredAnswerKeys.slice(0, filters.limit);
                }

                return filteredAnswerKeys;
            }
        } catch (error) {
            console.error('Error in getAnswerKeys:', error);
            return [];
        }
    },

    // Get an answer key by ID
    getAnswerKey: async (id) => {
        try {
            return await apiRequest(`/answer-keys/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch answer key ${id} from API, using mock data:`, error);
            const mockAnswerKeys = healthCheckApi.getMockData('answer-keys');
            return mockAnswerKeys.find(key => key.id === id || key.id === `answer-key-${id}`) || null;
        }
    },

    // Add a new answer key
    addAnswerKey: (data) => apiRequest('/answer-keys', 'POST', data),

    // Update an answer key
    updateAnswerKey: (id, data) => apiRequest(`/answer-keys/${id}`, 'PUT', data),

    // Delete an answer key
    deleteAnswerKey: async (id) => {
        try {
            console.log(`Attempting to delete answer key with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/answer-keys/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteAnswerKey for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete answer key: ${error.message}`);
        }
    }
};

/**
 * Syllabus API
 */
const syllabusApi = {
    // Get all syllabus items with optional filters
    getSyllabus: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/syllabus${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch syllabus from API, using mock data:', error);
                // Return mock data if API fails
                const mockSyllabus = healthCheckApi.getMockData('syllabus');

                // Apply filters to mock data
                let filteredSyllabus = mockSyllabus;

                if (filters.category) {
                    filteredSyllabus = filteredSyllabus.filter(item =>
                        item.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredSyllabus = filteredSyllabus.filter(item => item.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredSyllabus = filteredSyllabus.slice(0, filters.limit);
                }

                return filteredSyllabus;
            }
        } catch (error) {
            console.error('Error in getSyllabus:', error);
            return [];
        }
    },

    // Get a syllabus item by ID
    getSyllabusItem: async (id) => {
        try {
            return await apiRequest(`/syllabus/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch syllabus item ${id} from API, using mock data:`, error);
            const mockSyllabus = healthCheckApi.getMockData('syllabus');
            return mockSyllabus.find(item => item.id === id || item.id === `syllabus-${id}`) || null;
        }
    },

    // Add a new syllabus item
    addSyllabusItem: (data) => apiRequest('/syllabus', 'POST', data),

    // Update a syllabus item
    updateSyllabusItem: (id, data) => apiRequest(`/syllabus/${id}`, 'PUT', data),

    // Delete a syllabus item
    deleteSyllabusItem: async (id) => {
        try {
            console.log(`Attempting to delete syllabus with ID: ${id}`);
            // Directly attempt to delete
            return await apiRequest(`/syllabus/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteSyllabusItem for ID ${id}:`, error);
            // Rethrow with more specific message
            throw new Error(`Failed to delete syllabus: ${error.message}`);
        }
    }
};

/**
 * Important Links API
 */
const importantLinksApi = {
    // Get all important links with optional filters
    getImportantLinks: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/important-links${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch important links from API, using mock data:', error);
                // Generate mock important links data
                const mockLinks = [
                    {
                        id: 'link-1',
                        title: 'Official Government Jobs Portal',
                        url: 'https://www.example.com/gov-jobs',
                        category: 'Government',
                        featured: true
                    },
                    {
                        id: 'link-2',
                        title: 'Banking Exam Preparation',
                        url: 'https://www.example.com/banking-prep',
                        category: 'Banking',
                        featured: true
                    },
                    {
                        id: 'link-3',
                        title: 'Railway Recruitment Board',
                        url: 'https://www.example.com/rrb',
                        category: 'Railway',
                        featured: true
                    },
                    {
                        id: 'link-4',
                        title: 'SSC Exam Portal',
                        url: 'https://www.example.com/ssc',
                        category: 'SSC',
                        featured: true
                    },
                    {
                        id: 'link-5',
                        title: 'UPSC Preparation Resources',
                        url: 'https://www.example.com/upsc',
                        category: 'UPSC',
                        featured: true
                    },
                    {
                        id: 'link-6',
                        title: 'Teaching Jobs Updates',
                        url: 'https://www.example.com/teaching',
                        category: 'Teaching',
                        featured: false
                    },
                    {
                        id: 'link-7',
                        title: 'Defence Recruitment News',
                        url: 'https://www.example.com/defence',
                        category: 'Defence',
                        featured: false
                    }
                ];

                // Apply filters to mock data
                let filteredLinks = mockLinks;

                if (filters.category) {
                    filteredLinks = filteredLinks.filter(link =>
                        link.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredLinks = filteredLinks.filter(link => link.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredLinks = filteredLinks.slice(0, filters.limit);
                }

                return filteredLinks;
            }
        } catch (error) {
            console.error('Error in getImportantLinks:', error);
            return [];
        }
    },

    // Get an important link by ID
    getImportantLink: async (id) => {
        try {
            return await apiRequest(`/important-links/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch important link ${id} from API, using mock data:`, error);
            // Generate a mock important link
            return {
                id: id,
                title: `Important Link ${id}`,
                url: 'https://www.example.com/link',
                category: 'General',
                featured: true
            };
        }
    }
};

/**
 * Admissions API
 */
const admissionsApi = {
    // Get all admissions with optional filters
    getAdmissions: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams();

            // Add filters to query params
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            if (filters.featured !== undefined) {
                queryParams.append('featured', filters.featured);
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

            try {
                // Try to get data from API
                return await apiRequest(`/admissions${queryString}`);
            } catch (error) {
                console.warn('Failed to fetch admissions from API, using mock data:', error);
                // Generate mock admissions data since it's not in the healthCheckApi.getMockData
                const mockAdmissions = Array(20).fill().map((_, i) => ({
                    id: `admission-${i+1}`,
                    title: `Sample Admission ${i+1}`,
                    organization: 'Demo University',
                    category: i % 4 === 0 ? 'Engineering' : i % 3 === 0 ? 'Medical' : i % 2 === 0 ? 'Arts' : 'Commerce',
                    last_date: new Date(Date.now() + (i * 86400000 * 7)).toISOString(), // Future dates
                    featured: i % 4 === 0
                }));

                // Apply filters to mock data
                let filteredAdmissions = mockAdmissions;

                if (filters.category) {
                    filteredAdmissions = filteredAdmissions.filter(admission =>
                        admission.category.toLowerCase() === filters.category.toLowerCase()
                    );
                }

                if (filters.featured !== undefined) {
                    filteredAdmissions = filteredAdmissions.filter(admission => admission.featured === filters.featured);
                }

                if (filters.limit) {
                    filteredAdmissions = filteredAdmissions.slice(0, filters.limit);
                }

                return filteredAdmissions;
            }
        } catch (error) {
            console.error('Error in getAdmissions:', error);
            return [];
        }
    },

    // Get an admission by ID
    getAdmission: async (id) => {
        try {
            return await apiRequest(`/admissions/${id}`);
        } catch (error) {
            console.warn(`Failed to fetch admission ${id} from API, using mock data:`, error);
            // Generate a mock admission
            return {
                id: id,
                title: `Sample Admission ${id}`,
                organization: 'Demo University',
                category: 'Engineering',
                description: 'This is a sample admission notice for demonstration purposes.',
                last_date: new Date(Date.now() + (10 * 86400000)).toISOString(),
                featured: true
            };
        }
    },

    // Add a new admission
    addAdmission: (data) => apiRequest('/admissions', 'POST', data),

    // Update an admission
    updateAdmission: (id, data) => apiRequest(`/admissions/${id}`, 'PUT', data),

    // Delete an admission
    deleteAdmission: async (id) => {
        try {
            return await apiRequest(`/admissions/${id}`, 'DELETE');
        } catch (error) {
            console.error(`Error in deleteAdmission for ID ${id}:`, error);
            throw new Error(`Failed to delete admission: ${error.message}`);
        }
    }
};

/**
 * Get mock study materials data for development/testing
 * @param {string} type - Type of study material (notes, ebooks, videos, mock-tests)
 * @returns {Array} - Array of mock study materials
 */
function getMockStudyMaterials(type) {
    console.log(`Generating mock data for study materials: ${type}`);

    // Common categories
    const categories = ['Banking', 'SSC', 'Railway', 'Defence', 'Teaching', 'UPSC', 'State PSC'];

    // Generate random date within the last 3 months
    const getRandomDate = () => {
        const now = new Date();
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        const randomTime = threeMonthsAgo.getTime() + Math.random() * (new Date().getTime() - threeMonthsAgo.getTime());
        return new Date(randomTime).toISOString();
    };

    // Generate random items based on type
    switch (type) {
        case 'notes':
            return Array(8).fill().map((_, i) => ({
                id: `note-${i+1}`,
                title: `${categories[i % categories.length]} Exam Study Notes ${i+1}`,
                description: `Comprehensive study notes for ${categories[i % categories.length]} exams covering all important topics and concepts.`,
                category: categories[i % categories.length],
                download_link: '#',
                added_date: getRandomDate(),
                featured: i < 3
            }));

        case 'ebooks':
            return Array(6).fill().map((_, i) => ({
                id: `ebook-${i+1}`,
                title: `Complete ${categories[i % categories.length]} Guide ${i+1}`,
                description: `Comprehensive e-book covering all aspects of ${categories[i % categories.length]} exams with practice questions and answers.`,
                category: categories[i % categories.length],
                download_link: '#',
                added_date: getRandomDate(),
                featured: i < 2
            }));

        case 'videos':
            return Array(10).fill().map((_, i) => ({
                id: `video-${i+1}`,
                title: `${categories[i % categories.length]} Exam Preparation Video ${i+1}`,
                description: `Expert video lecture on important topics for ${categories[i % categories.length]} exams.`,
                category: categories[i % categories.length],
                video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                thumbnail_image: `https://picsum.photos/id/${30+i}/640/360`,
                duration: `${Math.floor(Math.random() * 30) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                added_date: getRandomDate(),
                featured: i < 4
            }));

        case 'mock-tests':
            return Array(5).fill().map((_, i) => ({
                id: `test-${i+1}`,
                title: `${categories[i % categories.length]} Mock Test ${i+1}`,
                description: `Practice mock test for ${categories[i % categories.length]} exams with detailed solutions and explanations.`,
                category: categories[i % categories.length],
                test_link: '#',
                questions: Math.floor(Math.random() * 50) + 50,
                duration: Math.floor(Math.random() * 60) + 30,
                added_date: getRandomDate(),
                featured: i < 2
            }));

        default:
            console.error(`Unknown study material type: ${type}`);
            return [];
    }
}

/**
 * Health Check API
 */
const healthCheckApi = {
    // Check if the API is available
    checkHealth: async () => {
        try {
            console.log('Checking API health...');

            // For development/demo purposes, always return true
            // This allows the admin dashboard to function without a real backend
            console.log('Development mode: Simulating API availability');
            return true;

            /* Uncomment this code when you have a real backend
            // Try to make a simple request to the API
            const response = await fetch(`${API_BASE_URL}/health-check`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                // Short timeout to quickly detect if API is down
                signal: AbortSignal.timeout(3000)
            });

            return response.ok;
            */
        } catch (error) {
            console.error('Health check failed:', error);
            // For development/demo purposes, return true anyway
            console.log('Development mode: Simulating API availability despite error');
            return true;
        }
    },

    // Mock data provider for development/demo purposes
    getMockData: (type) => {
        console.log(`Providing mock data for ${type}`);
        const mockData = {
            jobs: [
                {
                    id: 'job-1',
                    title: 'UKPSC Pre 2025 Online Form',
                    organization: 'UKPSC',
                    position: 'Multiple Positions',
                    qualification: 'Bachelor Degree in Any Stream in Any Recognized University in India.',
                    last_date: '2025-05-31',
                    category: 'SSC',
                    posted_date: new Date(Date.now() - (1 * 86400000)).toISOString(),
                    status: 'active',
                    featured: true,
                    job_type: 'Full Time',
                    apply_link: '#'
                },
                {
                    id: 'job-2',
                    title: 'UKPSC Pre 2025 Online Form',
                    organization: 'UKPSC',
                    position: 'Multiple Positions',
                    qualification: 'Bachelor Degree',
                    last_date: '2025-06-07',
                    category: 'Banking',
                    posted_date: new Date(Date.now() - (2 * 86400000)).toISOString(),
                    status: 'active',
                    featured: true,
                    job_type: 'Full Time',
                    apply_link: '#'
                },
                ...Array(243).fill().map((_, i) => ({
                    id: `job-${i+3}`,
                    title: `Sample Job ${i+3}`,
                    organization: 'Demo Organization',
                    position: 'Multiple Positions',
                    qualification: 'Bachelor Degree',
                    last_date: new Date(Date.now() + ((i+30) * 86400000)).toISOString(),
                    category: i % 5 === 0 ? 'Banking' : i % 4 === 0 ? 'Railway' : i % 3 === 0 ? 'Teaching' : i % 2 === 0 ? 'Defence' : 'SSC',
                    posted_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                    status: i % 3 === 0 ? 'closed' : 'active',
                    featured: i % 5 === 0,
                    job_type: 'Full Time',
                    apply_link: '#'
                }))
            ],
            results: [
                {
                    id: 'result-1',
                    title: 'Chhattisgarh Board CGBSE Class 10th, 12th Result 2025',
                    organization: 'CGBSE',
                    category: 'state',
                    qualification: 'Class 10th & 12th',
                    result_date: '2025-05-10',
                    result_link: '#',
                    featured: true
                },
                {
                    id: 'result-2',
                    title: 'Chhattisgarh Board CGBSE Class 10th, 12th Result 2025',
                    organization: 'CGBSE',
                    category: 'central',
                    qualification: 'Class 10th & 12th',
                    result_date: '2025-05-07',
                    result_link: '#',
                    featured: true
                },
                ...Array(126).fill().map((_, i) => ({
                    id: `result-${i+3}`,
                    title: `Sample Result ${i+3}`,
                    organization: 'Demo Organization',
                    category: i % 5 === 0 ? 'central' : i % 4 === 0 ? 'state' : i % 3 === 0 ? 'banking' : i % 2 === 0 ? 'railway' : 'defence',
                    qualification: 'Bachelor Degree',
                    result_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                    result_link: '#',
                    featured: i % 4 === 0
                }))
            ],
            'admit-cards': Array(87).fill().map((_, i) => ({
                id: `admit-card-${i+1}`,
                title: `Sample Admit Card ${i+1}`,
                organization: 'Demo Organization',
                category: i % 4 === 0 ? 'Banking' : i % 3 === 0 ? 'Railway' : i % 2 === 0 ? 'Teaching' : 'SSC',
                release_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 4 === 0
            })),
            'answer-keys': Array(45).fill().map((_, i) => ({
                id: `answer-key-${i+1}`,
                title: `Sample Answer Key ${i+1}`,
                organization: 'Demo Organization',
                category: i % 4 === 0 ? 'Banking' : i % 3 === 0 ? 'Railway' : i % 2 === 0 ? 'Teaching' : 'SSC',
                release_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 4 === 0
            })),
            syllabus: Array(32).fill().map((_, i) => ({
                id: `syllabus-${i+1}`,
                title: `Sample Syllabus ${i+1}`,
                organization: 'Demo Organization',
                category: i % 4 === 0 ? 'Banking' : i % 3 === 0 ? 'Railway' : i % 2 === 0 ? 'Teaching' : 'SSC',
                release_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 4 === 0
            })),
            notes: Array(15).fill().map((_, i) => ({
                id: `note-${i+1}`,
                title: `Sample Note ${i+1}`,
                type: 'notes',
                category: i % 3 === 0 ? 'Banking' : i % 2 === 0 ? 'Railway' : 'SSC',
                added_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 3 === 0
            })),
            ebooks: Array(12).fill().map((_, i) => ({
                id: `ebook-${i+1}`,
                title: `Sample Ebook ${i+1}`,
                type: 'ebooks',
                category: i % 3 === 0 ? 'Banking' : i % 2 === 0 ? 'Railway' : 'SSC',
                added_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 3 === 0
            })),
            videos: Array(18).fill().map((_, i) => ({
                id: `video-${i+1}`,
                title: `Sample Video ${i+1}`,
                type: 'videos',
                category: i % 3 === 0 ? 'Banking' : i % 2 === 0 ? 'Railway' : 'SSC',
                added_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 3 === 0,
                thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
            })),
            'mock-tests': Array(8).fill().map((_, i) => ({
                id: `mock-test-${i+1}`,
                title: `Sample Mock Test ${i+1}`,
                type: 'mock-tests',
                category: i % 3 === 0 ? 'Banking' : i % 2 === 0 ? 'Railway' : 'SSC',
                added_date: new Date(Date.now() - (i * 86400000)).toISOString(),
                featured: i % 3 === 0
            }))
        };

        return mockData[type] || [];
    }
};

// Combine all APIs
const apiService = {
    API_BASE_URL, // Expose the API_BASE_URL for other scripts to use
    ...healthCheckApi,
    ...studyMaterialsApi,
    ...jobsApi,
    ...resultsApi,
    ...admitCardsApi,
    ...answerKeysApi,
    ...syllabusApi,
    ...importantLinksApi,
    ...admissionsApi
};

// Export the API service
window.apiService = apiService;
