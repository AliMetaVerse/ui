/**
 * Page Structure Panel Manager
 * 
 * Handles loading, rendering, and interaction with the survey's page structure panel.
 * Features include:
 * - Drag and drop reordering of pages and questions
 * - Collapsible panel functionality
 * - Highlighting active items
 * - Deletion with confirmation
 * - Duplication of pages and questions
 * - Adding new pages and questions
 * - Thin, light blue scrollbars for better navigation
 */

class PageStructurePanelManager {
    constructor() {
        this.panel = null;
        this.isCollapsed = false;
        this.surveyData = {
            pages: [] // Will be populated with actual survey data
        };
        this.activePage = null;
        this.activeQuestion = null;
    }    /**
     * Initialize the page structure panel
     */
    async init() {
        // Load the panel HTML
        await this.loadPanelHTML();
        
        // Add the panel to the DOM
        this.insertPanelIntoDOM();
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Load sample data (to be replaced with actual survey data)
        this.loadSampleData();
        
        // Render the panel
        this.renderPanel();
        
        console.log('Page Structure Panel initialized');
    }

    /**
     * Load the panel HTML template
     */
    async loadPanelHTML() {
        try {
            const response = await fetch('components/page-structure-panel.html');
            const html = await response.text();
            
            // Create a temporary container to hold the HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            
            // Get the panel element
            this.panel = tempContainer.firstElementChild;
        } catch (error) {
            console.error('Error loading page structure panel HTML:', error);
        }
    }    /**
     * Insert the panel into the DOM
     */
    insertPanelIntoDOM() {
        if (!this.panel) {
            console.error('Panel HTML not loaded');
            return;
        }

        // Find the main content area where we'll insert the panel
        const mainContentBody = document.querySelector('.main-content-body');
        if (!mainContentBody) {
            console.error('Could not find main-content-body element');
            return;
        }
        
        // Get the header height for more precise calculations
        const headerHeight = document.querySelector('.main-header-area')?.offsetHeight || 180;
        const availableHeight = `calc(100vh - ${headerHeight}px)`;
        
        // Ensure main content body takes full available height and doesn't scroll
        mainContentBody.style.overflow = 'hidden';
        mainContentBody.style.height = availableHeight;
        mainContentBody.style.boxSizing = 'border-box';

        // Create a container for the editor layout
        const editorLayoutContainer = document.createElement('div');
        editorLayoutContainer.className = 'editor-layout-container';
        
        // Move any existing content in mainContentBody to the editor area
        const editorArea = document.createElement('div');
        editorArea.className = 'editor-area';
        while (mainContentBody.firstChild) {
            editorArea.appendChild(mainContentBody.firstChild);
        }
        
        // Add the panel and editor area to the layout container
        editorLayoutContainer.appendChild(this.panel);
        editorLayoutContainer.appendChild(editorArea);
        
        // Add the layout container to the main content body
        mainContentBody.appendChild(editorLayoutContainer);
        
        // Add necessary styles to the main content body
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .editor-layout-container {
                display: flex;
                height: ${availableHeight};
                overflow: hidden;
                box-sizing: border-box;
            }
            
            .editor-area {
                flex: 1;
                overflow-y: auto;
                padding: 1px 20px;
                height: 100%;
                box-sizing: border-box;
                -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
            }
            
            /* Fix height calculations for nested elements */
            .main-content-body {
                height: ${availableHeight} !important;
                overflow: hidden !important;
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(styleElement);
    }    /* Removed context-aware scrollbars implementation in favor of CSS-only approach */

    /**
     * Set up event listeners for the panel
     */
    setupEventListeners() {
        // Panel toggle (collapse/expand)
        const toggleBtn = this.panel.querySelector('.panel-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.togglePanel());
        }
        
        // Page collapse toggles
        this.panel.querySelectorAll('.page-collapse-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const pageItem = e.target.closest('.page-item');
                if (pageItem) {
                    this.togglePageCollapse(pageItem);
                }
            });
        });
        
        // Add page button
        const addPageBtn = this.panel.querySelector('.add-page-btn');
        if (addPageBtn) {
            addPageBtn.addEventListener('click', () => this.addNewPage());
        }
        
        // Add question button
        const addQuestionBtn = this.panel.querySelector('.add-question-btn');
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', () => this.addNewQuestion());
        }
        
        // Delete, duplicate, and move actions
        this.panel.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const pageItem = target.closest('.page-item');
            const questionItem = target.closest('.question-item');
            
            if (target.title === 'Delete page' && pageItem) {
                this.confirmDelete('page', pageItem);
            } 
            else if (target.title === 'Delete question' && questionItem) {
                this.confirmDelete('question', questionItem);
            }
            else if (target.title === 'Duplicate page' && pageItem) {
                this.duplicateItem('page', pageItem);
            }
            else if (target.title === 'Duplicate question' && questionItem) {
                this.duplicateItem('question', questionItem);
            }
            else if ((target.title === 'Move page' || target.title === 'Move question')) {
                // This would be handled by the drag and drop, but could add arrow controls here
            }
        });
        
        // Selection of pages and questions
        this.panel.addEventListener('click', (e) => {
            const pageItem = e.target.closest('.page-item');
            const questionItem = e.target.closest('.question-item');
            
            // Ignore clicks on action buttons and drag handles
            if (e.target.closest('button') || 
                e.target.closest('.page-drag-handle') || 
                e.target.closest('.question-drag-handle') ||
                e.target.closest('.page-collapse-toggle')) {
                return;
            }
            
            if (questionItem) {
                this.selectQuestion(questionItem);
            } else if (pageItem && !questionItem) {
                this.selectPage(pageItem);
            }
        });
        
        // Initialize drag and drop
        this.setupDragAndDrop();
    }
    
    /**
     * Set up drag and drop functionality
     */
    setupDragAndDrop() {
        // Allow dragging for page headers
        this.panel.querySelectorAll('.page-drag-handle').forEach(handle => {
            const pageItem = handle.closest('.page-item');
            
            handle.addEventListener('mousedown', () => {
                pageItem.setAttribute('draggable', true);
            });
            
            pageItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', 'page');
                e.dataTransfer.setData('id', pageItem.dataset.pageId);
                pageItem.classList.add('dragging');
            });
            
            pageItem.addEventListener('dragend', () => {
                pageItem.classList.remove('dragging');
                pageItem.setAttribute('draggable', false);
            });
        });
        
        // Allow dragging for questions
        this.panel.querySelectorAll('.question-drag-handle').forEach(handle => {
            const questionItem = handle.closest('.question-item');
            
            handle.addEventListener('mousedown', () => {
                questionItem.setAttribute('draggable', true);
            });
            
            questionItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('type', 'question');
                e.dataTransfer.setData('id', questionItem.dataset.questionId);
                e.dataTransfer.setData('pageId', questionItem.closest('.page-item').dataset.pageId);
                questionItem.classList.add('dragging');
            });
            
            questionItem.addEventListener('dragend', () => {
                questionItem.classList.remove('dragging');
                questionItem.setAttribute('draggable', false);
            });
        });
        
        // Set up drop zones
        this.panel.querySelectorAll('.page-list, .question-list').forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggableElement = document.querySelector('.dragging');
                if (!draggableElement) return;
                
                const isPageList = list.classList.contains('page-list');
                const isQuestionList = list.classList.contains('question-list');
                const draggedType = draggableElement.classList.contains('page-item') ? 'page' : 'question';
                
                // Only allow dropping pages into page list and questions into question list
                if ((isPageList && draggedType === 'page') || 
                    (isQuestionList && draggedType === 'question')) {
                    list.classList.add('drag-over');
                }
            });
            
            list.addEventListener('dragleave', () => {
                list.classList.remove('drag-over');
            });
            
            list.addEventListener('drop', (e) => {
                e.preventDefault();
                list.classList.remove('drag-over');
                
                const type = e.dataTransfer.getData('type');
                const id = e.dataTransfer.getData('id');
                const sourcePageId = e.dataTransfer.getData('pageId');
                
                if (type === 'page' && list.classList.contains('page-list')) {
                    this.handlePageDrop(id, list);
                } 
                else if (type === 'question' && list.classList.contains('question-list')) {
                    const targetPageId = list.closest('.page-item').dataset.pageId;
                    this.handleQuestionDrop(id, sourcePageId, targetPageId, list);
                }
            });
        });
    }
    
    /**
     * Handle dropping a page in a new position
     */
    handlePageDrop(pageId, pageList) {
        const pageElement = document.querySelector(`.page-item[data-page-id="${pageId}"]`);
        if (!pageElement) return;
        
        const afterElement = this.getDragAfterElement(pageList, pageElement);
        if (afterElement) {
            pageList.insertBefore(pageElement, afterElement);
        } else {
            pageList.appendChild(pageElement);
        }
        
        // Update the survey data structure
        this.updateSurveyStructure();
    }
    
    /**
     * Handle dropping a question in a new position
     */
    handleQuestionDrop(questionId, sourcePageId, targetPageId, questionList) {
        const questionElement = document.querySelector(`.question-item[data-question-id="${questionId}"]`);
        if (!questionElement) return;
        
        const afterElement = this.getDragAfterElement(questionList, questionElement);
        if (afterElement) {
            questionList.insertBefore(questionElement, afterElement);
        } else {
            questionList.appendChild(questionElement);
        }
        
        // If moved to a different page, update data structures
        if (sourcePageId !== targetPageId) {
            // Logic to update the survey data structure will go here
        }
        
        // Update the survey data structure
        this.updateSurveyStructure();
    }
    
    /**
     * Helper function to determine the position for dropped items
     */
    getDragAfterElement(container, draggedElement) {
        const draggableElements = [...container.querySelectorAll(
            draggedElement.classList.contains('page-item') ? '.page-item:not(.dragging)' : '.question-item:not(.dragging)'
        )];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = box.top + box.height / 2 - event.clientY;
            
            if (offset > 0 && offset < closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.POSITIVE_INFINITY }).element;
    }

    /**
     * Toggle panel collapse/expand
     */
    togglePanel() {
        this.isCollapsed = !this.isCollapsed;
        this.panel.classList.toggle('collapsed', this.isCollapsed);
        
        const toggleIcon = this.panel.querySelector('.panel-toggle i');
        if (toggleIcon) {
            toggleIcon.className = this.isCollapsed 
                ? 'fa-light fa-angle-right' 
                : 'fa-light fa-angle-left';
        }
    }
    
    /**
     * Toggle page collapse/expand
     */
    togglePageCollapse(pageItem) {
        const questionList = pageItem.querySelector('.question-list');
        const icon = pageItem.querySelector('.page-collapse-toggle i');
        
        if (questionList.style.display === 'none') {
            questionList.style.display = '';
            icon.className = 'fa-light fa-chevron-down';
        } else {
            questionList.style.display = 'none';
            icon.className = 'fa-light fa-chevron-right';
        }
    }
    
    /**
     * Select a page
     */
    selectPage(pageItem) {
        // Remove active class from all pages and questions
        this.panel.querySelectorAll('.page-item.active, .question-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to the selected page
        pageItem.classList.add('active');
        
        // Save the selected page
        this.activePage = pageItem.dataset.pageId;
        this.activeQuestion = null;
        
        // Trigger event for page selection
        const event = new CustomEvent('pageSelected', {
            detail: { pageId: this.activePage }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Select a question
     */
    selectQuestion(questionItem) {
        // Remove active class from all pages and questions
        this.panel.querySelectorAll('.page-item.active, .question-item.active').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to the selected question
        questionItem.classList.add('active');
        
        // Also highlight the parent page
        const parentPage = questionItem.closest('.page-item');
        if (parentPage) {
            parentPage.classList.add('active');
        }
        
        // Save the selected question and page
        this.activeQuestion = questionItem.dataset.questionId;
        this.activePage = parentPage ? parentPage.dataset.pageId : null;
        
        // Trigger event for question selection
        const event = new CustomEvent('questionSelected', {
            detail: { 
                questionId: this.activeQuestion,
                pageId: this.activePage
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Add a new page to the survey
     */
    addNewPage() {
        // Generate a unique page ID
        const pageId = 'page' + (this.surveyData.pages.length + 1);
        
        // Create a new page object
        const newPage = {
            id: pageId,
            title: `Page ${this.surveyData.pages.length + 1}`,
            questions: []
        };
        
        // Add to survey data
        this.surveyData.pages.push(newPage);
        
        // Render the panel
        this.renderPanel();
        
        // Select the new page
        const newPageElement = this.panel.querySelector(`.page-item[data-page-id="${pageId}"]`);
        if (newPageElement) {
            this.selectPage(newPageElement);
        }
        
        // Trigger event for page added
        const event = new CustomEvent('pageAdded', {
            detail: { pageId: pageId }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Add a new question to the active page
     */
    addNewQuestion() {
        if (!this.activePage) {
            alert('Please select a page first');
            return;
        }
        
        // Find the active page in survey data
        const pageIndex = this.surveyData.pages.findIndex(page => page.id === this.activePage);
        if (pageIndex === -1) return;
        
        const page = this.surveyData.pages[pageIndex];
        
        // Generate a unique question ID
        const questionId = 'q' + (page.questions.length + 1) + '_' + Date.now().toString().slice(-4);
        
        // Create a new question object
        const newQuestion = {
            id: questionId,
            title: 'New Question',
            type: 'text' // Default type
        };
        
        // Add to page
        page.questions.push(newQuestion);
        
        // Re-render
        this.renderPanel();
        
        // Select the new question
        const newQuestionElement = this.panel.querySelector(`.question-item[data-question-id="${questionId}"]`);
        if (newQuestionElement) {
            this.selectQuestion(newQuestionElement);
        }
        
        // Trigger event for question added
        const event = new CustomEvent('questionAdded', {
            detail: { 
                questionId: questionId,
                pageId: this.activePage
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Confirm deletion of a page or question
     */
    confirmDelete(type, element) {
        const id = element.dataset[`${type}Id`];
        const name = type === 'page' 
            ? element.querySelector('.page-title').textContent
            : element.querySelector('.question-title').textContent;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        document.body.appendChild(overlay);
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="dialog-title">Delete ${type}</div>
            <div class="dialog-content">
                Are you sure you want to delete this ${type}?<br>
                <strong>${name}</strong>
            </div>
            <div class="dialog-actions">
                <button class="dialog-btn btn-cancel">Cancel</button>
                <button class="dialog-btn btn-confirm">Delete</button>
            </div>
        `;
        document.body.appendChild(dialog);
        
        // Add event listeners
        dialog.querySelector('.btn-cancel').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });
        
        dialog.querySelector('.btn-confirm').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
            
            if (type === 'page') {
                this.deletePage(id);
            } else {
                this.deleteQuestion(id, element.closest('.page-item').dataset.pageId);
            }
        });
    }
    
    /**
     * Delete a page
     */
    deletePage(pageId) {
        // Remove from survey data
        this.surveyData.pages = this.surveyData.pages.filter(page => page.id !== pageId);
        
        // Re-render
        this.renderPanel();
        
        // Clear selection if the active page was deleted
        if (this.activePage === pageId) {
            this.activePage = null;
            this.activeQuestion = null;
        }
        
        // Trigger event for page deleted
        const event = new CustomEvent('pageDeleted', {
            detail: { pageId: pageId }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Delete a question
     */
    deleteQuestion(questionId, pageId) {
        // Find the page
        const pageIndex = this.surveyData.pages.findIndex(page => page.id === pageId);
        if (pageIndex === -1) return;
        
        const page = this.surveyData.pages[pageIndex];
        
        // Remove question from page
        page.questions = page.questions.filter(question => question.id !== questionId);
        
        // Re-render
        this.renderPanel();
        
        // Clear selection if the active question was deleted
        if (this.activeQuestion === questionId) {
            this.activeQuestion = null;
        }
        
        // Trigger event for question deleted
        const event = new CustomEvent('questionDeleted', {
            detail: { 
                questionId: questionId,
                pageId: pageId
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Duplicate an item (page or question)
     */
    duplicateItem(type, element) {
        if (type === 'page') {
            const pageId = element.dataset.pageId;
            const pageIndex = this.surveyData.pages.findIndex(page => page.id === pageId);
            if (pageIndex === -1) return;
            
            const originalPage = this.surveyData.pages[pageIndex];
            
            // Create a deep copy
            const newPage = JSON.parse(JSON.stringify(originalPage));
            
            // Update IDs to make them unique
            const timestamp = Date.now().toString().slice(-4);
            newPage.id = `page${this.surveyData.pages.length + 1}_${timestamp}`;
            newPage.title = `${originalPage.title} (Copy)`;
            
            // Update question IDs
            newPage.questions.forEach(question => {
                question.id = `q${question.id}_copy_${timestamp}`;
            });
            
            // Add to survey data
            this.surveyData.pages.splice(pageIndex + 1, 0, newPage);
            
            // Re-render
            this.renderPanel();
            
            // Select the new page
            const newPageElement = this.panel.querySelector(`.page-item[data-page-id="${newPage.id}"]`);
            if (newPageElement) {
                this.selectPage(newPageElement);
            }
        } 
        else if (type === 'question') {
            const questionId = element.dataset.questionId;
            const pageItem = element.closest('.page-item');
            const pageId = pageItem.dataset.pageId;
            
            // Find the page and question
            const pageIndex = this.surveyData.pages.findIndex(page => page.id === pageId);
            if (pageIndex === -1) return;
            
            const page = this.surveyData.pages[pageIndex];
            const questionIndex = page.questions.findIndex(q => q.id === questionId);
            if (questionIndex === -1) return;
            
            const originalQuestion = page.questions[questionIndex];
            
            // Create a deep copy
            const newQuestion = JSON.parse(JSON.stringify(originalQuestion));
            
            // Update ID to make it unique
            newQuestion.id = `q${questionId}_copy_${Date.now().toString().slice(-4)}`;
            newQuestion.title = `${originalQuestion.title} (Copy)`;
            
            // Add to page
            page.questions.splice(questionIndex + 1, 0, newQuestion);
            
            // Re-render
            this.renderPanel();
            
            // Select the new question
            const newQuestionElement = this.panel.querySelector(`.question-item[data-question-id="${newQuestion.id}"]`);
            if (newQuestionElement) {
                this.selectQuestion(newQuestionElement);
            }
        }
    }
    
    /**
     * Update the survey data structure after drag and drop operations
     */
    updateSurveyStructure() {
        // This would normally update a backend database or application state
        // For now, we'll just update the local surveyData object
        
        const pageList = this.panel.querySelector('.page-list');
        const updatedPages = [];
        
        pageList.querySelectorAll('.page-item').forEach(pageElement => {
            const pageId = pageElement.dataset.pageId;
            const pageTitle = pageElement.querySelector('.page-title').textContent;
            
            // Find the original page data
            const originalPage = this.surveyData.pages.find(p => p.id === pageId);
            if (!originalPage) return;
            
            const updatedQuestions = [];
            
            // Process questions
            pageElement.querySelectorAll('.question-item').forEach(questionElement => {
                const questionId = questionElement.dataset.questionId;
                
                // Find the original question
                const originalQuestion = originalPage.questions.find(q => q.id === questionId);
                if (originalQuestion) {
                    updatedQuestions.push(originalQuestion);
                }
            });
            
            // Create updated page object
            updatedPages.push({
                id: pageId,
                title: pageTitle,
                questions: updatedQuestions
            });
        });
        
        this.surveyData.pages = updatedPages;
        
        // Trigger event for structure updated
        const event = new CustomEvent('surveyStructureUpdated', {
            detail: { surveyData: this.surveyData }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Load sample data for the panel
     */
    loadSampleData() {
        this.surveyData = {
            pages: [
                {
                    id: 'page1',
                    title: 'Page 1',
                    questions: [
                        {
                            id: 'q1',
                            title: 'What is your age?',
                            type: 'number'
                        },
                        {
                            id: 'q2',
                            title: 'Select your gender',
                            type: 'choice'
                        }
                    ]
                },
                {
                    id: 'page2',
                    title: 'Page 2',
                    questions: [
                        {
                            id: 'q3',
                            title: 'Describe your experience',
                            type: 'text'
                        }
                    ]
                }
            ]
        };
    }
    
    /**
     * Render the panel based on the survey data
     */    /**
     * Render the panel based on the survey data
     */
    renderPanel() {
        const pageList = this.panel.querySelector('#surveyPageList');
        if (!pageList) return;
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Clear the list
        pageList.innerHTML = '';
        
        // Add pages and questions
        this.surveyData.pages.forEach(page => {
            const pageElement = document.createElement('li');
            pageElement.className = 'page-item';
            pageElement.dataset.pageId = page.id;
            
            // Highlight active page
            if (this.activePage === page.id) {
                pageElement.classList.add('active');
            }
            
            // Create the page header
            const pageHeader = document.createElement('div');
            pageHeader.className = 'page-header';
            
            // Create page drag handle
            const dragHandle = document.createElement('div');
            dragHandle.className = 'page-drag-handle';
            dragHandle.innerHTML = '<i class="fa-light fa-grip-dots-vertical"></i>';
            pageHeader.appendChild(dragHandle);
            
            // Create page collapse toggle
            const collapseToggle = document.createElement('div');
            collapseToggle.className = 'page-collapse-toggle';
            collapseToggle.innerHTML = '<i class="fa-light fa-chevron-down"></i>';
            pageHeader.appendChild(collapseToggle);
            
            // Create page title
            const pageTitle = document.createElement('div');
            pageTitle.className = 'page-title';
            pageTitle.contentEditable = true;
            pageTitle.textContent = page.title;
            pageHeader.appendChild(pageTitle);
            
            // Create page actions
            const pageActions = document.createElement('div');
            pageActions.className = 'page-actions';
            pageActions.innerHTML = `
                <button class="action-btn" title="Delete page">
                    <i class="fa-light fa-trash"></i>
                </button>
                <button class="action-btn" title="Duplicate page">
                    <i class="fa-light fa-copy"></i>
                </button>
                <button class="action-btn" title="Move page">
                    <i class="fa-light fa-arrows-up-down"></i>
                </button>
            `;
            pageHeader.appendChild(pageActions);
            
            // Add header to page element
            pageElement.appendChild(pageHeader);
            
            // Create question list
            const questionList = document.createElement('ul');
            questionList.className = 'question-list';
            
            // Add questions
            page.questions.forEach(question => {
                const questionElement = document.createElement('li');
                questionElement.className = 'question-item';
                questionElement.dataset.questionId = question.id;
                
                // Highlight active question
                if (this.activeQuestion === question.id) {
                    questionElement.classList.add('active');
                }
                
                // Determine icon based on question type
                let typeIcon = 'fa-align-left'; // Default for text
                if (question.type === 'choice') {
                    typeIcon = 'fa-circle-check';
                } else if (question.type === 'number') {
                    typeIcon = 'fa-square-poll-horizontal';
                } else if (question.type === 'matrix') {
                    typeIcon = 'fa-table-cells';
                }
                
                questionElement.innerHTML = `
                    <div class="question-drag-handle">
                        <i class="fa-light fa-grip-dots-vertical"></i>
                    </div>
                    <div class="question-type-icon">
                        <i class="fa-light ${typeIcon}"></i>
                    </div>
                    <div class="question-title">${question.title}</div>
                    <div class="question-actions">
                        <button class="action-btn" title="Delete question">
                            <i class="fa-light fa-trash"></i>
                        </button>
                        <button class="action-btn" title="Duplicate question">
                            <i class="fa-light fa-copy"></i>
                        </button>
                        <button class="action-btn" title="Move question">
                            <i class="fa-light fa-arrows-up-down"></i>
                        </button>
                    </div>
                `;
                
                questionList.appendChild(questionElement);
            });
            
            // Add question list to page
            pageElement.appendChild(questionList);
            
            // Add page to fragment
            fragment.appendChild(pageElement);
        });
        
        // Add all pages to the DOM at once
        pageList.appendChild(fragment);
        
        // Setup event listeners
        this.setupDragAndDrop();
        
        // Page collapse toggles
        this.panel.querySelectorAll('.page-collapse-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const pageItem = e.target.closest('.page-item');
                if (pageItem) {
                    this.togglePageCollapse(pageItem);
                }
            });
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const pageStructurePanel = new PageStructurePanelManager();
    pageStructurePanel.init();
});
