/**
 * Admin Button Fix - Ensures all admin buttons work correctly
 * This script runs after all other scripts and directly attaches event listeners to buttons
 *
 * Version 2.0 - Enhanced with better error handling and debugging
 */

// Check if API service is available
function checkApiService() {
    if (typeof apiService === 'undefined') {
        console.error('API Service is not defined! Make sure api-service.js is loaded before this script.');

        // Try to load the API service script dynamically
        const apiScript = document.createElement('script');
        apiScript.src = '../js/api-service.js';
        apiScript.onload = function() {
            console.log('API Service script loaded dynamically');
            // Reload the page to ensure everything is initialized correctly
            window.location.reload();
        };
        apiScript.onerror = function() {
            console.error('Failed to load API Service script dynamically');
            alert('Error: API Service is not available. Please check the console for more information.');
        };
        document.head.appendChild(apiScript);

        return false;
    }
    return true;
}

// Debug function to log API calls
function debugApiCall(action, endpoint, data, response) {
    console.log(`API ${action}:`, {
        endpoint,
        data,
        response
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin button fix running (v2.0)...');

    // Function to initialize when API service is available
    function initializeWhenApiAvailable() {
        // Check if API service is available
        if (typeof apiService === 'undefined') {
            console.log('API Service not yet available, waiting...');
            // Wait a bit and try again
            setTimeout(initializeWhenApiAvailable, 100);
            return;
        }

        console.log('API Service is available, proceeding with initialization');

        // Wait a short time to ensure all DOM elements are ready
        setTimeout(function() {
        // Fix Add Job button
        const addJobBtn = document.getElementById('add-job-btn');
        if (addJobBtn) {
            console.log('Found Add Job button, attaching event listener');
            addJobBtn.addEventListener('click', function() {
                console.log('Add Job button clicked');
                const jobModal = document.getElementById('job-modal');
                if (jobModal) {
                    // Reset form
                    const jobForm = document.getElementById('job-form');
                    if (jobForm) jobForm.reset();

                    const jobId = document.getElementById('job-id');
                    if (jobId) jobId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Job';

                    // Set default dates
                    const today = new Date().toISOString().split('T')[0];
                    const startDate = document.getElementById('job-start-date');
                    if (startDate) startDate.value = today;

                    const nextMonth = new Date();
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    const lastDate = document.getElementById('job-last-date');
                    if (lastDate) lastDate.value = nextMonth.toISOString().split('T')[0];

                    // Show modal
                    jobModal.style.display = 'block';
                }
            });
        }

        // Fix Add Result button
        const addResultBtn = document.getElementById('add-result-btn');
        if (addResultBtn) {
            console.log('Found Add Result button, attaching event listener');
            addResultBtn.addEventListener('click', function() {
                console.log('Add Result button clicked');
                const resultModal = document.getElementById('result-modal');
                if (resultModal) {
                    // Reset form
                    const resultForm = document.getElementById('result-form');
                    if (resultForm) resultForm.reset();

                    const resultId = document.getElementById('result-id');
                    if (resultId) resultId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Result';

                    // Set default dates
                    const today = new Date().toISOString().split('T')[0];
                    const resultDate = document.getElementById('result-date');
                    if (resultDate) resultDate.value = today;

                    // Show modal
                    resultModal.style.display = 'block';
                }
            });
        }

        // Fix Add Admit Card button
        const addAdmitCardBtn = document.getElementById('add-admit-card-btn');
        if (addAdmitCardBtn) {
            console.log('Found Add Admit Card button, attaching event listener');
            addAdmitCardBtn.addEventListener('click', function() {
                console.log('Add Admit Card button clicked');
                const admitCardModal = document.getElementById('admit-card-modal');
                if (admitCardModal) {
                    // Reset form
                    const admitCardForm = document.getElementById('admit-card-form');
                    if (admitCardForm) admitCardForm.reset();

                    const admitCardId = document.getElementById('admit-card-id');
                    if (admitCardId) admitCardId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Admit Card';

                    // Set default dates
                    const today = new Date().toISOString().split('T')[0];
                    const releaseDate = document.getElementById('admit-card-release-date');
                    if (releaseDate) releaseDate.value = today;

                    // Show modal
                    admitCardModal.style.display = 'block';
                }
            });
        }

        // Fix Add Answer Key button
        const addAnswerKeyBtn = document.getElementById('add-answer-key-btn');
        if (addAnswerKeyBtn) {
            console.log('Found Add Answer Key button, attaching event listener');
            addAnswerKeyBtn.addEventListener('click', function() {
                console.log('Add Answer Key button clicked');
                const answerKeyModal = document.getElementById('answer-key-modal');
                if (answerKeyModal) {
                    // Reset form
                    const answerKeyForm = document.getElementById('answer-key-form');
                    if (answerKeyForm) answerKeyForm.reset();

                    const answerKeyId = document.getElementById('answer-key-id');
                    if (answerKeyId) answerKeyId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Answer Key';

                    // Set default dates
                    const today = new Date().toISOString().split('T')[0];
                    const releaseDate = document.getElementById('answer-key-release-date');
                    if (releaseDate) releaseDate.value = today;

                    // Show modal
                    answerKeyModal.style.display = 'block';
                }
            });
        }

        // Fix Add Syllabus button
        const addSyllabusBtn = document.getElementById('add-syllabus-btn');
        if (addSyllabusBtn) {
            console.log('Found Add Syllabus button, attaching event listener');
            addSyllabusBtn.addEventListener('click', function() {
                console.log('Add Syllabus button clicked');
                const syllabusModal = document.getElementById('syllabus-modal');
                if (syllabusModal) {
                    // Reset form
                    const syllabusForm = document.getElementById('syllabus-form');
                    if (syllabusForm) syllabusForm.reset();

                    const syllabusId = document.getElementById('syllabus-id');
                    if (syllabusId) syllabusId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Syllabus';

                    // Set default dates
                    const today = new Date().toISOString().split('T')[0];
                    const releaseDate = document.getElementById('syllabus-release-date');
                    if (releaseDate) releaseDate.value = today;

                    // Show modal
                    syllabusModal.style.display = 'block';
                }
            });
        }

        // Fix Add Study Material button
        const addStudyMaterialBtn = document.getElementById('add-study-material-btn');
        if (addStudyMaterialBtn) {
            console.log('Found Add Study Material button, attaching event listener');
            addStudyMaterialBtn.addEventListener('click', function() {
                console.log('Add Study Material button clicked');
                const studyMaterialModal = document.getElementById('study-material-modal');
                if (studyMaterialModal) {
                    // Reset form
                    const studyMaterialForm = document.getElementById('study-material-form');
                    if (studyMaterialForm) studyMaterialForm.reset();

                    const studyMaterialId = document.getElementById('study-material-id');
                    if (studyMaterialId) studyMaterialId.value = '';

                    const modalTitle = document.getElementById('modal-title');
                    if (modalTitle) modalTitle.textContent = 'Add New Study Material';

                    // Set featured checkbox to true by default
                    const featuredField = document.getElementById('study-material-featured');
                    if (featuredField) featuredField.checked = true;

                    // Show modal
                    studyMaterialModal.style.display = 'block';
                }
            });
        }

        // Fix all close modal buttons
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Close modal button clicked');
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });

        // Fix all cancel buttons
        const cancelBtns = document.querySelectorAll('[id$="-cancel-btn"]');
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Cancel button clicked');
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });

        // Fix Job Save button
        const jobForm = document.getElementById('job-form');
        if (jobForm && !jobForm.dataset.listenerAttached) {
            console.log('Found Job form, attaching submit event listener');

            // Remove any existing event listeners by cloning and replacing the form
            const newJobForm = jobForm.cloneNode(true);
            jobForm.parentNode.replaceChild(newJobForm, jobForm);

            // Add event listener to form submit
            newJobForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Job form submitted from admin-button-fix.js');

                // Use a flag to prevent multiple submissions
                if (window.isSubmittingJobForm) {
                    console.log('Already submitting job form, preventing duplicate submission');
                    return;
                }

                // Set flag to prevent multiple submissions
                window.isSubmittingJobForm = true;

                // Call saveJob function
                saveJob();

                // Reset flag after a short delay
                setTimeout(() => {
                    window.isSubmittingJobForm = false;
                }, 1000);
            });

            // Mark the form as having a listener attached
            newJobForm.dataset.listenerAttached = 'true';
            console.log('Job form listener attached successfully');
        } else if (jobForm && jobForm.dataset.listenerAttached) {
            console.log('Job form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Fix Result Save button
        const resultForm = document.getElementById('result-form');
        if (resultForm && !resultForm.dataset.listenerAttached) {
            console.log('Found Result form, attaching submit event listener');
            resultForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Result form submitted');
                saveResult();
            });
            // Mark the form as having a listener attached
            resultForm.dataset.listenerAttached = 'true';
        } else if (resultForm && resultForm.dataset.listenerAttached) {
            console.log('Result form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Fix Admit Card Save button
        const admitCardForm = document.getElementById('admit-card-form');
        if (admitCardForm && !admitCardForm.dataset.listenerAttached) {
            console.log('Found Admit Card form, attaching submit event listener');
            admitCardForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Admit Card form submitted');
                saveAdmitCard();
            });
            // Mark the form as having a listener attached
            admitCardForm.dataset.listenerAttached = 'true';
        } else if (admitCardForm && admitCardForm.dataset.listenerAttached) {
            console.log('Admit Card form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Fix Answer Key Save button
        const answerKeyForm = document.getElementById('answer-key-form');
        if (answerKeyForm && !answerKeyForm.dataset.listenerAttached) {
            console.log('Found Answer Key form, attaching submit event listener');
            answerKeyForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Answer Key form submitted');
                saveAnswerKey();
            });
            // Mark the form as having a listener attached
            answerKeyForm.dataset.listenerAttached = 'true';
        } else if (answerKeyForm && answerKeyForm.dataset.listenerAttached) {
            console.log('Answer Key form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Fix Syllabus Save button
        const syllabusForm = document.getElementById('syllabus-form');
        if (syllabusForm && !syllabusForm.dataset.listenerAttached) {
            console.log('Found Syllabus form, attaching submit event listener');
            syllabusForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Syllabus form submitted');
                saveSyllabus();
            });
            // Mark the form as having a listener attached
            syllabusForm.dataset.listenerAttached = 'true';
        } else if (syllabusForm && syllabusForm.dataset.listenerAttached) {
            console.log('Syllabus form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Fix Study Material Save button
        const studyMaterialForm = document.getElementById('study-material-form');
        if (studyMaterialForm && !studyMaterialForm.dataset.listenerAttached) {
            console.log('Found Study Material form, attaching submit event listener');
            studyMaterialForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Study Material form submitted');
                saveStudyMaterial();
            });
            // Mark the form as having a listener attached
            studyMaterialForm.dataset.listenerAttached = 'true';
        } else if (studyMaterialForm && studyMaterialForm.dataset.listenerAttached) {
            console.log('Study Material form already has a listener attached, skipping in admin-button-fix.js');
        }

        // Implement save functions if they don't exist

        // Save Job function - always redefine to ensure we have the latest version
        window.saveJob = async function() {
            // Prevent multiple submissions using a flag
            if (window.isSavingJob) {
                console.log('Already saving job, preventing duplicate submission');
                return;
            }

            // Set flag to prevent multiple submissions
            window.isSavingJob = true;

            // Disable save button to prevent double submission
            const saveBtn = document.getElementById('save-job-btn');
            if (saveBtn) saveBtn.disabled = true;

            try {
                console.log('Saving job...');

                // Check if API service is available
                if (!checkApiService()) {
                    window.isSavingJob = false;
                    if (saveBtn) saveBtn.disabled = false;
                    return;
                }

                // Get form values
                const jobId = document.getElementById('job-id').value;
                const title = document.getElementById('job-title').value;
                const organization = document.getElementById('job-organization').value;
                const category = document.getElementById('job-category').value;
                const location = document.getElementById('job-location').value;
                const startDate = document.getElementById('job-start-date').value;
                const lastDate = document.getElementById('job-last-date').value;
                const description = document.getElementById('job-description').value;
                const vacancies = document.getElementById('job-vacancies').value;
                const qualification = document.getElementById('job-qualification').value;
                const ageLimit = document.getElementById('job-age-limit').value;
                const applicationFee = document.getElementById('job-application-fee').value;
                const applyLink = document.getElementById('job-apply-link').value;
                const status = document.getElementById('job-status').value;
                const featured = document.getElementById('job-featured').checked;

                // Validate required fields
                if (!title || !organization || !category || !startDate || !lastDate || !description || !applyLink) {
                    alert('Please fill in all required fields.');
                    window.isSavingJob = false;
                    if (saveBtn) saveBtn.disabled = false;
                    return;
                }

                // Create job object
                const job = {
                    title,
                    organization,
                    category,
                    location,
                    start_date: startDate,
                    last_date: lastDate,
                    description,
                    vacancies: vacancies ? parseInt(vacancies) : null,
                    qualification,
                    age_limit: ageLimit,
                    application_fee: applicationFee,
                    apply_link: applyLink,
                    status,
                    featured,
                    posted_date: new Date().toISOString() // Ensure we have a posted date
                };

                console.log('Job data:', job);

                // Show saving indicator
                const saveIndicator = document.createElement('span');
                saveIndicator.textContent = ' Saving...';
                saveIndicator.id = 'save-indicator';
                if (saveBtn && saveBtn.parentNode) saveBtn.parentNode.appendChild(saveIndicator);

                let response;

                try {
                    // Update or add job
                    if (jobId) {
                        // Update existing job
                        response = await apiService.updateJob(jobId, job);
                        debugApiCall('UPDATE', `/jobs/${jobId}`, job, response);
                        console.log('Job updated successfully:', response);
                    } else {
                        // Add new job
                        response = await apiService.addJob(job);
                        debugApiCall('ADD', '/jobs', job, response);
                        console.log('Job added successfully:', response);
                    }

                    // Remove saving indicator
                    const indicator = document.getElementById('save-indicator');
                    if (indicator) indicator.remove();

                    // Close modal
                    const jobModal = document.getElementById('job-modal');
                    if (jobModal) jobModal.style.display = 'none';

                    // Show success message
                    alert(`Job ${jobId ? 'updated' : 'added'} successfully.`);

                    // Reload jobs after showing the success message
                    if (typeof loadAdminJobs === 'function') {
                        try {
                            await loadAdminJobs();
                        } catch (loadError) {
                            console.error('Error reloading jobs:', loadError);
                            // Continue even if reload fails
                        }
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }
                } catch (saveError) {
                    console.error('Error saving job:', saveError);

                    // Remove saving indicator
                    const indicator = document.getElementById('save-indicator');
                    if (indicator) indicator.remove();

                    // Show detailed error message
                    let errorMessage = 'Error saving job: ';

                    if (saveError.message) {
                        errorMessage += saveError.message;
                    } else {
                        errorMessage += 'Could not connect to the server. Please check if the server is running.';
                    }

                    alert(errorMessage);
                }
            } catch (error) {
                console.error('Unexpected error in saveJob function:', error);

                // Remove saving indicator
                const indicator = document.getElementById('save-indicator');
                if (indicator) indicator.remove();

                alert(`An unexpected error occurred: ${error.message}`);
            } finally {
                // Reset flag and re-enable button
                window.isSavingJob = false;
                if (saveBtn) saveBtn.disabled = false;
            }
        };

        // Save Result function - Skip if already defined in admin-handler.js
        if (typeof saveResult !== 'function') {
            console.log('saveResult function not found, defining it in admin-button-fix.js');
            window.saveResult = async function() {
                // Prevent multiple submissions using a flag
                if (window.isSavingResult) {
                    console.log('Already saving result, preventing duplicate submission');
                    return;
                }

                // Set flag to prevent multiple submissions
                window.isSavingResult = true;

                // Disable save button to prevent double submission
                const saveBtn = document.getElementById('save-result-btn');
                if (saveBtn) saveBtn.disabled = true;

                try {
                    console.log('Saving result from admin-button-fix.js...');

                    // Check if API service is available
                    if (!checkApiService()) {
                        if (saveBtn) saveBtn.disabled = false;
                        window.isSavingResult = false;
                        return;
                    }

                    // Get form values
                    const resultId = document.getElementById('result-id').value;
                    const title = document.getElementById('result-title').value;
                    const organization = document.getElementById('result-organization').value;
                    const category = document.getElementById('result-category').value;
                    const resultDate = document.getElementById('result-date').value;
                    const description = document.getElementById('result-description').value;
                    const link = document.getElementById('result-link').value;
                    const featured = document.getElementById('result-featured').checked;

                    // Validate required fields
                    if (!title || !organization || !category || !resultDate || !link) {
                        alert('Please fill in all required fields.');
                        if (saveBtn) saveBtn.disabled = false;
                        window.isSavingResult = false;
                        return;
                    }

                    // Create result object
                    const result = {
                        title,
                        organization,
                        category,
                        result_date: resultDate,
                        description,
                        result_link: link, // Make sure field name matches API expectation
                        featured
                    };

                    console.log('Result data:', result);

                    // Show saving indicator
                    const saveIndicator = document.createElement('span');
                    saveIndicator.textContent = ' Saving...';
                    saveIndicator.id = 'save-indicator';
                    if (saveBtn) saveBtn.parentNode.appendChild(saveIndicator);

                    let response;

                    // Update or add result
                    if (resultId) {
                        // Update existing result
                        console.log(`Updating result with ID: ${resultId}`);
                        response = await apiService.updateResult(resultId, result);
                        debugApiCall('UPDATE', `/results/${resultId}`, result, response);
                        console.log('Result updated successfully:', response);
                    } else {
                        // Add new result
                        console.log('Adding new result');
                        response = await apiService.addResult(result);
                        debugApiCall('ADD', '/results', result, response);
                        console.log('Result added successfully:', response);
                    }

                    // Remove saving indicator
                    const indicator = document.getElementById('save-indicator');
                    if (indicator) indicator.remove();

                    // Close modal
                    const resultModal = document.getElementById('result-modal');
                    if (resultModal) resultModal.style.display = 'none';

                    // Reload results
                    if (typeof loadAdminResults === 'function') {
                        try {
                            await loadAdminResults();
                        } catch (loadError) {
                            console.error('Error reloading results:', loadError);
                            // Continue with success message even if reload fails
                        }
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }

                    // Show success message
                    alert(`Result ${resultId ? 'updated' : 'added'} successfully.`);
                } catch (error) {
                    console.error('Error saving result:', error);

                    // Remove saving indicator
                    const indicator = document.getElementById('save-indicator');
                    if (indicator) indicator.remove();

                    // Show detailed error message
                    let errorMessage = 'Error saving result: ';

                    if (error.message) {
                        errorMessage += error.message;
                    } else {
                        errorMessage += 'Could not connect to the server. Please check if the server is running.';
                    }

                    alert(errorMessage);
                } finally {
                    // Reset flag and re-enable button
                    window.isSavingResult = false;
                    if (saveBtn) saveBtn.disabled = false;
                }
            };
        } else {
            console.log('saveResult function already defined, skipping definition in admin-button-fix.js');
        }

        // Save Admit Card function
        if (typeof saveAdmitCard !== 'function') {
            window.saveAdmitCard = async function() {
                try {
                    console.log('Saving admit card...');

                    // Get form values
                    const admitCardId = document.getElementById('admit-card-id').value;
                    const title = document.getElementById('admit-card-title').value;
                    const organization = document.getElementById('admit-card-organization').value;
                    const category = document.getElementById('admit-card-category').value;
                    const releaseDate = document.getElementById('admit-card-release-date').value;
                    const description = document.getElementById('admit-card-description').value;
                    const downloadLink = document.getElementById('admit-card-download-link').value;
                    const featured = document.getElementById('admit-card-featured').checked;

                    // Validate required fields
                    if (!title || !organization || !category || !releaseDate || !downloadLink) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    // Create admit card object
                    const admitCard = {
                        title,
                        organization,
                        category,
                        release_date: releaseDate,
                        description,
                        download_link: downloadLink,
                        featured
                    };

                    console.log('Admit Card data:', admitCard);

                    // Update or add admit card
                    if (admitCardId) {
                        // Update existing admit card
                        await apiService.updateAdmitCard(admitCardId, admitCard);
                        console.log('Admit Card updated successfully');
                    } else {
                        // Add new admit card
                        await apiService.addAdmitCard(admitCard);
                        console.log('Admit Card added successfully');
                    }

                    // Close modal
                    const admitCardModal = document.getElementById('admit-card-modal');
                    if (admitCardModal) admitCardModal.style.display = 'none';

                    // Reload admit cards
                    if (typeof loadAdminAdmitCards === 'function') {
                        await loadAdminAdmitCards();
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }

                    // Show success message
                    alert(`Admit Card ${admitCardId ? 'updated' : 'added'} successfully.`);
                } catch (error) {
                    console.error('Error saving admit card:', error);
                    alert(`Error saving admit card: ${error.message}`);
                }
            };
        }

        // Save Answer Key function
        if (typeof saveAnswerKey !== 'function') {
            window.saveAnswerKey = async function() {
                try {
                    console.log('Saving answer key...');

                    // Get form values
                    const answerKeyId = document.getElementById('answer-key-id').value;
                    const title = document.getElementById('answer-key-title').value;
                    const organization = document.getElementById('answer-key-organization').value;
                    const category = document.getElementById('answer-key-category').value;
                    const releaseDate = document.getElementById('answer-key-release-date').value;
                    const description = document.getElementById('answer-key-description').value;
                    const downloadLink = document.getElementById('answer-key-download-link').value;
                    const featured = document.getElementById('answer-key-featured').checked;

                    // Validate required fields
                    if (!title || !organization || !category || !releaseDate || !downloadLink) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    // Create answer key object
                    const answerKey = {
                        title,
                        organization,
                        category,
                        release_date: releaseDate,
                        description,
                        download_link: downloadLink,
                        featured
                    };

                    console.log('Answer Key data:', answerKey);

                    // Update or add answer key
                    if (answerKeyId) {
                        // Update existing answer key
                        await apiService.updateAnswerKey(answerKeyId, answerKey);
                        console.log('Answer Key updated successfully');
                    } else {
                        // Add new answer key
                        await apiService.addAnswerKey(answerKey);
                        console.log('Answer Key added successfully');
                    }

                    // Close modal
                    const answerKeyModal = document.getElementById('answer-key-modal');
                    if (answerKeyModal) answerKeyModal.style.display = 'none';

                    // Reload answer keys
                    if (typeof loadAdminAnswerKeys === 'function') {
                        await loadAdminAnswerKeys();
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }

                    // Show success message
                    alert(`Answer Key ${answerKeyId ? 'updated' : 'added'} successfully.`);
                } catch (error) {
                    console.error('Error saving answer key:', error);
                    alert(`Error saving answer key: ${error.message}`);
                }
            };
        }

        // Save Syllabus function
        if (typeof saveSyllabus !== 'function') {
            window.saveSyllabus = async function() {
                try {
                    console.log('Saving syllabus...');

                    // Get form values
                    const syllabusId = document.getElementById('syllabus-id').value;
                    const title = document.getElementById('syllabus-title').value;
                    const organization = document.getElementById('syllabus-organization').value;
                    const category = document.getElementById('syllabus-category').value;
                    const releaseDate = document.getElementById('syllabus-release-date').value;
                    const description = document.getElementById('syllabus-description').value;
                    const downloadLink = document.getElementById('syllabus-download-link').value;
                    const featured = document.getElementById('syllabus-featured').checked;

                    // Validate required fields
                    if (!title || !organization || !category || !releaseDate || !downloadLink) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    // Create syllabus object
                    const syllabus = {
                        title,
                        organization,
                        category,
                        release_date: releaseDate,
                        description,
                        download_link: downloadLink,
                        featured
                    };

                    console.log('Syllabus data:', syllabus);

                    // Update or add syllabus
                    if (syllabusId) {
                        // Update existing syllabus
                        await apiService.updateSyllabusItem(syllabusId, syllabus);
                        console.log('Syllabus updated successfully');
                    } else {
                        // Add new syllabus
                        await apiService.addSyllabusItem(syllabus);
                        console.log('Syllabus added successfully');
                    }

                    // Close modal
                    const syllabusModal = document.getElementById('syllabus-modal');
                    if (syllabusModal) syllabusModal.style.display = 'none';

                    // Reload syllabus
                    if (typeof loadAdminSyllabus === 'function') {
                        await loadAdminSyllabus();
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }

                    // Show success message
                    alert(`Syllabus ${syllabusId ? 'updated' : 'added'} successfully.`);
                } catch (error) {
                    console.error('Error saving syllabus:', error);
                    alert(`Error saving syllabus: ${error.message}`);
                }
            };
        }

        // Save Study Material function
        if (typeof saveStudyMaterial !== 'function') {
            window.saveStudyMaterial = async function() {
                try {
                    console.log('Saving study material...');

                    // Get form values
                    const studyMaterialId = document.getElementById('study-material-id').value;
                    const title = document.getElementById('study-material-title').value;
                    const type = document.getElementById('study-material-type').value;
                    const category = document.getElementById('study-material-category').value;
                    const link = document.getElementById('study-material-link').value;
                    const description = document.getElementById('study-material-description').value;
                    const featured = document.getElementById('study-material-featured').checked;

                    // Validate required fields
                    if (!title || !type || !category || !link) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    // Create study material object
                    const studyMaterial = {
                        title,
                        type,
                        category,
                        link,
                        description,
                        featured
                    };

                    // Add thumbnail for videos
                    if (type === 'videos') {
                        const videoId = extractYouTubeVideoId(link);
                        if (videoId) {
                            studyMaterial.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                        }
                    }

                    console.log('Study Material data:', studyMaterial);

                    // Update or add study material based on type
                    if (studyMaterialId) {
                        // Update existing study material
                        switch (type) {
                            case 'notes':
                                await apiService.updateNote(studyMaterialId, studyMaterial);
                                break;
                            case 'ebooks':
                                await apiService.updateEbook(studyMaterialId, studyMaterial);
                                break;
                            case 'videos':
                                await apiService.updateVideo(studyMaterialId, studyMaterial);
                                break;
                            case 'mock-tests':
                                await apiService.updateMockTest(studyMaterialId, studyMaterial);
                                break;
                        }
                        console.log('Study Material updated successfully');
                    } else {
                        // Add new study material
                        switch (type) {
                            case 'notes':
                                await apiService.addNote(studyMaterial);
                                break;
                            case 'ebooks':
                                await apiService.addEbook(studyMaterial);
                                break;
                            case 'videos':
                                await apiService.addVideo(studyMaterial);
                                break;
                            case 'mock-tests':
                                await apiService.addMockTest(studyMaterial);
                                break;
                        }
                        console.log('Study Material added successfully');
                    }

                    // Close modal
                    const studyMaterialModal = document.getElementById('study-material-modal');
                    if (studyMaterialModal) studyMaterialModal.style.display = 'none';

                    // Reload study materials
                    if (typeof loadAdminStudyMaterials === 'function') {
                        await loadAdminStudyMaterials();
                    } else {
                        // Reload page as fallback
                        window.location.reload();
                    }

                    // Show success message
                    alert(`Study Material ${studyMaterialId ? 'updated' : 'added'} successfully.`);
                } catch (error) {
                    console.error('Error saving study material:', error);
                    alert(`Error saving study material: ${error.message}`);
                }
            };
        }

        // Helper function to extract YouTube video ID
        if (typeof extractYouTubeVideoId !== 'function') {
            window.extractYouTubeVideoId = function(url) {
                if (!url) return null;

                // Regular expressions for different YouTube URL formats
                const regexps = [
                    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
                    /^([a-zA-Z0-9_-]{11})$/
                ];

                for (const regex of regexps) {
                    const match = url.match(regex);
                    if (match && match[1]) {
                        return match[1];
                    }
                }

                return null;
            };
        }

        console.log('Admin button fix completed');
    }, 500); // Wait 500ms to ensure DOM is fully loaded
    }

    // Start the initialization process
    initializeWhenApiAvailable();
});
