/**
 * Brain Box to Web - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCROLL ANIMATION ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


    // --- 2. MOBILE MENU ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
            document.body.style.overflow = 'hidden'; 
        } else {
            icon.classList.replace('ph-x', 'ph-list');
            document.body.style.overflow = 'auto';
        }
    }
    if (mobileToggle) mobileToggle.addEventListener('click', toggleMenu);
    navItems.forEach(link => link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) toggleMenu();
    }));


    // --- 3. CONTACT FORM LOGIC (WEB3FORMS AJAX) ---
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const formFields = document.getElementById('form-fields'); // Container for inputs

    if (contactForm) {
        // Auto-fill logic from Pricing Page
        const urlParams = new URLSearchParams(window.location.search);
        const selectedPlan = urlParams.get('plan');
        if (selectedPlan) {
            const messageBox = contactForm.querySelector('textarea[name="message"]');
            if (messageBox) {
                messageBox.value = `Hi, I am interested in the ${selectedPlan} Package.`;
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // AJAX Submission Logic
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page reload

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Change button state
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    // SUCCESS: Hide inputs, Show Success Box
                    if(formFields) formFields.style.display = 'none';
                    submitBtn.style.display = 'none';
                    
                    if(successMessage) {
                        successMessage.style.display = 'block';
                    }
                    contactForm.reset();
                } else {
                    // Error from API
                    alert("Error: " + data.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }

            } catch (error) {
                console.error(error);
                alert("Something went wrong. Please check your connection.");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }
});


// --- 4. LIVE DEMO MODAL ---
function openDemo(url) {
    const modal = document.getElementById('demo-modal');
    const frame = document.getElementById('demo-frame');
    if (modal && frame) {
        frame.src = url;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
}
function closeDemo() {
    const modal = document.getElementById('demo-modal');
    const frame = document.getElementById('demo-frame');
    if (modal && frame) {
        modal.classList.remove('active');
        setTimeout(() => { frame.src = ''; }, 300);
        document.body.style.overflow = 'auto'; 
    }
}
window.addEventListener('click', (e) => {
    const modal = document.getElementById('demo-modal');
    if (e.target === modal) closeDemo();
});