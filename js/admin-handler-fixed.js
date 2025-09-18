/**
 * Delete admit card
 */
async function deleteAdmitCard() {
    console.log('deleteAdmitCard function called');

    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');
    const deleteModal = document.getElementById('delete-modal');

    try {
        const admitCardId = deleteModal.dataset.admitCardId;
        console.log('Admit card ID from dataset:', admitCardId);

        if (!admitCardId) {
            alert('Admit card ID not found.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        // Delete admit card from API
        await apiService.deleteAdmitCard(admitCardId);
        
        // Close modal first
        closeDeleteModal();
        
        // Create a success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Admit card deleted successfully.';
        successMessage.style.position = 'fixed';
        successMessage.style.top = '20px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '15px';
        successMessage.style.borderRadius = '5px';
        successMessage.style.zIndex = '1000';
        document.body.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);
        
        // Reload admit cards table
        await loadAdminAdmitCards();
        
    } catch (error) {
        console.error(`Error deleting admit card:`, error);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        
        // Close modal
        closeDeleteModal();
        
        // Reload admit cards table to ensure it's up to date
        await loadAdminAdmitCards();
    }
}
