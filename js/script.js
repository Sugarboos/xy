// ============================================
// QUIZ APP STATE MANAGEMENT
// ============================================

const appState = {
    currentPage: 'landing',
    currentQuestion: 0,
    answers: {},
    quizData: [
        {
            id: 'business-type',
            question: 'First, what type of business do you run?',
            options: [
                { value: 'ecommerce', label: 'E-commerce / Online Store' },
                { value: 'service', label: 'Service-Based Business' },
                { value: 'coaching', label: 'Coaching / Consulting' },
                { value: 'agency', label: 'Marketing / Creative Agency' },
                { value: 'other', label: 'Other' }
            ]
        },
        {
            id: 'lead-volume',
            question: 'How many leads do you generate per month?',
            options: [
                { value: 'low', label: 'Less than 50 leads' },
                { value: 'medium', label: '50-200 leads' },
                { value: 'high', label: '200-500 leads' },
                { value: 'very-high', label: '500+ leads' }
            ]
        },
        {
            id: 'challenge',
            question: 'What\'s your biggest challenge right now?',
            options: [
                { value: 'lead-gen', label: 'Generating enough leads' },
                { value: 'follow-up', label: 'Following up with leads consistently' },
                { value: 'conversion', label: 'Converting leads into customers' },
                { value: 'time', label: 'Not enough time for everything' }
            ]
        },
        {
            id: 'crm-usage',
            question: 'Do you currently use a CRM?',
            options: [
                { value: 'none', label: 'No CRM - I use spreadsheets or notes' },
                { value: 'basic', label: 'Yes, a basic CRM' },
                { value: 'advanced', label: 'Yes, an advanced CRM (like Synoriya)' },
                { value: 'switching', label: 'Looking to switch CRMs' }
            ]
        },
        {
            id: 'revenue-goal',
            question: 'What\'s your monthly revenue goal?',
            options: [
                { value: 'starter', label: 'Under $10K/month' },
                { value: 'growing', label: '$10K - $50K/month' },
                { value: 'scaling', label: '$50K - $100K/month' },
                { value: 'enterprise', label: '$100K+/month' }
            ]
        }
    ]
};

// ============================================
// DOM ELEMENTS
// ============================================

const screens = {
    landing: document.getElementById('landing-screen'),
    quiz: document.getElementById('quiz-screen'),
    booking: document.getElementById('booking-screen')
};

const elements = {
    getStartedBtn: document.getElementById('get-started-btn'),
    skipQuizBtn: document.getElementById('skip-quiz-btn'),
    questionContainer: document.getElementById('question-container'),
    progressDots: document.querySelectorAll('.progress-dot'),
    personalizedBenefit: document.getElementById('personalized-benefit')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Synoriya Landing Page loaded! 🚀');

    // Add keyboard support for quiz options
    addKeyboardSupport();

    // Initialize mobile menu
    initMobileMenu();

    // Check if we're coming from the call examples page
    if (sessionStorage.getItem('startQuizFromCallExamples') === 'true') {
        // Clear the flag so it doesn't trigger again on refresh
        sessionStorage.removeItem('startQuizFromCallExamples');

        // Small delay to ensure all elements are properly loaded
        setTimeout(() => {
            // Start the quiz
            trackEvent('quiz_started_from_call_examples');
            showScreen('quiz');
            renderQuestion(0);

            // Scroll to the quiz section
            const quizSection = document.getElementById('quiz-screen');
            if (quizSection) {
                quizSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    // Skip quiz button - go directly to booking
    if (elements.skipQuizBtn) {
        elements.skipQuizBtn.addEventListener('click', () => {
            console.log('Skip quiz clicked - going directly to booking');
            trackEvent('skip_quiz_clicked');
            showScreen('booking');
            loadCalendly();
        });
    }
});

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuItems = document.querySelectorAll('.mobile-menu-item');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Toggle dropdown menus
    menuItems.forEach(item => {
        const button = item.querySelector('.mobile-menu-link');
        if (button) {
            button.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================

function addKeyboardSupport() {
    // Handle Enter/Space on quiz options
    document.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('option-card')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
    });

    // Make option cards focusable
    document.addEventListener('DOMSubtreeModified', () => {
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
        });
    });
}

// ============================================
// ANALYTICS TRACKING (WITH CONSENT CHECK)
// ============================================

function trackEvent(eventName, eventParams = {}) {
    // Only track if user has given consent
    if (window.CookieConsent && window.CookieConsent.hasConsent('analytics')) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventParams);
        }
    }
}

// ============================================
// SCREEN NAVIGATION
// ============================================

function showScreen(screenName) {
    // Fade out current screen
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.add('fade-out');
        setTimeout(() => {
            currentScreen.classList.remove('active', 'fade-out');
        }, 300);
    }

    // Fade in new screen
    setTimeout(() => {
        screens[screenName].classList.add('active');
        appState.currentPage = screenName;

        // Track screen view
        trackEvent('screen_view', {
            screen_name: screenName
        });

        // Move focus to main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    }, 300);
}

// ============================================
// QUIZ FUNCTIONALITY
// ============================================

function renderQuestion(index) {
    const question = appState.quizData[index];

    const questionHTML = `
        <div class="question">
            <h3 class="question-text">${question.question}</h3>
            <div class="options">
                ${question.options.map(option => `
                    <div class="option-card" data-value="${option.value}" tabindex="0" role="button" aria-label="${option.label}">
                        ${option.label}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    elements.questionContainer.innerHTML = questionHTML;

    // Add click handlers to options
    const optionCards = elements.questionContainer.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => handleOptionClick(card, question.id));
    });

    // Update progress indicator
    updateProgress(index);
}

function handleOptionClick(card, questionId) {
    // Store answer
    appState.answers[questionId] = card.dataset.value;

    // Track quiz answer
    trackEvent('quiz_answer', {
        question_id: questionId,
        answer: card.dataset.value,
        question_number: appState.currentQuestion + 1
    });

    // Visual feedback
    const allCards = card.parentElement.querySelectorAll('.option-card');
    allCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // Move to next question after delay
    setTimeout(() => {
        appState.currentQuestion++;

        if (appState.currentQuestion < appState.quizData.length) {
            renderQuestion(appState.currentQuestion);
        } else {
            // Track quiz completion
            trackEvent('quiz_completed', {
                total_questions: appState.quizData.length
            });
            showBookingScreen();
        }
    }, 400);
}

function updateProgress(index) {
    elements.progressDots.forEach((dot, i) => {
        if (i <= index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update ARIA attributes
    const progressBar = document.querySelector('.progress-indicator');
    if (progressBar) {
        progressBar.setAttribute('aria-valuenow', index + 1);
    }
}

// ============================================
// BOOKING SCREEN PERSONALIZATION
// ============================================

function showBookingScreen() {
    // Personalize the benefit message based on their biggest challenge
    const challenge = appState.answers['challenge'];
    let benefit = 'transform your business';

    switch (challenge) {
        case 'lead-gen':
            benefit = 'generate more qualified leads automatically';
            break;
        case 'follow-up':
            benefit = 'automate your follow-ups and never miss a lead';
            break;
        case 'conversion':
            benefit = 'boost your conversion rates with smart automation';
            break;
        case 'time':
            benefit = 'save 10+ hours per week with automation';
            break;
    }

    elements.personalizedBenefit.textContent = benefit;

    // Show booking screen
    showScreen('booking');

    // Track booking page view
    trackEvent('booking_page_view', {
        challenge: challenge
    });

    //Load Calendly (with consent check)
    setTimeout(() => {
        loadCalendly();
    }, 500); // Small delay to ensure screen is visible

    // Store answers in localStorage (essential functionality - no consent needed)
    try {
        localStorage.setItem('quiz_answers', JSON.stringify(appState.answers));
    } catch (e) {
        console.error('Could not save quiz answers:', e);
    }
}

// ============================================
// CALENDLY INTEGRATION (CONSENT-PROTECTED)
// ============================================

function loadCalendly() {
    const bookingEmbed = document.getElementById('booking-embed');

    if (!bookingEmbed) return;

    // Show loading state
    bookingEmbed.innerHTML = `
        <div style="padding: var(--space-xl); text-align: center; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px;">
            <div style="display: inline-block; width: 48px; height: 48px; border: 4px solid rgba(168,85,247,0.2); border-top-color: #a855f7; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: var(--space-md);"></div>
            <p style="color: var(--text-secondary); font-size: var(--font-body);">Loading booking calendar...</p>
        </div>
    `;

    // Only load if we have consent for analytics/marketing cookies
    if (window.CookieConsent && window.CookieConsent.hasConsent('analytics')) {
        // Create Calendly widget
        const calendlyWidget = document.createElement('div');
        calendlyWidget.className = 'calendly-inline-widget';
        calendlyWidget.setAttribute('data-url', 'https://calendly.com/abdelalissa78/30min');
        calendlyWidget.style.minWidth = '320px';
        calendlyWidget.style.height = '700px';

        // Clear loading state and add widget
        bookingEmbed.innerHTML = '';
        bookingEmbed.appendChild(calendlyWidget);

        // Load Calendly script with error handling
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;

        script.onerror = () => {
            bookingEmbed.innerHTML = `
                <div style="padding: var(--space-xl); text-align: center; background: var(--card-bg); border: 1px solid rgba(255,100,100,0.3); border-radius: 16px;">
                    <p style="color: #ff6b6b; margin-bottom: var(--space-md); font-size: var(--font-body); font-weight: 600;">⚠️ Booking Calendar Unavailable</p>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md); font-size: var(--font-small);">
                        The booking calendar couldn't be loaded. This might be due to a network issue or ad blocker.
                    </p>
                    <p style="color: var(--text-muted); font-size: var(--font-small); margin-bottom: var(--space-lg);">
                        Please contact us directly to schedule your consultation:
                    </p>
                    <a href="mailto:abdelalissa78@gmail.com" style="display: inline-block; background: var(--accent); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                        📧 Email Us
                    </a>
                </div>
            `;
        };

        document.body.appendChild(script);
        console.log('✅ Calendly loaded with consent');
    } else {
        // Show message asking for consent
        bookingEmbed.innerHTML = `
            <div style="padding: var(--space-xl); text-align: center; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px;">
                <p style="color: var(--text-secondary); margin-bottom: var(--space-md); font-size: var(--font-body);">
                    📅 To view the booking calendar, please accept cookies.
                </p>
                <p style="color: var(--text-muted); font-size: var(--font-small);">
                    We use Calendly to manage appointments. Accepting cookies allows us to load the booking widget.
                </p>
            </div>
        `;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Get Started button
elements.getStartedBtn.addEventListener('click', () => {
    trackEvent('quiz_started');
    showScreen('quiz');
    renderQuestion(0);
});

// Error handling for Calendly
window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('calendly')) {
        console.error('Calendly failed to load');
        const bookingEmbed = document.getElementById('booking-embed');
        if (bookingEmbed) {
            bookingEmbed.innerHTML = `
                <div style="padding: var(--space-lg); text-align: center; background: var(--card-bg); border-radius: 12px;">
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        The booking calendar could not be loaded.
                    </p>
                    <p style="color: var(--text-muted); font-size: var(--font-small);">
                        Please contact us directly or try again later.
                    </p>
                </div>
            `;
        }
    }
}, true);
