/**
 * Advanced Survey Translation System
 * 
 * This script manages the multi-language translation system for surveys
 * with tabbed workflow and language version management.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for content to be fully loaded before attaching event handlers
    setTimeout(initTranslationSystem, 500);
});

function initTranslationSystem() {
    // Get DOM elements
    const translationFab = document.getElementById('translation-fab');
    const modal = document.getElementById('translation-modal');
    const closeBtn = modal?.querySelector('.close-modal-btn');
    const cancelBtn = modal?.querySelector('.cancel-btn');
    const backBtn = modal?.querySelector('.back-btn');
    const nextBtn = modal?.querySelector('.next-btn');
    const translateBtn = modal?.querySelector('.translate-btn');
    const applyBtn = modal?.querySelector('.apply-btn');
    const tabButtons = modal?.querySelectorAll('.tab-btn');
    const tabPanes = modal?.querySelectorAll('.tab-pane');
    const languageCheckboxes = modal?.querySelectorAll('.language-checkbox input');
    const progressSection = modal?.querySelector('.translation-progress');
    const progressBar = modal?.querySelector('.progress-fill');    // Check if all necessary elements exist
    if (!translationFab || !modal) {
        console.error('Translation UI elements not found');
        return;
    }
    
    // Hold translation data
    const surveyData = {
        original: {},
        translations: {},
        currentTab: 0,
        selectedLanguages: []
    };
    
    // Open translation modal
    translationFab.addEventListener('click', function() {
        captureSurveyContent();
        resetModal();
        modal.classList.add('active');
    });
    
    // Close translation modal
    function closeModal() {
        modal.classList.remove('active');
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Tab navigation
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            switchToTab(index);
        });
    });
    
    // Handle language checkbox changes
    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateLanguageSelection);
    });
    
    // Next button click
    nextBtn.addEventListener('click', () => {
        const nextTabIndex = surveyData.currentTab + 1;
        
        if (nextTabIndex === 1) { // Moving from language selection to preview
            if (surveyData.selectedLanguages.length === 0) {
                showMessage('Please select at least one target language', 'error');
                return;
            }
            
            // Hide next, show translate button
            nextBtn.style.display = 'none';
            translateBtn.style.display = 'block';
            
            // Enable back button
            backBtn.disabled = false;
        } 
        else if (nextTabIndex === 2) { // Moving from preview to settings
            // Hide translate button, show apply button
            translateBtn.style.display = 'none';
            applyBtn.style.display = 'block';
        }
        
        if (nextTabIndex < tabButtons.length) {
            switchToTab(nextTabIndex);
        }
    });
    
    // Back button click
    backBtn.addEventListener('click', () => {
        const prevTabIndex = surveyData.currentTab - 1;
        
        if (prevTabIndex === 0) { // Moving back to language selection
            // Show next button, hide others
            nextBtn.style.display = 'block';
            translateBtn.style.display = 'none';
            
            // Disable back button
            backBtn.disabled = true;
        }
        else if (prevTabIndex === 1) { // Moving back to preview
            // Show translate button, hide apply
            translateBtn.style.display = 'block';
            applyBtn.style.display = 'none';
        }
        
        if (prevTabIndex >= 0) {
            switchToTab(prevTabIndex);
        }
    });
    
    // Translate button click
    translateBtn.addEventListener('click', () => {
        startTranslation();
    });
    
    // Apply button click
    applyBtn.addEventListener('click', () => {
        applyTranslations();
        closeModal();
    });

        // Hide language selection and show progress
        languageDropdown.disabled = true;
        startTranslationBtn.disabled = true;
        progressSection.style.display = 'block';
        
        // Reset result messages
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        // Simulate translation process (replace with actual API call)
        simulateTranslation(targetLanguage)
            .then(result => {
                // Store translated content
                translatedContent = result;
                
                // Show success message and enable apply button
                progressSection.style.display = 'none';
                successMsg.style.display = 'flex';
                applyTranslationBtn.style.display = 'block';
            })
            .catch(error => {
                // Show error message
                progressSection.style.display = 'none';
                errorMsg.style.display = 'flex';
                console.error('Translation error:', error);
            });
    });

    // Event: Apply translation
    applyTranslationBtn.addEventListener('click', function() {
        applyTranslation(translatedContent);
        closeModal();
    });

    function captureCurrentSurveyContent() {
        originalSurveyContent = {
            title: document.querySelector('.survey-title')?.textContent || '',
            description: document.querySelector('.survey-description')?.textContent || '',
            questions: []
        };

        // Capture questions
        document.querySelectorAll('.question-block').forEach(block => {
            const questionObj = {
                title: block.querySelector('.question-title')?.textContent || '',
                options: []
            };

            // Capture answer options based on question type
            const ratingScale = block.querySelector('.rating-scale');
            const checkboxGroup = block.querySelector('.checkbox-group');
            const textarea = block.querySelector('.feedback-textarea');

            if (ratingScale) {
                // Rating scale question
                ratingScale.querySelectorAll('.scale-option').forEach(option => {
                    const label = option.querySelector('.rating-label')?.textContent;
                    if (label) {
                        questionObj.options.push(label);
                    }
                });
            } else if (checkboxGroup) {
                // Checkbox question
                checkboxGroup.querySelectorAll('.checkbox-option label').forEach(label => {
                    questionObj.options.push(label.textContent);
                });
            } else if (textarea) {
                // Text question
                questionObj.placeholder = textarea.getAttribute('placeholder') || '';
            }

            originalSurveyContent.questions.push(questionObj);
        });

        console.log('Captured survey content:', originalSurveyContent);
    }

    function resetModal() {
        // Reset dropdown
        languageDropdown.value = '';
        languageDropdown.disabled = false;
        
        // Reset buttons
        startTranslationBtn.disabled = true;
        applyTranslationBtn.style.display = 'none';
        
        // Reset progress and messages
        progressSection.style.display = 'none';
        progressBar.style.width = '0%';
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
    }

    // This function would be replaced with an actual API call to a translation service
    function simulateTranslation(targetLanguage) {
        return new Promise((resolve, reject) => {
            // Show progress animation
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);

            // Mock translation logic - replace with actual API call
            setTimeout(() => {
                clearInterval(interval);
                progressBar.style.width = '100%';

                // Generate a simulated translation based on language code
                const translated = {
                    languageCode: targetLanguage,
                    title: translateText(originalSurveyContent.title, targetLanguage),
                    description: translateText(originalSurveyContent.description, targetLanguage),
                    questions: originalSurveyContent.questions.map(q => ({
                        title: translateText(q.title, targetLanguage),
                        options: q.options.map(opt => translateText(opt, targetLanguage)),
                        placeholder: q.placeholder ? translateText(q.placeholder, targetLanguage) : undefined
                    }))
                };

                resolve(translated);
            }, 2000); // Simulate a 2-second translation process
        });
    }

    // Mock translation function - replace with actual translation API
    function translateText(text, languageCode) {
        if (!text) return '';
        
        // This is just a simulation - in production, call a real translation API
        const mockTranslations = {
            'en': {
                'Customer Satisfaction Survey': 'Customer Satisfaction Survey',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Please help us improve our service by answering a few questions about your recent experience.',
                'How satisfied were you with our service?': 'How satisfied were you with our service?',
                'Very Dissatisfied': 'Very Dissatisfied',
                'Very Satisfied': 'Very Satisfied',
                'What aspects of our service did you appreciate the most?': 'What aspects of our service did you appreciate the most?',
                'Speed of service': 'Speed of service',
                'Quality of products': 'Quality of products',
                'Staff knowledge': 'Staff knowledge',
                'Value for money': 'Value for money',
                'Please provide any additional feedback or suggestions.': 'Please provide any additional feedback or suggestions.',
                'Enter your feedback here...': 'Enter your feedback here...'
            },
            'sv': {
                'Customer Satisfaction Survey': 'Kundnöjdhetsenkät',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Hjälp oss att förbättra vår service genom att svara på några frågor om din senaste upplevelse.',
                'How satisfied were you with our service?': 'Hur nöjd var du med vår service?',
                'Very Dissatisfied': 'Mycket missnöjd',
                'Very Satisfied': 'Mycket nöjd',
                'What aspects of our service did you appreciate the most?': 'Vilka aspekter av vår service uppskattade du mest?',
                'Speed of service': 'Snabbhet i servicen',
                'Quality of products': 'Kvalitet på produkter',
                'Staff knowledge': 'Personalens kunskap',
                'Value for money': 'Prisvärdhet',
                'Please provide any additional feedback or suggestions.': 'Vänligen ge ytterligare feedback eller förslag.',
                'Enter your feedback here...': 'Ange din feedback här...'
            },
            'fi': {
                'Customer Satisfaction Survey': 'Asiakastyytyväisyyskysely',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Auta meitä parantamaan palveluamme vastaamalla muutamaan kysymykseen viimeaikaisesta kokemuksestasi.',
                'How satisfied were you with our service?': 'Kuinka tyytyväinen olit palveluumme?',
                'Very Dissatisfied': 'Erittäin tyytymätön',
                'Very Satisfied': 'Erittäin tyytyväinen',
                'What aspects of our service did you appreciate the most?': 'Mitä palvelumme osa-alueita arvostit eniten?',
                'Speed of service': 'Palvelun nopeus',
                'Quality of products': 'Tuotteiden laatu',
                'Staff knowledge': 'Henkilökunnan osaaminen',
                'Value for money': 'Vastine rahalle',
                'Please provide any additional feedback or suggestions.': 'Anna lisäpalautetta tai ehdotuksia.',
                'Enter your feedback here...': 'Kirjoita palautteesi tähän...'
            },
            'de': {
                'Customer Satisfaction Survey': 'Kundenzufriedenheitsumfrage',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Bitte helfen Sie uns, unseren Service zu verbessern, indem Sie einige Fragen zu Ihren letzten Erfahrungen beantworten.',
                'How satisfied were you with our service?': 'Wie zufrieden waren Sie mit unserem Service?',
                'Very Dissatisfied': 'Sehr unzufrieden',
                'Very Satisfied': 'Sehr zufrieden',
                'What aspects of our service did you appreciate the most?': 'Welche Aspekte unseres Services haben Sie am meisten geschätzt?',
                'Speed of service': 'Schnelligkeit des Services',
                'Quality of products': 'Qualität der Produkte',
                'Staff knowledge': 'Kenntnisse der Mitarbeiter',
                'Value for money': 'Preis-Leistungs-Verhältnis',
                'Please provide any additional feedback or suggestions.': 'Bitte geben Sie zusätzliches Feedback oder Vorschläge.',
                'Enter your feedback here...': 'Geben Sie hier Ihr Feedback ein...'
            }
        };
        
        // Check if we have translations for this language
        if (mockTranslations[languageCode] && mockTranslations[languageCode][text]) {
            return mockTranslations[languageCode][text];
        }
        
        // If no translation found, return original with a language prefix
        const prefixes = {
            'sv': '[SV] ',
            'fi': '[FI] ',
            'de': '[DE] ',
            'fr': '[FR] ',
            'es': '[ES] ',
            'it': '[IT] ',
            'no': '[NO] ',
            'da': '[DA] ',
            'ru': '[RU] '
        };
        
        return (prefixes[languageCode] || '') + text;
    }

    function applyTranslation(translatedContent) {
        // Update survey title and description
        const titleElement = document.querySelector('.survey-title');
        const descriptionElement = document.querySelector('.survey-description');

        if (titleElement) {
            titleElement.textContent = translatedContent.title;
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = translatedContent.description;
        }

        // Update questions
        const questionBlocks = document.querySelectorAll('.question-block');
        questionBlocks.forEach((block, index) => {
            if (index >= translatedContent.questions.length) return;
            
            const questionData = translatedContent.questions[index];
            const titleElement = block.querySelector('.question-title');
            
            if (titleElement) {
                titleElement.textContent = questionData.title;
            }

            // Update answer options based on question type
            const ratingScale = block.querySelector('.rating-scale');
            const checkboxGroup = block.querySelector('.checkbox-group');
            const textarea = block.querySelector('.feedback-textarea');

            if (ratingScale) {
                // Rating scale question
                const labels = block.querySelectorAll('.rating-label');
                labels.forEach((label, idx) => {
                    if (idx < questionData.options.length && questionData.options[idx]) {
                        label.textContent = questionData.options[idx];
                    }
                });
            } else if (checkboxGroup) {
                // Checkbox question
                const labels = block.querySelectorAll('.checkbox-option label');
                labels.forEach((label, idx) => {
                    if (idx < questionData.options.length) {
                        label.textContent = questionData.options[idx];
                    }
                });
            } else if (textarea && questionData.placeholder) {
                // Text question
                textarea.setAttribute('placeholder', questionData.placeholder);
            }
        });

        // Show a notification that translation was applied
        showNotification(`Survey translated to ${getLanguageName(translatedContent.languageCode)}`);
    }

    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'sv': 'Swedish',
            'fi': 'Finnish',
            'de': 'German',
            'fr': 'French',
            'es': 'Spanish',
            'it': 'Italian',
            'no': 'Norwegian',
            'da': 'Danish',
            'ru': 'Russian'
        };
        
        return languages[code] || code;
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'survey-notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}
