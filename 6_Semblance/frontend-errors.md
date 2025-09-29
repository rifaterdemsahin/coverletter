# Frontend Errors - AI Cover Letter Generator

## Overview

This document covers all frontend-related errors including file upload, form validation, API communication, browser compatibility, and user interface issues.

## File Upload Errors

### Error: "Please upload a PDF file."
**Cause**: User uploaded a non-PDF file
**Solution**: 
```javascript
// File type validation
if (file.type !== 'application/pdf') {
    this.showError('Please upload a PDF file.');
    return;
}
```
**Prevention**: Clear file type restrictions in UI
**User Action**: Upload a valid PDF file

### Error: "File size must be less than 10MB."
**Cause**: Uploaded file exceeds size limit
**Solution**:
```javascript
// File size validation
if (file.size > 10 * 1024 * 1024) {
    this.showError('File size must be less than 10MB.');
    return;
}
```
**Prevention**: Show file size limit in UI
**User Action**: Compress PDF or use smaller file

### Error: "Failed to read file"
**Cause**: Corrupted PDF or file access issues
**Solution**:
```javascript
// Add file reading error handling
try {
    const fileContent = await this.readFile(file);
} catch (error) {
    this.showError('Failed to read file. Please try a different PDF.');
}
```
**Prevention**: Validate file integrity before processing
**User Action**: Try a different PDF file

### Error: "PDF extraction failed: this.jsIsw.pdf.Content is not a function"
**Cause**: PDF.js library not properly loaded or API method unavailable
**Solution**:
```javascript
// Enhanced PDF.js initialization with proper error handling
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

// Alternative PDF extraction method
async alternativePDFExtraction(arrayBuffer) {
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
        
        // Extract text from all pages with different approach
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
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

// Enhanced error handling for specific PDF.js errors
catch (error) {
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
}
```

**Troubleshooting Steps**:
```
🔍 PDF.JS API ERROR DETECTED:
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
```

**Prevention**: 
- Proper PDF.js library initialization
- Multiple extraction methods as fallbacks
- Enhanced error detection and recovery

**User Action**: 
- Refresh the page and try again
- Use a different browser if the issue persists
- Try the sample CV option to test the system

### Error: "PDF extraction failed: this.isRawPDFContent is not a function"
**Cause**: JavaScript method binding issue - the `isRawPDFContent` method is not available in the current context
**Solution**:
```javascript
// Enhanced method availability check before calling
console.log('🔍 Validating extracted PDF content...');
console.log('📊 Content validation details:', {
    textLength: fullText.length,
    hasText: fullText.trim().length > 0,
    firstChars: fullText.substring(0, 100),
    lastChars: fullText.substring(Math.max(0, fullText.length - 100))
});

// Check if isRawPDFContent method exists and is callable
if (typeof this.isRawPDFContent !== 'function') {
    console.error('❌ isRawPDFContent method not available, skipping validation');
    console.log('📄 Proceeding with extracted text without validation');
    resolve(fullText);
    return;
}

const isRawContent = this.isRawPDFContent(fullText);
console.log('🔍 Raw content check result:', isRawContent);
```

**Enhanced Error Handling**:
```javascript
// Comprehensive error logging with context information
catch (error) {
    console.error('❌ Error in generateCoverLetter:', error);
    console.error('Error details:', {
        name: error.name,
        message: error.message,
        type: typeof error,
        constructor: error.constructor.name,
        hasStack: !!error.stack
    });
    
    // Enhanced debug information
    console.log('🔍 Debug context information:');
    console.log('- PDF file:', this.cvFile ? this.cvFile.name : 'No file');
    console.log('- Cached CV data:', this.cachedCvData ? 'Available' : 'Not available');
    console.log('- Form data:', Object.fromEntries(new FormData(this.jobSpecsForm).entries()));
    console.log('- Available methods:', Object.getOwnPropertyNames(this).filter(name => typeof this[name] === 'function'));
}
```

**Specific Error Handler**:
```javascript
// Dedicated handler for "is not a function" errors
else if (error.message.includes('is not a function')) {
    troubleshootingSteps = `🔍 JAVASCRIPT METHOD ERROR DETECTED:
This error indicates a JavaScript method binding issue. The system has encountered a method that is not available.

SOLUTIONS:
1. Refresh the page and try again (JavaScript context may be corrupted)
2. Clear your browser cache and cookies
3. Try using a different browser (Chrome, Firefox, Safari)
4. Disable browser extensions temporarily
5. Use the "Load Erdem Sahin CV (Sample)" option to test the system

TECHNICAL DETAILS:
- Error: JavaScript method not available in current context
- This usually happens when the page context is corrupted
- The system has fallback methods that should work

💡 TIP: If the issue persists, try using the sample CV option or contact support.`;
}
```

**Prevention**: 
- Method availability checks before calling
- Enhanced error logging and context information
- Fallback behavior when methods are unavailable
- Comprehensive debug information collection

**User Action**: 
- Refresh the page and try again
- Clear browser cache and cookies
- Try a different browser if the issue persists
- Use the sample CV option to test the system

## Form Validation Errors

### Error: "Please fill in all required fields"
**Cause**: Missing required form data
**Solution**:
```javascript
// Form validation
validateForm() {
    const formData = new FormData(this.jobSpecsForm);
    const isFormValid = Array.from(formData.entries())
        .every(([key, value]) => value.trim() !== '');
    
    if (!isFormValid) {
        this.showError('Please fill in all required fields.');
        return false;
    }
    return true;
}
```
**Prevention**: Real-time form validation
**User Action**: Complete all required fields

### Error: "Invalid email format"
**Cause**: Malformed email address
**Solution**:
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    this.showError('Please enter a valid email address.');
    return;
}
```
**Prevention**: HTML5 email input type
**User Action**: Enter valid email format

## API Communication Errors

### Error: "Failed to generate cover letter. Network connectivity issue: Failed to fetch"
**Cause**: Network connectivity issue preventing connection to N8N endpoint
**Solution**:
```javascript
// Enhanced error handling with detailed diagnostics
catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
        detailedError = `Network connectivity issue: ${error.message}`;
        errorMessage += detailedError;
        troubleshootingSteps = `
🔍 NETWORK TROUBLESHOOTING STEPS:
1. Check your internet connection
2. Try refreshing the page
3. Check if the N8N endpoint is accessible: https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a
4. Disable browser extensions temporarily
5. Try a different browser or device
6. Check firewall/antivirus settings`;
        
        // Run connectivity diagnostics
        this.testConnectivity();
    }
}

// Automatic connectivity testing
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
        const endpointTest = await fetch('https://n8n.rifaterdemsahin.com/webhook/cover-letter-generator', { 
            method: 'OPTIONS'
        });
        console.log('✅ N8N endpoint: ACCESSIBLE');
    } catch (error) {
        console.error('❌ N8N endpoint: NOT ACCESSIBLE');
        console.error('   Endpoint may be down or blocked');
    }
}
```

**Debug Information**: The console will show detailed connectivity tests and specific failure points
**Prevention**: Network monitoring and health checks
**User Action**: Follow the displayed troubleshooting steps

### Error: "Service temporarily unavailable. Please try again later."
**Cause**: N8N endpoint is down or unreachable
**Solution**:
```javascript
// API error handling
try {
    const response = await fetch(N8N_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
        throw new Error(`N8N request failed: ${response.status}`);
    }
} catch (error) {
    if (error.message.includes('N8N request failed')) {
        this.showError('Service temporarily unavailable. Please try again later.');
    }
}
```
**Prevention**: Health checks and monitoring
**User Action**: Retry after a few minutes

### Error: "Network error. Please check your connection."
**Cause**: Internet connectivity issues
**Solution**:
```javascript
// Network error handling
catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.showError('Network error. Please check your connection.');
    }
}
```
**Prevention**: Offline detection and retry logic
**User Action**: Check internet connection

### Error: "Request timeout. Please try again."
**Cause**: API request taking too long
**Solution**:
```javascript
// Timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
    const response = await fetch(N8N_ENDPOINT, {
        signal: controller.signal,
        // ... other options
    });
} catch (error) {
    if (error.name === 'AbortError') {
        this.showError('Request timeout. Please try again.');
    }
}
```
**Prevention**: Set appropriate timeout values
**User Action**: Retry the request

## Browser Compatibility Errors

### Error: "Your browser doesn't support this feature"
**Cause**: Older browser without required APIs
**Solution**:
```javascript
// Feature detection
if (!window.fetch) {
    this.showError('Your browser doesn\'t support this feature. Please use a modern browser.');
    return;
}

if (!navigator.clipboard) {
    // Fallback for copy functionality
    this.showError('Copy functionality not available in your browser.');
}
```
**Prevention**: Progressive enhancement
**User Action**: Update browser or use supported browser

### Error: "JavaScript is disabled"
**Cause**: JavaScript disabled in browser
**Solution**:
```html
<!-- Fallback message -->
<noscript>
    <div class="error-message">
        JavaScript is required for this application to work. Please enable JavaScript in your browser.
    </div>
</noscript>
```
**Prevention**: Graceful degradation
**User Action**: Enable JavaScript

## User Interface Errors

### Error: "Failed to copy cover letter"
**Cause**: Clipboard API not available or permission denied
**Solution**:
```javascript
// Copy functionality with fallback
async copyCoverLetter() {
    try {
        await navigator.clipboard.writeText(this.coverLetter.textContent);
        this.showSuccess('Cover letter copied to clipboard!');
    } catch (error) {
        // Fallback method
        this.fallbackCopy(this.coverLetter.textContent);
    }
}

fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        this.showSuccess('Cover letter copied to clipboard!');
    } catch (error) {
        this.showError('Failed to copy cover letter.');
    }
    document.body.removeChild(textArea);
}
```
**Prevention**: Multiple copy methods
**User Action**: Use download option as alternative

### Error: "Failed to download cover letter"
**Cause**: Browser security restrictions or file system issues
**Solution**:
```javascript
// Download functionality with error handling
downloadCoverLetter() {
    try {
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
    } catch (error) {
        this.showError('Failed to download cover letter.');
    }
}
```
**Prevention**: Check browser permissions
**User Action**: Try copy option or different browser
