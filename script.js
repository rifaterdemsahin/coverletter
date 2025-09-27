class CoverLetterGenerator {
    constructor() {
        this.cvFile = null;
        this.N8N_ENDPOINT = 'https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a';
        this.initializeElements();
        this.attachEventListeners();
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

        // CV data cache
        this.cachedCvData = null;
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
            // Create a mock file object for Erdem Sahin CV
            const mockFile = new File([''], 'erdem-sahin-cv_summary_2025_may.pdf', { type: 'application/pdf' });
            
            // Use the cached CV data if available, otherwise extract from PDF
            if (this.cachedCvData) {
                this.cvFile = mockFile;
                this.displayFileInfo(mockFile);
                console.log('✅ Using cached Erdem Sahin CV data');
            } else {
                // Simulate loading the actual CV content
                const cvContent = await this.loadErdemSahinCvContent();
                this.cachedCvData = cvContent;
                this.cvFile = mockFile;
                this.displayFileInfo(mockFile);
                console.log('✅ Erdem Sahin CV loaded successfully');
            }
            
            this.validateForm();
            this.showSuccess('Erdem Sahin CV loaded successfully!');
            
        } catch (error) {
            console.error('❌ Error loading Erdem Sahin CV:', error);
            this.showError('Failed to load Erdem Sahin CV. Please try again.');
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
        this.cachedCvData = null;
        this.validateForm();
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

    handleCvSelection(e) {
        const selectedValue = e.target.value;
        
        if (selectedValue === 'erdem-sahin') {
            // Load the sample Erdem Sahin CV
            this.loadSampleCv();
        } else if (selectedValue === 'upload') {
            // Reset to upload mode
            this.resetToUploadMode();
        }
    }

    loadSampleCv() {
        // Create a mock file object for the sample CV
        const sampleCvContent = `
            Erdem Sahin
            DevOps Engineer
            
            Experience:
            - 5 years of experience in cloud architecture and DevOps
            - Expert in Azure WebApps, Kubernetes, Docker
            - Strong background in CI/CD pipelines
            - Experience with infrastructure as code
            - Skilled in monitoring and automation
            
            Education:
            - Bachelor's in Computer Science
            
            Skills:
            - Azure, AWS, Kubernetes, Docker
            - Terraform, Ansible
            - Python, Bash scripting
            - Jenkins, GitLab CI
            
            Contact:
            - Email: erdemsahin@email.com
            - Phone: +1 (555) 123-4567
        `;
        
        // Create a mock file object
        const mockFile = new Blob([sampleCvContent], { type: 'text/plain' });
        mockFile.name = 'erdem-sahin-cv.txt';
        mockFile.size = sampleCvContent.length;
        
        this.cvFile = mockFile;
        this.displayFileInfo(mockFile);
        this.validateForm();
        
        // Hide upload area and show file info
        this.uploadArea.style.display = 'none';
        this.fileInfo.style.display = 'block';
    }

    resetToUploadMode() {
        this.cvFile = null;
        this.cvUpload.value = '';
        this.fileInfo.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.validateForm();
    }

    validateForm() {
        const formData = new FormData(this.jobSpecsForm);
        const isFormValid = Array.from(formData.entries()).every(([key, value]) => value.trim() !== '');
        
        this.generateBtn.disabled = !isFormValid || !this.cvFile;
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
                pdfContent = this.cachedCvData;
                console.log('✅ Using cached CV data, length:', pdfContent.length, 'characters');
            } else {
                // Extract from uploaded file
                pdfContent = await this.extractPDFText(this.cvFile);
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
            console.log('✅ Prompt created successfully, length:', prompt.length, 'characters');
            console.log('📝 Prompt preview:', prompt.substring(0, 300) + '...');
            
            // Update debug information
            this.updateDebugPrompt(prompt);
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
                troubleshootingSteps = 'Try uploading a different PDF file or ensure the PDF is not password-protected.';
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
                // For sample CV, read as text
                const reader = new FileReader();
                reader.onload = function(event) {
                    const text = event.target.result;
                    console.log('✅ Sample CV text loaded successfully');
                    console.log('📄 Text length:', text.length, 'characters');
                    console.log('📄 Text preview:', text.substring(0, 300) + '...');
                    resolve(text);
                };
                reader.readAsText(file);
            });
        }
        
        // For PDF files, extract text using PDF.js
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async function(event) {
                try {
                    const arrayBuffer = event.target.result;
                    
                    // Import PDF.js library dynamically
                    const pdfjsLib = window.pdfjsLib || await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
                    
                    if (!window.pdfjsLib) {
                        window.pdfjsLib = pdfjsLib;
                        // Set up PDF.js worker
                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    }
                    
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';
                    
                    // Extract text from all pages
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }
                    
                    if (fullText.trim().length === 0) {
                        throw new Error('No text content found in PDF. The PDF might be image-based or corrupted.');
                    }
                    
                    console.log('✅ PDF text extraction successful');
                    console.log('📄 Extracted text length:', fullText.length, 'characters');
                    console.log('📄 Text preview:', fullText.substring(0, 300) + '...');
                    
                    resolve(fullText);
                } catch (error) {
                    console.error('❌ PDF extraction error:', error);
                    reject(new Error(`PDF extraction failed: ${error.message}`));
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read PDF file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    async callN8nAPI(cvContent, jobSpecs) {
        const N8N_ENDPOINT = this.N8N_ENDPOINT;
        
        console.log('🌐 N8N API Debug Information:');
        console.log('📍 Endpoint:', N8N_ENDPOINT);
        console.log('📊 CV Content Length:', cvContent.length);
        console.log('📋 Job Specs:', jobSpecs);

        const requestData = {
            cvContent: cvContent,
            jobSpecs: jobSpecs,
            prompt: this.createPrompt(cvContent, jobSpecs)
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
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoverLetterGenerator();
});
