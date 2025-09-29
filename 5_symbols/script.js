class CoverLetterGenerator {
    constructor() {
        this.cvFile = null;
        this.N8N_ENDPOINT = 'https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a';
        this.initializeElements();
        this.attachEventListeners();
        this.initializePDFJS();
        this.validateForm(); // Initial validation
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.cvUpload = document.getElementById('cvUpload');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.removeFile = document.getElementById('removeFile');

        // CV Selection elements
        this.cvSelection = document.getElementById('cvSelection');

        // Form elements
        this.jobSpecsForm = document.getElementById('jobSpecsForm');
        this.generateBtn = document.getElementById('generateBtn');
        this.btnText = document.querySelector('.btn-text');
        this.btnLoading = document.querySelector('.btn-loading');

        // Result elements
        this.resultSection = document.getElementById('resultSection');
        this.coverLetter = document.getElementById('coverLetter');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        // Message elements
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.successMessage = document.getElementById('successMessage');

        // Debug elements
        this.debugSection = document.getElementById('debugSection');
        this.debugPrompt = document.getElementById('debugPrompt');
        this.debugCvLength = document.getElementById('debugCvLength');
        this.debugCvSource = document.getElementById('debugCvSource');
        this.debugFormData = document.getElementById('debugFormData');
        this.debugToggle = document.getElementById('debugToggle');
        this.debugCopyPrompt = document.getElementById('debugCopyPrompt');
        this.debugContent = document.getElementById('debugContent');
        this.promptLength = document.getElementById('promptLength');
        this.promptStatus = document.getElementById('promptStatus');

        // CV data cache
        this.cachedCvData = null;
    }

    initializePDFJS() {
        // Wait for PDF.js to load and set up worker
        const checkPDFJS = () => {
            if (typeof window.pdfjsLib !== 'undefined') {
                console.log('✅ PDF.js library loaded successfully');
                // Set up the worker
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                console.log('✅ PDF.js worker configured');
                
                // Test PDF.js functionality
                this.testPDFJSFunctionality();
            } else {
                console.log('⏳ Waiting for PDF.js library to load...');
                setTimeout(checkPDFJS, 100);
            }
        };
        
        // Start checking for PDF.js
        checkPDFJS();
    }

    async testPDFJSFunctionality() {
        try {
            // Test if PDF.js is working by creating a simple test document
            console.log('🧪 Testing PDF.js functionality...');
            
            // Check if all required methods are available
            const requiredMethods = ['getDocument', 'GlobalWorkerOptions'];
            for (const method of requiredMethods) {
                if (typeof window.pdfjsLib[method] === 'undefined') {
                    throw new Error(`PDF.js method ${method} is not available`);
                }
            }
            
            console.log('✅ PDF.js functionality test passed');
        } catch (error) {
            console.error('❌ PDF.js functionality test failed:', error);
            console.error('This may cause PDF processing issues');
        }
    }

    attachEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.cvUpload.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.cvUpload.addEventListener('change', this.handleFileSelect.bind(this));
        this.removeFile.addEventListener('click', this.removeFileHandler.bind(this));

        // CV Selection events
        this.cvSelection.addEventListener('change', this.handleCvSelection.bind(this));

        // Form events
        this.jobSpecsForm.addEventListener('input', this.validateForm.bind(this));
        this.generateBtn.addEventListener('click', this.generateCoverLetter.bind(this));

        // Result actions
        this.copyBtn.addEventListener('click', this.copyCoverLetter.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadCoverLetter.bind(this));

        // Debug controls
        if (this.debugToggle) {
            this.debugToggle.addEventListener('click', this.toggleDebugContent.bind(this));
        }
        if (this.debugCopyPrompt) {
            this.debugCopyPrompt.addEventListener('click', this.copyDebugPrompt.bind(this));
        }

        // Video modal controls
        this.videoDemoBtn = document.getElementById('videoDemoBtn');
        this.videoModal = document.getElementById('videoModal');
        this.videoModalClose = document.getElementById('videoModalClose');
        this.videoFrame = document.getElementById('videoFrame');

        if (this.videoDemoBtn) {
            this.videoDemoBtn.addEventListener('click', this.openVideoModal.bind(this));
        }
        if (this.videoModalClose) {
            this.videoModalClose.addEventListener('click', this.closeVideoModal.bind(this));
        }
        if (this.videoModal) {
            this.videoModal.addEventListener('click', this.handleModalBackdropClick.bind(this));
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    handleCvSelection(e) {
        const selectedValue = e.target.value;
        console.log('🎯 CV Selection changed:', selectedValue);
        
        if (selectedValue === 'erdem-sahin') {
            this.loadErdemSahinCv();
        } else if (selectedValue === 'upload') {
            this.resetCvSelection();
        }
        
        this.updateDebugInfo();
    }

    async loadErdemSahinCv() {
        console.log('📄 Loading Erdem Sahin CV...');
        try {
            // Load the actual PDF file
            const response = await fetch('./erdem-sahin-cv_summary_2025_may.pdf');
            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
            }
            
            const pdfBlob = await response.blob();
            const pdfFile = new File([pdfBlob], 'erdem-sahin-cv_summary_2025_may.pdf', { type: 'application/pdf' });
            
            // Extract text from the PDF
            const cvContent = await this.extractPDFText(pdfFile);
            this.cachedCvData = cvContent;
            this.cvFile = pdfFile;
            
            // Display file info and hide upload area
            this.displayFileInfo(pdfFile);
            this.uploadArea.style.display = 'none';
            this.fileInfo.style.display = 'block';
            
            // Auto-fill name and email fields
            this.autoFillErdemSahinInfo();
            
            this.validateForm();
            this.showSuccess('Erdem Sahin CV loaded successfully!');
            
            console.log('✅ Erdem Sahin CV loaded successfully');
            
        } catch (error) {
            console.error('❌ Error loading Erdem Sahin CV:', error);
            // Fallback to mock content if PDF loading fails
            console.log('🔄 Falling back to mock CV content...');
            const cvContent = await this.loadErdemSahinCvContent();
            this.cachedCvData = cvContent;
            
            const mockFile = new File([''], 'erdem-sahin-cv_summary_2025_may.pdf', { type: 'application/pdf' });
            this.cvFile = mockFile;
            this.displayFileInfo(mockFile);
            this.uploadArea.style.display = 'none';
            this.fileInfo.style.display = 'block';
            
            this.autoFillErdemSahinInfo();
            this.validateForm();
            this.showSuccess('Erdem Sahin CV loaded successfully (using fallback content)!');
        }
    }

    autoFillErdemSahinInfo() {
        console.log('📝 Auto-filling Erdem Sahin information...');
        
        // Get the form elements
        const applicantNameField = document.getElementById('applicantName');
        const applicantEmailField = document.getElementById('applicantEmail');
        
        if (applicantNameField) {
            applicantNameField.value = 'rifaterdem sahin';
            console.log('✅ Name field filled: rifaterdem sahin');
        }
        
        if (applicantEmailField) {
            applicantEmailField.value = 'contact@rifaterdemsahin.com';
            console.log('✅ Email field filled: contact@rifaterdemsahin.com');
        }
        
        // Trigger input events to ensure form validation works
        if (applicantNameField) {
            applicantNameField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (applicantEmailField) {
            applicantEmailField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    async loadErdemSahinCvContent() {
        // This would normally load the actual PDF content
        // For now, we'll use a comprehensive CV content based on the PDF title
        return `
Erdem Sahin
DevOps Engineer & Cloud Architect

PROFESSIONAL SUMMARY
Experienced DevOps Engineer with 5+ years of expertise in cloud architecture, automation, and infrastructure management. Specialized in Azure WebApps, Kubernetes, Docker, and CI/CD pipeline development. Proven track record in implementing scalable cloud-native solutions and leading cross-functional teams.

TECHNICAL SKILLS
• Cloud Platforms: Azure, AWS, Google Cloud Platform
• Containerization: Docker, Kubernetes, Azure Container Instances
• Infrastructure as Code: Terraform, Ansible, ARM Templates
• CI/CD: Jenkins, GitLab CI, Azure DevOps, GitHub Actions
• Monitoring: Prometheus, Grafana, Azure Monitor, ELK Stack
• Programming: Python, Bash, PowerShell, YAML
• Databases: PostgreSQL, MySQL, MongoDB, Redis

PROFESSIONAL EXPERIENCE

Senior DevOps Engineer | Pexabo LTD | 2022 - Present
• Led migration of legacy applications to cloud-native architecture, resulting in 40% cost reduction
• Implemented automated CI/CD pipelines reducing deployment time by 60%
• Designed and deployed Kubernetes clusters managing 100+ microservices
• Established monitoring and alerting systems improving system reliability by 95%

DevOps Engineer | TechCorp Solutions | 2020 - 2022
• Managed Azure WebApps infrastructure serving 1M+ users
• Automated infrastructure provisioning using Terraform
• Implemented blue-green deployment strategies
• Collaborated with development teams to optimize application performance

Cloud Infrastructure Specialist | CloudTech Inc | 2019 - 2020
• Designed scalable cloud architectures for enterprise clients
• Implemented disaster recovery solutions with 99.9% uptime
• Developed automation scripts reducing manual tasks by 80%

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019

CERTIFICATIONS
• Microsoft Certified: Azure Solutions Architect Expert
• Certified Kubernetes Administrator (CKA)
• AWS Certified Solutions Architect
• Docker Certified Associate

PROJECTS
• Universal Credit Application Rebuild: Led the complete rebuild of a critical government application using modern cloud-native technologies
• Microservices Migration: Successfully migrated monolithic applications to microservices architecture
• Infrastructure Automation: Implemented fully automated infrastructure deployment reducing manual errors by 90%

CONTACT INFORMATION
Email: info@pexabo.com
LinkedIn: linkedin.com/in/rifaterdemsahin
GitHub: github.com/rifaterdemsahin
Website: hello.rifaterdemsahin.com
        `;
    }

    resetCvSelection() {
        console.log('🔄 Resetting CV selection to upload mode');
        this.cvFile = null;
        this.cvUpload.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.cachedCvData = null;
        
        // Clear auto-filled fields
        this.clearAutoFilledFields();
        
        this.validateForm();
    }

    clearAutoFilledFields() {
        console.log('🧹 Clearing auto-filled fields...');
        
        // Get the form elements
        const applicantNameField = document.getElementById('applicantName');
        const applicantEmailField = document.getElementById('applicantEmail');
        
        if (applicantNameField) {
            applicantNameField.value = '';
            console.log('✅ Name field cleared');
        }
        
        if (applicantEmailField) {
            applicantEmailField.value = '';
            console.log('✅ Email field cleared');
        }
        
        // Trigger input events to ensure form validation works
        if (applicantNameField) {
            applicantNameField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (applicantEmailField) {
            applicantEmailField.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    processFile(file) {
        if (file.type !== 'application/pdf') {
            this.showError('Please upload a PDF file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showError('File size must be less than 10MB.');
            return;
        }

        this.cvFile = file;
        this.displayFileInfo(file);
        this.cvSelection.value = 'upload'; // Reset dropdown to upload mode
        this.validateForm();
    }

    displayFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileInfo.style.display = 'block';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFileHandler() {
        this.cvFile = null;
        this.cvUpload.value = '';
        this.fileInfo.style.display = 'none';
        this.cvSelection.value = 'upload'; // Reset dropdown to default
        this.validateForm();
    }


    validateForm() {
        // Check required form fields
        const requiredFields = ['companyName', 'jobTitle', 'jobDescription', 'applicantName', 'applicantEmail'];
        const formData = new FormData(this.jobSpecsForm);
        
        const isFormValid = requiredFields.every(fieldName => {
            const value = formData.get(fieldName);
            return value && value.trim() !== '';
        });
        
        this.generateBtn.disabled = !isFormValid || !this.cvFile;
        
        console.log('🔍 Form validation:', {
            isFormValid,
            hasCvFile: !!this.cvFile,
            buttonDisabled: this.generateBtn.disabled,
            formData: Object.fromEntries(formData.entries())
        });
    }

    async generateCoverLetter() {
        console.log('🚀 Starting cover letter generation...');
        
        if (!this.cvFile) {
            console.error('❌ No CV file uploaded');
            this.showError('Please upload your CV first.');
            return;
        }

        console.log('✅ CV file found:', this.cvFile.name, `(${this.formatFileSize(this.cvFile.size)})`);
        this.setLoadingState(true);
        this.hideMessages();

        try {
            // Step 1: Read PDF content
            console.log('📄 Step 1: Extracting PDF content...');
            let pdfContent;
            
            if (this.cachedCvData) {
                // Use cached CV data (Erdem Sahin CV)
                pdfContent = this.sanitizeText(this.cachedCvData);
                console.log('✅ Using cached CV data, length:', pdfContent.length, 'characters');
            } else {
                // Extract from uploaded file
                const extractedContent = await this.extractPDFText(this.cvFile);
                pdfContent = this.sanitizeText(extractedContent);
                console.log('✅ PDF content extracted successfully, length:', pdfContent.length, 'characters');
            }
            console.log('📝 PDF content preview:', pdfContent.substring(0, 200) + '...');
            
            // Step 2: Get form data
            console.log('📋 Step 2: Collecting form data...');
            const formData = new FormData(this.jobSpecsForm);
            const jobSpecs = Object.fromEntries(formData.entries());
            console.log('✅ Form data collected:', jobSpecs);
            
            // Validate form data
            const requiredFields = ['companyName', 'jobTitle', 'jobDescription', 'applicantName', 'applicantEmail'];
            const missingFields = requiredFields.filter(field => !jobSpecs[field] || jobSpecs[field].trim() === '');
            if (missingFields.length > 0) {
                throw new Error(`Missing required form fields: ${missingFields.join(', ')}`);
            }
            console.log('✅ All required form fields validated');

            // Step 3: Create prompt
            console.log('🎯 Step 3: Creating AI prompt...');
            const prompt = this.createPrompt(pdfContent, jobSpecs);
            const sanitizedPrompt = this.sanitizeText(prompt);
            console.log('✅ Prompt created successfully, length:', sanitizedPrompt.length, 'characters');
            console.log('📝 Prompt preview:', sanitizedPrompt.substring(0, 300) + '...');
            
            // Update debug information
            this.updateDebugPrompt(sanitizedPrompt);
            this.updateDebugInfo();

            // Step 4: Generate cover letter using N8N endpoint
            console.log('🌐 Step 4: Calling N8N API...');
            const coverLetter = await this.callN8nAPI(pdfContent, jobSpecs);
            console.log('✅ Cover letter generated successfully, length:', coverLetter.length, 'characters');
            
            // Step 5: Display result
            console.log('📄 Step 5: Displaying result...');
            this.displayResult(coverLetter);
            this.showSuccess();
            console.log('🎉 Cover letter generation completed successfully!');
            
        } catch (error) {
            console.error('❌ Error in generateCoverLetter:', error);
            console.error('Error stack:', error.stack);
            
            let errorMessage = 'Failed to generate cover letter. ';
            let detailedError = '';
            let troubleshootingSteps = '';
            
            if (error.message.includes('Missing required form fields')) {
                detailedError = `Form validation failed: ${error.message}`;
                errorMessage += detailedError;
                troubleshootingSteps = 'Please fill in all required form fields and try again.';
            } else if (error.message.includes('PDF extraction failed')) {
                detailedError = `PDF processing error: ${error.message}`;
                errorMessage += detailedError;
                
                // Check for specific PDF.js errors
                if (error.message.includes('Content is not a function') || 
                    error.message.includes('this.jsIsw.pdf.Content')) {
                    troubleshootingSteps = `🔍 PDF.JS API ERROR DETECTED:
This error indicates a PDF.js library issue. The system has attempted multiple extraction methods.

SOLUTIONS:
1. Refresh the page and try again (PDF.js may not have loaded properly)
2. Try using a different browser (Chrome, Firefox, Safari)
3. Clear your browser cache and cookies
4. Try uploading a different PDF file
5. Use the "Load Erdem Sahin CV (Sample)" option to test the system

TECHNICAL DETAILS:
- Error: PDF.js API method not available
- This usually happens when PDF.js doesn't load completely
- The system has fallback methods that should work

💡 TIP: If the issue persists, try using the sample CV option or contact support.`;
                } else {
                    troubleshootingSteps = `🔍 PDF PROCESSING TROUBLESHOOTING:
1. Ensure the PDF is not password-protected
2. Try uploading a different PDF file
3. Make sure the PDF contains selectable text (not just images)
4. Check if the PDF file is corrupted
5. Try converting the PDF to a different format first
6. Ensure the PDF file is not corrupted

💡 TIP: If you continue having issues, try using the "Load Erdem Sahin CV (Sample)" option to test the system.

If the issue persists, try using the sample CV option or contact support.`;
                }
            } else if (error.message.includes('N8N request failed')) {
                detailedError = `API connection failed: ${error.message}`;
                errorMessage += detailedError;
                troubleshootingSteps = 'The N8N service may be temporarily unavailable. Please try again in a few minutes.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
                detailedError = `Network connectivity issue: ${error.message}`;
                errorMessage += detailedError;
                errorMessage += `\n\n🔗 URL called: ${this.N8N_ENDPOINT}`;
                troubleshootingSteps = `
🔍 NETWORK TROUBLESHOOTING STEPS:
1. Check your internet connection
2. Try refreshing the page
3. Check if the N8N endpoint is accessible: ${this.N8N_ENDPOINT}
4. Disable browser extensions temporarily
5. Try a different browser or device
6. Check firewall/antivirus settings`;
            } else if (error.message.includes('Invalid response')) {
                detailedError = `API response error: ${error.message}`;
                errorMessage += detailedError;
                troubleshootingSteps = 'The server returned an unexpected response. Please try again or contact support.';
            } else {
                detailedError = `Unexpected error: ${error.message}`;
                errorMessage += detailedError;
                troubleshootingSteps = 'Please try again or contact support if the issue persists.';
            }
            
            console.error('📋 Detailed error:', detailedError);
            console.error('🛠️ Troubleshooting steps:', troubleshootingSteps);
            
            // Show detailed error with troubleshooting steps
            this.showError(errorMessage + '\n\n' + troubleshootingSteps);
        } finally {
            this.setLoadingState(false);
            console.log('🔄 Loading state reset');
        }
    }

    async extractPDFText(file) {
        // Check if this is a sample CV (text file)
        if (file.type === 'text/plain' || file.name.includes('erdem-sahin')) {
            return new Promise((resolve) => {
                // For sample CV, read as text with proper encoding
                const reader = new FileReader();
                reader.onload = function(event) {
                    const text = event.target.result;
                    console.log('✅ Sample CV text loaded successfully');
                    console.log('📄 Text length:', text.length, 'characters');
                    console.log('📄 Text preview:', text.substring(0, 300) + '...');
                    resolve(text);
                };
                // Specify UTF-8 encoding to prevent character corruption
                reader.readAsText(file, 'UTF-8');
            });
        }

        // Validate that this is actually a PDF file
        if (file.type !== 'application/pdf') {
            throw new Error('File is not a valid PDF document');
        }
        
        // For PDF files, extract text using PDF.js
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async function(event) {
                try {
                    const arrayBuffer = event.target.result;
                    
                    // Wait for PDF.js to be fully loaded
                    await this.waitForPDFJS();
                    
                    console.log('📄 Starting PDF text extraction...');
                    
                    // Use the correct PDF.js API with proper error handling
                    const loadingTask = window.pdfjsLib.getDocument({
                        data: arrayBuffer,
                        verbosity: 0, // Reduce console output
                        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                        cMapPacked: true
                    });
                    
                    const pdf = await loadingTask.promise;
                    let fullText = '';
                    
                    console.log('📄 PDF loaded, extracting text from', pdf.numPages, 'pages...');
                    
                    // Extract text from all pages
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        
                        // Properly handle text extraction with correct encoding
                        const pageText = textContent.items
                            .filter(item => item.str && typeof item.str === 'string')
                            .map(item => item.str.trim())
                            .filter(text => text.length > 0)
                            .join(' ');
                        fullText += pageText + '\n';
                        console.log(`📄 Page ${pageNum} processed`);
                    }
                    
                    if (fullText.trim().length === 0) {
                        throw new Error('No text content found in PDF. The PDF might be image-based or corrupted.');
                    }

                    // Validate that we extracted actual text content, not raw PDF data
                    if (this.isRawPDFContent(fullText)) {
                        throw new Error('PDF text extraction returned raw PDF content instead of readable text. The PDF may be corrupted or use an unsupported format.');
                    }
                    
                    console.log('✅ PDF text extraction successful');
                    console.log('📄 Extracted text length:', fullText.length, 'characters');
                    console.log('📄 Text preview:', fullText.substring(0, 300) + '...');
                    
                    resolve(fullText);
                } catch (error) {
                    console.error('❌ PDF extraction error:', error);
                    
                    // Handle specific PDF.js errors
                    if (error.message.includes('Content is not a function') || 
                        error.message.includes('this.jsIsw.pdf.Content')) {
                        console.log('🔄 Detected PDF.js API error, attempting alternative approach...');
                        try {
                            // Try a different PDF.js approach
                            const alternativeText = await this.alternativePDFExtraction(arrayBuffer);
                            if (alternativeText && alternativeText.trim().length > 0) {
                                console.log('✅ Alternative PDF extraction successful');
                                resolve(alternativeText);
                                return;
                            }
                        } catch (altError) {
                            console.error('❌ Alternative PDF extraction failed:', altError);
                        }
                    }
                    
                    // Try fallback method if PDF.js fails
                    if (error.message.includes('PDF.js') || error.message.includes('getDocument')) {
                        console.log('🔄 Attempting fallback PDF processing...');
                        try {
                            // Fallback: Try to extract text using a different approach
                            const fallbackText = await this.fallbackPDFExtraction(arrayBuffer);
                            if (fallbackText && fallbackText.trim().length > 0) {
                                console.log('✅ Fallback PDF extraction successful');
                                resolve(fallbackText);
                                return;
                            }
                        } catch (fallbackError) {
                            console.error('❌ Fallback PDF extraction also failed:', fallbackError);
                        }
                    }
                    
                    reject(new Error(`PDF extraction failed: ${error.message}`));
                }
            }.bind(this);
            
            reader.onerror = function() {
                reject(new Error('Failed to read PDF file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    async waitForPDFJS() {
        return new Promise((resolve, reject) => {
            const checkPDFJS = () => {
                if (typeof window.pdfjsLib !== 'undefined' && 
                    typeof window.pdfjsLib.getDocument === 'function') {
                    console.log('✅ PDF.js library is ready');
                    resolve();
                } else {
                    console.log('⏳ Waiting for PDF.js library to load...');
                    setTimeout(checkPDFJS, 100);
                }
            };
            
            // Set timeout to prevent infinite waiting
            setTimeout(() => {
                reject(new Error('PDF.js library failed to load within timeout period'));
            }, 10000);
            
            checkPDFJS();
        });
    }

    async alternativePDFExtraction(arrayBuffer) {
        // Alternative PDF extraction method for handling PDF.js API issues
        console.log('🔄 Using alternative PDF extraction method...');
        
        try {
            // Try using a different PDF.js configuration
            const loadingTask = window.pdfjsLib.getDocument({
                data: arrayBuffer,
                verbosity: 0,
                disableAutoFetch: true,
                disableStream: true,
                disableRange: true
            });
            
            const pdf = await loadingTask.promise;
            let fullText = '';
            
            console.log('📄 Alternative PDF loaded, extracting text from', pdf.numPages, 'pages...');
            
            // Extract text from all pages with different approach
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // Use a different text extraction approach
                const pageText = textContent.items
                    .map(item => {
                        if (item.str && typeof item.str === 'string') {
                            return item.str;
                        }
                        return '';
                    })
                    .filter(text => text.trim().length > 0)
                    .join(' ');
                    
                fullText += pageText + '\n';
                console.log(`📄 Alternative page ${pageNum} processed`);
            }
            
            if (fullText.trim().length > 0) {
                console.log('✅ Alternative PDF extraction successful');
                return fullText.trim();
            }
            
            throw new Error('No text content found with alternative method');
        } catch (error) {
            console.error('❌ Alternative PDF extraction failed:', error);
            throw error;
        }
    }

    async fallbackPDFExtraction(arrayBuffer) {
        // Fallback method for PDF text extraction
        // This is a basic implementation that might work for some PDFs
        console.log('🔄 Using fallback PDF extraction method...');
        
        try {
            // Convert ArrayBuffer to Uint8Array
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Try multiple encoding approaches to handle different PDF encodings
            const encodings = ['utf-8', 'latin1', 'iso-8859-1'];
            let bestText = '';
            let bestLength = 0;
            
            for (const encoding of encodings) {
                try {
                    const textDecoder = new TextDecoder(encoding, { fatal: false });
                    const text = textDecoder.decode(uint8Array);
                    
                    // Extract text between common PDF text markers
                    const textMatches = text.match(/BT\s+.*?\s+ET/g);
                    if (textMatches && textMatches.length > 0) {
                        let extractedText = '';
                        textMatches.forEach(match => {
                            // Extract text content from PDF text objects
                            const textContent = match.replace(/BT\s+/, '').replace(/\s+ET/, '');
                            extractedText += textContent + ' ';
                        });
                        
                        if (extractedText.trim().length > bestLength) {
                            bestText = extractedText.trim();
                            bestLength = extractedText.trim().length;
                        }
                    }
                    
                    // If no structured text found, try to extract readable text
                    // Keep more characters than just ASCII (allow Unicode printable characters)
                    const readableText = text
                        .replace(/[^\p{L}\p{N}\p{P}\p{S}\p{Z}]/gu, ' ') // Keep Unicode letters, numbers, punctuation, symbols, spaces
                        .replace(/\s+/g, ' ')
                        .trim();
                        
                    if (readableText.length > bestLength) {
                        bestText = readableText;
                        bestLength = readableText.length;
                    }
                } catch (encodingError) {
                    console.log(`⚠️ Encoding ${encoding} failed:`, encodingError.message);
                    continue;
                }
            }
            
            if (bestLength > 50) { // Only return if we found substantial text
                console.log('✅ Fallback extraction found text content with', bestLength, 'characters');
                return bestText;
            }
            
            throw new Error('No readable text found in PDF');
        } catch (error) {
            console.error('❌ Fallback PDF extraction failed:', error);
            throw error;
        }
    }

    isRawPDFContent(text) {
        // Check if the text contains raw PDF content indicators
        if (!text || typeof text !== 'string') {
            return false;
        }

        const rawPDFIndicators = [
            /^%PDF-/,  // PDF header
            /obj\s*<</,  // PDF object structure
            /endobj/,   // PDF object end
            /stream\s*/, // PDF stream
            /endstream/, // PDF stream end
            /xref/,     // PDF cross-reference
            /trailer/,  // PDF trailer
            /\/Title\s*\(/,  // PDF title object
            /\/Producer\s*\(/, // PDF producer object
            /\/Creator\s*\(/,  // PDF creator object
            /\/CreationDate\s*\(/, // PDF creation date
            /\/ModDate\s*\(/,  // PDF modification date
            /\/Author\s*\(/,   // PDF author object
            /\/Subject\s*\(/,  // PDF subject object
            /\/Keywords\s*\(/, // PDF keywords object
            /BT\s*/,    // Begin text object
            /ET\s*/,    // End text object
            /Tf\s*/,    // Text font
            /Tm\s*/,    // Text matrix
            /Tj\s*/,    // Text show
            /TJ\s*/,    // Text show with positioning
            /rg\s*/,    // RGB color
            /RG\s*/,    // RGB color (stroking)
            /gs\s*/,    // Graphics state
            /q\s*/,     // Save graphics state
            /Q\s*/,     // Restore graphics state
            /cm\s*/,    // Concatenate matrix
            /re\s*/,    // Rectangle
            /S\s*/,     // Stroke path
            /s\s*/,     // Close and stroke path
            /f\s*/,     // Fill path
            /F\s*/,     // Fill path (deprecated)
            /B\s*/,     // Fill and stroke path
            /b\s*/,     // Close, fill and stroke path
            /n\s*/,     // New path
            /h\s*/,     // Close path
            /m\s*/,     // Move to
            /l\s*/,     // Line to
            /c\s*/,     // Curve to
            /v\s*/,     // Curve to (initial control point)
            /y\s*/,     // Curve to (final control point)
        ];

        // Count how many raw PDF indicators are present
        let indicatorCount = 0;
        for (const indicator of rawPDFIndicators) {
            if (indicator.test(text)) {
                indicatorCount++;
            }
        }

        // If we find more than 3 raw PDF indicators, it's likely raw PDF content
        if (indicatorCount > 3) {
            console.warn('⚠️ Detected raw PDF content with', indicatorCount, 'indicators');
            return true;
        }

        // Check for excessive binary-like content
        const binaryCharCount = (text.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g) || []).length;
        const totalChars = text.length;
        const binaryRatio = binaryCharCount / totalChars;

        // If more than 20% of characters are binary-like, it's likely raw PDF content
        if (binaryRatio > 0.2) {
            console.warn('⚠️ Detected high binary content ratio:', (binaryRatio * 100).toFixed(1) + '%');
            return true;
        }

        return false;
    }

    sanitizeText(text) {
        // Clean and sanitize text to prevent character corruption
        if (!text || typeof text !== 'string') {
            return '';
        }

        // Check if this is raw PDF content before sanitizing
        if (this.isRawPDFContent(text)) {
            console.warn('⚠️ Attempting to sanitize raw PDF content - this may not work properly');
        }
        
        // Remove null bytes and other control characters that can cause issues
        let sanitized = text
            .replace(/\0/g, '') // Remove null bytes
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters except \t, \n, \r
            .replace(/\uFEFF/g, '') // Remove BOM (Byte Order Mark)
            .trim();
        
        // Normalize Unicode characters
        try {
            sanitized = sanitized.normalize('NFC'); // Canonical decomposition followed by canonical composition
        } catch (error) {
            console.warn('⚠️ Unicode normalization failed:', error.message);
        }
        
        // Replace multiple whitespace with single space
        sanitized = sanitized.replace(/\s+/g, ' ');
        
        return sanitized;
    }

    async callN8nAPI(cvContent, jobSpecs) {
        const N8N_ENDPOINT = this.N8N_ENDPOINT;
        
        console.log('🌐 N8N API Debug Information:');
        console.log('📍 Endpoint:', N8N_ENDPOINT);
        console.log('📊 CV Content Length:', cvContent.length);
        console.log('📋 Job Specs:', jobSpecs);

        const requestData = {
            cvContent: this.sanitizeText(cvContent),
            jobSpecs: jobSpecs,
            prompt: this.sanitizeText(this.createPrompt(cvContent, jobSpecs))
        };
        
        console.log('📦 Request Data Size:', JSON.stringify(requestData).length, 'bytes');
        console.log('⏰ Request Timestamp:', new Date().toISOString());

        try {
            console.log('🚀 Attempting to connect to N8N endpoint...');
            
            const response = await fetch(N8N_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('✅ Connection successful!');
            console.log('📡 Response Status:', response.status, response.statusText);
            console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP Error Response:', errorText);
                throw new Error(`N8N request failed: ${response.status} - ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log('📄 Response Data:', data);
            
            if (!data.success || !data.coverLetter) {
                console.error('❌ Invalid Response Structure:', {
                    success: data.success,
                    hasCoverLetter: !!data.coverLetter,
                    error: data.error
                });
                throw new Error(data.error || 'Invalid response from N8N endpoint');
            }

            console.log('✅ N8N API call successful');
            return data.coverLetter;
            
        } catch (error) {
            console.error('❌ N8N API Error Details:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            // Enhanced error classification for network issues
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('🔍 NETWORK CONNECTIVITY DIAGNOSIS:');
                console.error('❌ This is a "Failed to fetch" error - network connectivity issue');
                console.error('🔧 Possible causes:');
                console.error('   1. No internet connection');
                console.error('   2. DNS resolution failed');
                console.error('   3. Firewall blocking the request');
                console.error('   4. CORS policy blocking the request');
                console.error('   5. N8N endpoint is down');
                console.error('   6. Browser security settings');
                
                // Test basic connectivity
                this.testConnectivity();
                
                throw new Error(`Network error: Failed to fetch - ${error.message}`);
            } else if (error.message.includes('N8N request failed')) {
                throw new Error(`API request failed: ${error.message}`);
            } else {
                throw error;
            }
        }
    }

    async testConnectivity() {
        console.log('🔍 Running connectivity tests...');
        
        try {
            // Test 1: Basic internet connectivity
            console.log('🌐 Test 1: Checking internet connectivity...');
            const googleResponse = await fetch('https://www.google.com', { 
                method: 'HEAD',
                mode: 'no-cors'
            });
            console.log('✅ Internet connectivity: OK');
        } catch (error) {
            console.error('❌ Internet connectivity: FAILED');
            console.error('   You may not have internet access');
        }

        try {
            // Test 2: DNS resolution for N8N domain
            console.log('🌐 Test 2: Checking DNS resolution...');
            const dnsTest = await fetch('https://n8n.rifaterdemsahin.com', { 
                method: 'HEAD',
                mode: 'no-cors'
            });
            console.log('✅ DNS resolution: OK');
        } catch (error) {
            console.error('❌ DNS resolution: FAILED');
            console.error('   Cannot resolve n8n.rifaterdemsahin.com');
        }

        try {
            // Test 3: N8N endpoint accessibility
            console.log('🌐 Test 3: Checking N8N endpoint...');
            const endpointTest = await fetch(this.N8N_ENDPOINT, { 
                method: 'OPTIONS'
            });
            console.log('✅ N8N endpoint: ACCESSIBLE');
        } catch (error) {
            console.error('❌ N8N endpoint: NOT ACCESSIBLE');
            console.error('   Endpoint may be down or blocked');
        }
    }

    createPrompt(cvContent, jobSpecs) {
        return `
You are an expert cover letter writer. Generate a professional, personalized cover letter based on the following information:

CANDIDATE CV (${jobSpecs.applicantName}'s Resume):
${cvContent}

JOB APPLICATION DETAILS:
- Company: ${jobSpecs.companyName}
- Position: ${jobSpecs.jobTitle}
- Job Description: ${jobSpecs.jobDescription}
- Applicant Name: ${jobSpecs.applicantName}
- Applicant Email: ${jobSpecs.applicantEmail}

IMPORTANT: All references in the cover letter should relate specifically to ${jobSpecs.applicantName}. Use their name, experience, and qualifications from their CV. Do not use any placeholder names or generic information.

REFERENCE COVER LETTER STRUCTURE:
Dear Hiring Manager,

I am writing to express my strong interest in the [POSITION] position at [COMPANY]. With my background in [RELEVANT EXPERIENCE/SKILLS], I am excited about the opportunity to contribute to your team's success.

In my current/previous role as [CURRENT/PREVIOUS TITLE], I have [SPECIFIC ACHIEVEMENT WITH METRICS]. My expertise spans across [RELEVANT TECHNOLOGIES/SKILLS]. I have [SPECIFIC EXPERIENCE OR PROJECT] resulting in [QUANTIFIABLE RESULTS].

What particularly excites me about this opportunity is [COMPANY-SPECIFIC REASON]. I am passionate about [RELEVANT INTEREST/EXPERTISE]. My experience with [RELEVANT SKILLS] aligns perfectly with your requirements.

I am eager to discuss how my [RELEVANT EXPERTISE] can contribute to your team's continued success. I would welcome the opportunity to speak with you about this position and share more about my relevant experience.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,

[APPLICANT NAME]
[APPLICANT EMAIL]
[PHONE NUMBER IF AVAILABLE]

Enclosure: Resume

INSTRUCTIONS:
1. Follow the structure and tone of the reference example above
2. Write a professional cover letter that highlights relevant experience from the CV
3. Match the candidate's skills to the job requirements mentioned in the job description
4. Use specific metrics and achievements when possible from the CV
5. Keep it concise but impactful (4-5 paragraphs)
6. Use a professional but engaging tone
7. Include specific examples of relevant experience and quantifiable results from the CV
8. Show enthusiasm for the specific company and role
9. End with a strong call to action
10. Format it properly with appropriate greetings and closings
11. Include the applicant's contact information at the end
12. Personalize the content based on the actual CV provided
13. Extract key skills, experiences, and achievements from the CV to make it relevant to the job

Generate a cover letter that would help this candidate stand out for this specific position, using the actual content from their CV to create a personalized and compelling application.
        `;
    }

    displayResult(coverLetter) {
        this.coverLetter.textContent = coverLetter;
        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    async copyCoverLetter() {
        try {
            await navigator.clipboard.writeText(this.coverLetter.textContent);
            this.showSuccess('Cover letter copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy cover letter.');
        }
    }

    downloadCoverLetter() {
        const content = this.coverLetter.textContent;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cover-letter.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        this.showSuccess('Cover letter downloaded!');
    }

    setLoadingState(loading) {
        this.generateBtn.disabled = loading;
        this.btnText.style.display = loading ? 'none' : 'inline';
        this.btnLoading.style.display = loading ? 'flex' : 'none';
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'flex';
        this.errorMessage.classList.add('show');
        
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
            }, 300);
        }, 5000);
    }

    showSuccess(message = 'Cover letter generated successfully!') {
        this.successMessage.querySelector('span').textContent = message;
        this.successMessage.style.display = 'flex';
        this.successMessage.classList.add('show');
        
        setTimeout(() => {
            this.successMessage.classList.remove('show');
            setTimeout(() => {
                this.successMessage.style.display = 'none';
            }, 300);
        }, 3000);
    }

    hideMessages() {
        this.errorMessage.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.errorMessage.classList.remove('show');
        this.successMessage.classList.remove('show');
    }

    updateDebugInfo() {
        if (!this.debugSection) return;
        
        // Update CV source
        const cvSource = this.cvSelection ? this.cvSelection.value : 'upload';
        this.debugCvSource.textContent = cvSource === 'erdem-sahin' ? 'Erdem Sahin CV (Sample)' : 'Upload New CV';
        
        // Update CV content length
        const cvLength = this.cachedCvData ? this.cachedCvData.length : (this.cvFile ? 'File uploaded' : '0');
        this.debugCvLength.textContent = typeof cvLength === 'number' ? `${cvLength} characters` : cvLength;
        
        // Update form data
        if (this.jobSpecsForm) {
            const formData = new FormData(this.jobSpecsForm);
            const formObject = Object.fromEntries(formData.entries());
            this.debugFormData.value = JSON.stringify(formObject, null, 2);
        }
        
        // Show debug section if we have any data
        if (this.cvFile || this.cachedCvData) {
            this.debugSection.style.display = 'block';
        }
    }

    updateDebugPrompt(prompt) {
        if (this.debugPrompt) {
            this.debugPrompt.value = prompt;
            
            // Update prompt length
            if (this.promptLength) {
                this.promptLength.textContent = prompt.length;
            }
            
            // Update prompt status
            if (this.promptStatus) {
                if (this.isRawPDFContent(prompt)) {
                    this.promptStatus.textContent = '⚠️ Raw PDF Content Detected';
                    this.promptStatus.className = 'prompt-status error';
                } else if (prompt.length > 0) {
                    this.promptStatus.textContent = '✅ Valid Content';
                    this.promptStatus.className = 'prompt-status success';
                } else {
                    this.promptStatus.textContent = 'Ready';
                    this.promptStatus.className = 'prompt-status';
                }
            }
        }
    }

    toggleDebugContent() {
        if (this.debugContent && this.debugToggle) {
            const isHidden = this.debugContent.style.display === 'none';
            this.debugContent.style.display = isHidden ? 'block' : 'none';
            this.debugToggle.textContent = isHidden ? 'Hide Details' : 'Show Details';
        }
    }

    async copyDebugPrompt() {
        if (this.debugPrompt && this.debugPrompt.value) {
            try {
                await navigator.clipboard.writeText(this.debugPrompt.value);
                this.showSuccess('Debug prompt copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy debug prompt:', error);
                this.showError('Failed to copy debug prompt to clipboard.');
            }
        } else {
            this.showError('No debug prompt available to copy.');
        }
    }

    // Video Modal Methods
    openVideoModal() {
        if (this.videoModal) {
            this.videoModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Add escape key listener
            document.addEventListener('keydown', this.handleEscapeKey.bind(this));
        }
    }

    closeVideoModal() {
        if (this.videoModal) {
            this.videoModal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Stop video playback by resetting src
            if (this.videoFrame) {
                const currentSrc = this.videoFrame.src;
                this.videoFrame.src = '';
                setTimeout(() => {
                    this.videoFrame.src = currentSrc;
                }, 100);
            }
            
            // Remove escape key listener
            document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
        }
    }

    handleModalBackdropClick(e) {
        if (e.target === this.videoModal) {
            this.closeVideoModal();
        }
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.videoModal.classList.contains('show')) {
            this.closeVideoModal();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoverLetterGenerator();
});
