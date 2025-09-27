class CoverLetterGenerator {
    constructor() {
        this.cvFile = null;
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
    }

    attachEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.cvUpload.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.cvUpload.addEventListener('change', this.handleFileSelect.bind(this));
        this.removeFile.addEventListener('click', this.removeFileHandler.bind(this));

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
        this.validateForm();
    }

    validateForm() {
        const formData = new FormData(this.jobSpecsForm);
        const isFormValid = Array.from(formData.entries()).every(([key, value]) => value.trim() !== '');
        
        this.generateBtn.disabled = !isFormValid || !this.cvFile;
    }

    async generateCoverLetter() {
        if (!this.cvFile) {
            this.showError('Please upload your CV first.');
            return;
        }

        this.setLoadingState(true);
        this.hideMessages();

        try {
            // Read PDF content
            const pdfContent = await this.extractPDFText(this.cvFile);
            
            // Get form data
            const formData = new FormData(this.jobSpecsForm);
            const jobSpecs = Object.fromEntries(formData.entries());

            // Generate cover letter using Gemini 2.5
            const coverLetter = await this.callGeminiAPI(pdfContent, jobSpecs);
            
            this.displayResult(coverLetter);
            this.showSuccess();
        } catch (error) {
            console.error('Error generating cover letter:', error);
            this.showError('Failed to generate cover letter. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async extractPDFText(file) {
        // For demo purposes, we'll simulate PDF text extraction
        // In a real implementation, you would use a library like pdf.js or pdf-parse
        return new Promise((resolve) => {
            // Simulate PDF text extraction delay
            setTimeout(() => {
                resolve(`
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
                `);
            }, 1000);
        });
    }

    async callGeminiAPI(cvContent, jobSpecs) {
        // Note: Replace with your actual Gemini API key
        const API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

        const prompt = this.createPrompt(cvContent, jobSpecs);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;
    }

    createPrompt(cvContent, jobSpecs) {
        return `
You are an expert cover letter writer. Generate a professional, personalized cover letter based on the following information:

CANDIDATE CV:
${cvContent}

JOB APPLICATION DETAILS:
- Company: ${jobSpecs.companyName}
- Position: ${jobSpecs.jobTitle}
- Job Description: ${jobSpecs.jobDescription}
- Applicant Name: ${jobSpecs.applicantName}
- Applicant Email: ${jobSpecs.applicantEmail}

INSTRUCTIONS:
1. Write a professional cover letter that highlights relevant experience from the CV
2. Match the candidate's skills to the job requirements mentioned in the job description
3. Keep it concise but impactful (3-4 paragraphs)
4. Use a professional but engaging tone
5. Include specific examples of relevant experience
6. End with a strong call to action
7. Format it properly with appropriate greetings and closings

Generate a cover letter that would help this candidate stand out for this specific position.
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoverLetterGenerator();
});
