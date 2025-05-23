// Create a button in the UI to open the EmailJS setup guide
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the email-guide-btn
    const guideBtn = document.getElementById('email-guide-btn');
    if (guideBtn) {
        guideBtn.addEventListener('click', function() {
            window.open('emailjs-setup-guide.html', '_blank');
        });
    }
});
