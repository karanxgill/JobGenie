/**
 * Server Status Checker for JobGenie
 * This script checks if the server is running and displays the status
 */

// Status element
let statusElement;

// Initialize the status checker
function initStatusChecker() {
    // Create status element
    statusElement = document.createElement('div');
    statusElement.id = 'server-status';
    statusElement.style.position = 'fixed';
    statusElement.style.bottom = '10px';
    statusElement.style.right = '10px';
    statusElement.style.padding = '8px 12px';
    statusElement.style.borderRadius = '4px';
    statusElement.style.fontSize = '12px';
    statusElement.style.fontFamily = 'Arial, sans-serif';
    statusElement.style.zIndex = '9999';
    statusElement.style.cursor = 'pointer';
    statusElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    // Add click event to refresh status
    statusElement.addEventListener('click', checkServerStatus);

    // Add to body
    document.body.appendChild(statusElement);

    // Initial check
    checkServerStatus();

    // Set interval to check status every 30 seconds
    setInterval(checkServerStatus, 30000);
}

// Check server status
async function checkServerStatus() {
    try {
        statusElement.textContent = 'Checking server...';
        statusElement.style.backgroundColor = '#f8f9fa';
        statusElement.style.color = '#333';

        const startTime = Date.now();
        const response = await fetch(`${window.apiService ? window.apiService.API_BASE_URL || 'http://localhost:3000/api' : 'http://localhost:3000/api'}/jobs`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            // Set a timeout to avoid waiting too long
            signal: AbortSignal.timeout(5000)
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            const data = await response.json();
            statusElement.textContent = `Server Online (${responseTime}ms)`;
            statusElement.style.backgroundColor = '#d4edda';
            statusElement.style.color = '#155724';
            statusElement.title = `Server is running. Response time: ${responseTime}ms. Found ${Array.isArray(data) ? data.length : 0} jobs.`;
        } else {
            statusElement.textContent = `Server Error (${response.status})`;
            statusElement.style.backgroundColor = '#f8d7da';
            statusElement.style.color = '#721c24';
            statusElement.title = `Server returned error: ${response.status} ${response.statusText}`;
        }
    } catch (error) {
        statusElement.textContent = 'Server Offline';
        statusElement.style.backgroundColor = '#f8d7da';
        statusElement.style.color = '#721c24';
        statusElement.title = `Could not connect to server: ${error.message}. Make sure the server is running at http://localhost:3000/api`;
        console.error('Server status check failed:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initStatusChecker);
