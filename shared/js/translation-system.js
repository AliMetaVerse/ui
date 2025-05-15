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
    const progressBar = modal?.querySelector('.progress-fill');
    const successMsg = modal?.querySelector('.result-message.success');
    const errorMsg = modal?.querySelector('.result-message.error');
    
    // Check if all necessary elements exist
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
    
    function switchToTab(tabIndex) {
        // Update active tab
        tabButtons.forEach((btn, i) => {
            btn.classList.toggle('active', i === tabIndex);
        });
        
        tabPanes.forEach((pane, i) => {
            pane.classList.toggle('active', i === tabIndex);
        });
        
        surveyData.currentTab = tabIndex;
    }
    
    function updateLanguageSelection() {
        // Get all selected languages
        surveyData.selectedLanguages = Array.from(languageCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
            
        // Enable next button only if at least one language is selected
        nextBtn.disabled = surveyData.selectedLanguages.length === 0;
    }
    
    function captureSurveyContent() {
        surveyData.original = {
            title: document.querySelector('.survey-title')?.textContent || '',
            description: document.querySelector('.survey-description')?.textContent || '',
            questions: []
        };
        
        // Capture all questions
        document.querySelectorAll('.question-block').forEach(block => {
            const questionObj = {
                title: block.querySelector('.question-title')?.textContent || '',
                options: []
            };
            
            // Capture options based on question type
            const ratingScale = block.querySelector('.rating-scale');
            const checkboxGroup = block.querySelector('.checkbox-group');
            const textarea = block.querySelector('.feedback-textarea');
            
            if (ratingScale) {
                // Rating scale question
                ratingScale.querySelectorAll('.scale-option').forEach(option => {
                    const ratingNumber = option.querySelector('.rating-number')?.textContent;
                    const ratingLabel = option.querySelector('.rating-label')?.textContent;
                    
                    if (ratingLabel) {
                        questionObj.options.push({
                            number: ratingNumber,
                            label: ratingLabel
                        });
                    }
                });
                questionObj.type = 'rating';
            } 
            else if (checkboxGroup) {
                // Checkbox question
                checkboxGroup.querySelectorAll('.checkbox-option').forEach(option => {
                    const id = option.querySelector('input')?.id;
                    const label = option.querySelector('label')?.textContent;
                    
                    questionObj.options.push({
                        id: id,
                        label: label
                    });
                });
                questionObj.type = 'checkbox';
            }
            else if (textarea) {
                // Text question
                questionObj.placeholder = textarea.getAttribute('placeholder') || '';
                questionObj.type = 'text';
            }
            
            surveyData.original.questions.push(questionObj);
        });
        
        console.log('Captured original survey content:', surveyData.original);
    }
    
    function resetModal() {
        // Reset tab navigation
        switchToTab(0);
        
        // Reset language selection
        languageCheckboxes.forEach(cb => {
            cb.checked = false;
        });
        
        // Reset navigation buttons
        nextBtn.disabled = true;
        nextBtn.style.display = 'block';
        backBtn.disabled = true;
        translateBtn.style.display = 'none';
        applyBtn.style.display = 'none';
        
        // Reset progress indicators
        progressSection.style.display = 'none';
        progressBar.style.width = '0%';
        
        // Reset translations
        surveyData.translations = {};
        surveyData.selectedLanguages = [];
        
        // Disable tabs 2 and 3
        tabButtons[1].disabled = true;
        tabButtons[2].disabled = true;
        
        // Clear any messages
        hideAllMessages();
    }
    
    function startTranslation() {
        if (surveyData.selectedLanguages.length === 0) {
            return;
        }
        
        // Show progress
        progressSection.style.display = 'block';
        translateBtn.disabled = true;
        
        // Reset progress
        progressBar.style.width = '0%';
        
        // Simulate translation for each selected language
        const promises = surveyData.selectedLanguages.map(lang => {
            return translateToLanguage(surveyData.original, lang);
        });
        
        // Set up progress updates
        let progress = 0;
        const increment = 100 / (promises.length * 20); // 20 steps per language
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress > 95) progress = 95; // Cap at 95% until complete
            progressBar.style.width = `${progress}%`;
        }, 100);
        
        // Process all translations
        Promise.all(promises)
            .then(results => {
                // Store translations
                results.forEach(result => {
                    surveyData.translations[result.languageCode] = result;
                });
                
                // Complete progress animation
                clearInterval(progressInterval);
                progressBar.style.width = '100%';
                
                // Update UI
                setTimeout(() => {
                    progressSection.style.display = 'none';
                    translateBtn.disabled = false;
                    
                    // Enable next button to go to settings
                    nextBtn.style.display = 'block';
                    translateBtn.style.display = 'none';
                    
                    // Enable the settings tab
                    tabButtons[2].disabled = false;
                    
                    // Create preview tabs and content
                    generateTranslationPreview();
                    
                    // Show success message
                    showMessage('Translation completed successfully!', 'success');
                }, 500);
            })
            .catch(error => {
                clearInterval(progressInterval);
                progressSection.style.display = 'none';
                translateBtn.disabled = false;
                
                showMessage('An error occurred during translation. Please try again.', 'error');
                console.error('Translation error:', error);
            });
    }
    
    function generateTranslationPreview() {
        const languageTabHeader = modal.querySelector('.language-tab-header');
        const languageTabContent = modal.querySelector('.language-tab-content');
        
        // Clear existing tabs and content
        languageTabHeader.innerHTML = '';
        languageTabContent.innerHTML = '';
        
        // Add tab for original language
        const originalLang = 'en';
        const originalBtn = document.createElement('button');
        originalBtn.className = 'language-tab-btn active';
        originalBtn.dataset.lang = originalLang;
        originalBtn.textContent = getLanguageName(originalLang);
        languageTabHeader.appendChild(originalBtn);
        
        // Add tabs for each translated language
        surveyData.selectedLanguages.forEach(lang => {
            const btn = document.createElement('button');
            btn.className = 'language-tab-btn';
            btn.dataset.lang = lang;
            btn.textContent = getLanguageName(lang);
            languageTabHeader.appendChild(btn);
        });
        
        // Add event listeners to language tabs
        const langTabBtns = languageTabHeader.querySelectorAll('.language-tab-btn');
        langTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active tab
                langTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show content for selected language
                showLanguagePreview(btn.dataset.lang);
            });
        });
        
        // Show initial preview for original language
        showLanguagePreview(originalLang);
    }
    
    function showLanguagePreview(langCode) {
        const contentPane = modal.querySelector('.language-tab-content');
        contentPane.innerHTML = '';
        
        // Get data for this language
        const data = langCode === 'en' ? surveyData.original : surveyData.translations[langCode];
        
        if (!data) {
            contentPane.innerHTML = '<p>No translation data available.</p>';
            return;
        }
        
        // Title preview
        const titleItem = document.createElement('div');
        titleItem.className = 'preview-item';
        titleItem.innerHTML = `
            <div class="preview-label">Survey Title</div>
            <div class="preview-text">${data.title}</div>
        `;
        contentPane.appendChild(titleItem);
        
        // Description preview
        const descItem = document.createElement('div');
        descItem.className = 'preview-item';
        descItem.innerHTML = `
            <div class="preview-label">Survey Description</div>
            <div class="preview-text">${data.description}</div>
        `;
        contentPane.appendChild(descItem);
        
        // Questions preview
        data.questions.forEach((q, i) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'preview-item';
            
            let optionsHtml = '';
            if (q.type === 'rating') {
                const firstOption = q.options[0]?.label || '';
                const lastOption = q.options[q.options.length - 1]?.label || '';
                optionsHtml = `<div class="preview-options">
                    <span>${firstOption}</span> ... <span>${lastOption}</span>
                </div>`;
            } 
            else if (q.type === 'checkbox') {
                optionsHtml = `<div class="preview-options">
                    <ul>
                        ${q.options.map(opt => `<li>${opt.label}</li>`).join('')}
                    </ul>
                </div>`;
            }
            else if (q.type === 'text') {
                optionsHtml = `<div class="preview-options">
                    <span class="preview-placeholder">${q.placeholder}</span>
                </div>`;
            }
            
            questionItem.innerHTML = `
                <div class="preview-label">Question ${i + 1}</div>
                <div class="preview-text">${q.title}</div>
                ${optionsHtml}
            `;
            
            contentPane.appendChild(questionItem);
        });
    }
    
    function applyTranslations() {
        // This would normally save the translations to the backend
        // For now, we'll just update the UI with the most recently selected language
        
        // Get the currently selected language tab
        const activeLanguageTab = modal.querySelector('.language-tab-btn.active');
        const langCode = activeLanguageTab?.dataset.lang;
        
        if (!langCode || langCode === 'en') {
            showNotification('Returned to original language version');
            return;
        }
        
        const translationData = surveyData.translations[langCode];
        if (!translationData) {
            showNotification('Translation data not available', 'error');
            return;
        }
        
        // Apply the translation to the survey
        // Survey title and description
        const titleElement = document.querySelector('.survey-title');
        const descriptionElement = document.querySelector('.survey-description');
        
        if (titleElement) {
            titleElement.textContent = translationData.title;
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = translationData.description;
        }
        
        // Questions
        const questionBlocks = document.querySelectorAll('.question-block');
        questionBlocks.forEach((block, index) => {
            if (index >= translationData.questions.length) return;
            
            const questionData = translationData.questions[index];
            const titleElement = block.querySelector('.question-title');
            
            // Update question title
            if (titleElement) {
                titleElement.textContent = questionData.title;
            }
            
            // Update options based on question type
            if (questionData.type === 'rating') {
                const labels = block.querySelectorAll('.rating-label');
                questionData.options.forEach((option, idx) => {
                    const label = labels[idx === 0 ? 0 : labels.length - 1]; // Only first and last have labels
                    if (label && option.label) {
                        label.textContent = option.label;
                    }
                });
            } 
            else if (questionData.type === 'checkbox') {
                const labels = block.querySelectorAll('.checkbox-option label');
                labels.forEach((label, idx) => {
                    if (idx < questionData.options.length) {
                        label.textContent = questionData.options[idx].label;
                    }
                });
            } 
            else if (questionData.type === 'text') {
                const textarea = block.querySelector('.feedback-textarea');
                if (textarea && questionData.placeholder) {
                    textarea.setAttribute('placeholder', questionData.placeholder);
                }
            }
        });
        
        // Show confirmation notification
        const saveAsSeparate = document.getElementById('setting-save-versions')?.checked;
        const addLangSelector = document.getElementById('setting-language-selector')?.checked;
        
        let message = `Survey translated to ${getLanguageName(langCode)}`;
        if (saveAsSeparate) {
            message += ' and saved as a separate language version';
        }
        showNotification(message);
    }
    
    // Translate content using mock translation API
    function translateToLanguage(content, targetLang) {
        return new Promise((resolve, reject) => {
            // In production, replace with real API call
            setTimeout(() => {
                try {
                    // Create a deep copy of the original and translate text fields
                    const translated = JSON.parse(JSON.stringify(content));
                    translated.languageCode = targetLang;
                    
                    // Translate survey title and description
                    translated.title = translateText(content.title, targetLang);
                    translated.description = translateText(content.description, targetLang);
                    
                    // Translate questions
                    translated.questions.forEach((q, i) => {
                        q.title = translateText(content.questions[i].title, targetLang);
                        
                        if (q.type === 'rating') {
                            q.options.forEach((opt, j) => {
                                const originalOpt = content.questions[i].options[j];
                                if (originalOpt && originalOpt.label) {
                                    opt.label = translateText(originalOpt.label, targetLang);
                                }
                            });
                        }
                        else if (q.type === 'checkbox') {
                            q.options.forEach((opt, j) => {
                                const originalOpt = content.questions[i].options[j];
                                if (originalOpt && originalOpt.label) {
                                    opt.label = translateText(originalOpt.label, targetLang);
                                }
                            });
                        }
                        else if (q.type === 'text' && q.placeholder) {
                            q.placeholder = translateText(content.questions[i].placeholder, targetLang);
                        }
                    });
                    
                    resolve(translated);
                } catch (error) {
                    reject(error);
                }
            }, 1500); // Simulate API delay
        });
    }
    
    // Translation mock function
    function translateText(text, languageCode) {
        if (!text) return '';
        
        // Example translations based on language code
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
            },
            'fr': {
                'Customer Satisfaction Survey': 'Enquête de satisfaction client',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Aidez-nous à améliorer notre service en répondant à quelques questions sur votre expérience récente.',
                'How satisfied were you with our service?': 'Quel est votre niveau de satisfaction concernant notre service ?',
                'Very Dissatisfied': 'Très insatisfait',
                'Very Satisfied': 'Très satisfait',
                'What aspects of our service did you appreciate the most?': 'Quels aspects de notre service avez-vous le plus appréciés ?',
                'Speed of service': 'Rapidité du service',
                'Quality of products': 'Qualité des produits',
                'Staff knowledge': 'Connaissances du personnel',
                'Value for money': 'Rapport qualité-prix',
                'Please provide any additional feedback or suggestions.': 'Veuillez fournir des commentaires ou suggestions supplémentaires.',
                'Enter your feedback here...': 'Entrez vos commentaires ici...'
            },
            'es': {
                'Customer Satisfaction Survey': 'Encuesta de satisfacción del cliente',
                'Please help us improve our service by answering a few questions about your recent experience.': 'Ayúdenos a mejorar nuestro servicio respondiendo algunas preguntas sobre su experiencia reciente.',
                'How satisfied were you with our service?': '¿Qué tan satisfecho está con nuestro servicio?',
                'Very Dissatisfied': 'Muy insatisfecho',
                'Very Satisfied': 'Muy satisfecho',
                'What aspects of our service did you appreciate the most?': '¿Qué aspectos de nuestro servicio apreció más?',
                'Speed of service': 'Velocidad del servicio',
                'Quality of products': 'Calidad de los productos',
                'Staff knowledge': 'Conocimiento del personal',
                'Value for money': 'Relación calidad-precio',
                'Please provide any additional feedback or suggestions.': 'Por favor, proporcione comentarios o sugerencias adicionales.',
                'Enter your feedback here...': 'Ingrese sus comentarios aquí...'
            }
        };
        
        // Look up translation
        if (mockTranslations[languageCode] && mockTranslations[languageCode][text]) {
            return mockTranslations[languageCode][text];
        }
        
        // Fallback for unknown translations
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
    
    function showMessage(message, type) {
        const successMsg = modal.querySelector('.result-message.success');
        const errorMsg = modal.querySelector('.result-message.error');
        
        // Hide both messages
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';
        
        // Show the appropriate one
        if (type === 'success') {
            successMsg.querySelector('span').textContent = message;
            successMsg.style.display = 'flex';
        } else {
            errorMsg.querySelector('span').textContent = message;
            errorMsg.style.display = 'flex';
        }
        
        // Auto-hide after a delay
        setTimeout(hideAllMessages, 5000);
    }
    
    function hideAllMessages() {
        const successMsg = modal.querySelector('.result-message.success');
        const errorMsg = modal.querySelector('.result-message.error');
        
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
    }
    
    function showNotification(message, type = 'success') {
        // Create or get existing notification
        let notification = document.querySelector('.survey-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'survey-notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = 'survey-notification';
        
        if (type === 'error') {
            notification.classList.add('error');
        } else {
            notification.classList.add('success');
        }
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
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
}
