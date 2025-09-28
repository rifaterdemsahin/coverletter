/**
 * Test Utilities for AI Cover Letter Generator
 * 
 * This file contains utility functions and mock data for testing
 * the AI Cover Letter Generator application.
 */

// Test Configuration
const TEST_CONFIG = {
    N8N_ENDPOINT: 'https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a',
    TEST_TIMEOUT: 30000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_FILE_TYPES: ['application/pdf']
};

// Mock Data for Testing
const MOCK_DATA = {
    // Sample job specifications
    jobSpecs: {
        valid: {
            companyName: 'Google',
            jobTitle: 'Software Engineer',
            jobDescription: 'We are looking for a talented software engineer to join our team. The ideal candidate will have experience with modern web technologies and cloud platforms.',
            applicantName: 'John Doe',
            applicantEmail: 'john.doe@example.com'
        },
        invalid: {
            companyName: '',
            jobTitle: '',
            jobDescription: '',
            applicantName: '',
            applicantEmail: 'invalid-email'
        },
        edgeCase: {
            companyName: 'A'.repeat(1000), // Very long company name
            jobTitle: 'Senior Software Engineer',
            jobDescription: 'A'.repeat(10000), // Very long job description
            applicantName: 'Test User',
            applicantEmail: 'test@example.com'
        }
    },

    // Sample CV content
    cvContent: {
        sample: `
John Doe
Software Engineer

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in web development, cloud architecture, and team leadership. Proven track record in building scalable applications and leading development teams.

TECHNICAL SKILLS
• Programming Languages: JavaScript, Python, Java, C#
• Web Technologies: React, Angular, Vue.js, Node.js
• Cloud Platforms: AWS, Azure, Google Cloud
• Databases: PostgreSQL, MongoDB, Redis
• DevOps: Docker, Kubernetes, CI/CD

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp | 2020 - Present
• Led development of microservices architecture serving 1M+ users
• Implemented automated CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and established coding standards

Software Engineer | StartupXYZ | 2018 - 2020
• Developed full-stack web applications using React and Node.js
• Collaborated with cross-functional teams to deliver features
• Optimized application performance resulting in 40% faster load times

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2014 - 2018

CERTIFICATIONS
• AWS Certified Solutions Architect
• Google Cloud Professional Developer
• Microsoft Azure Developer Associate

CONTACT INFORMATION
Email: john.doe@example.com
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe
        `,
        empty: '',
        invalid: 'Invalid CV content with special characters: @#$%^&*()',
        large: 'A'.repeat(100000) // Large CV content
    },

    // Mock API responses
    apiResponses: {
        success: {
            success: true,
            coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Software Engineer position at Google. With my background in web development and cloud architecture, I am excited about the opportunity to contribute to your team's success.

In my current role as Senior Software Engineer at TechCorp, I have led the development of microservices architecture serving over 1 million users. My expertise spans across modern web technologies including React, Node.js, and cloud platforms like AWS and Google Cloud. I have implemented automated CI/CD pipelines that reduced deployment time by 60%.

What particularly excites me about this opportunity is Google's commitment to innovation and cutting-edge technology. I am passionate about building scalable applications that can handle millions of users. My experience with microservices architecture and cloud platforms aligns perfectly with your requirements.

I am eager to discuss how my expertise in software engineering can contribute to your team's continued success. I would welcome the opportunity to speak with you about this position and share more about my relevant experience.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,

John Doe
john.doe@example.com
[Your Phone Number]

Enclosure: Resume`
        },
        error: {
            success: false,
            error: 'API rate limit exceeded. Please try again later.'
        },
        timeout: {
            success: false,
            error: 'Request timeout. Please check your connection and try again.'
        }
    }
};

// Test Utility Functions
class TestUtils {
    /**
     * Create a mock PDF file for testing
     */
    static createMockPDFFile(content = MOCK_DATA.cvContent.sample, fileName = 'test-cv.pdf') {
        const blob = new Blob([content], { type: 'application/pdf' });
        return new File([blob], fileName, { type: 'application/pdf' });
    }

    /**
     * Create a mock file with specific properties
     */
    static createMockFile(content, fileName, fileType = 'application/pdf', fileSize = null) {
        const blob = new Blob([content], { type: fileType });
        const file = new File([blob], fileName, { type: fileType });
        
        // Override size if specified
        if (fileSize !== null) {
            Object.defineProperty(file, 'size', { value: fileSize });
        }
        
        return file;
    }

    /**
     * Mock fetch function for testing API calls
     */
    static mockFetch(responseData, delay = 1000) {
        return jest.fn(() => 
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (responseData.error) {
                        reject(new Error(responseData.error));
                    } else {
                        resolve({
                            ok: responseData.success,
                            status: responseData.success ? 200 : 400,
                            statusText: responseData.success ? 'OK' : 'Bad Request',
                            json: () => Promise.resolve(responseData)
                        });
                    }
                }, delay);
            })
        );
    }

    /**
     * Create mock FormData for testing
     */
    static createMockFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        return formData;
    }

    /**
     * Validate file properties
     */
    static validateFile(file, expectedType = 'application/pdf', maxSize = TEST_CONFIG.MAX_FILE_SIZE) {
        const errors = [];
        
        if (file.type !== expectedType) {
            errors.push(`Invalid file type: ${file.type}. Expected: ${expectedType}`);
        }
        
        if (file.size > maxSize) {
            errors.push(`File size ${file.size} exceeds maximum allowed size ${maxSize}`);
        }
        
        if (file.size === 0) {
            errors.push('File is empty');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate form data
     */
    static validateFormData(formData, requiredFields = ['companyName', 'jobTitle', 'jobDescription', 'applicantName', 'applicantEmail']) {
        const errors = [];
        const data = Object.fromEntries(formData.entries());
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`Missing required field: ${field}`);
            }
        });
        
        // Validate email format
        if (data.applicantEmail && !this.isValidEmail(data.applicantEmail)) {
            errors.push('Invalid email format');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            data
        };
    }

    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simulate PDF text extraction
     */
    static async simulatePDFExtraction(file, shouldFail = false) {
        if (shouldFail) {
            throw new Error('PDF extraction failed: File is corrupted');
        }
        
        // Simulate extraction delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return mock extracted text
        return MOCK_DATA.cvContent.sample;
    }

    /**
     * Simulate API call
     */
    static async simulateAPICall(cvContent, jobSpecs, shouldFail = false, failType = 'error') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (shouldFail) {
            switch (failType) {
                case 'timeout':
                    throw new Error('Request timeout');
                case 'network':
                    throw new Error('Network error: Failed to fetch');
                case 'rate-limit':
                    return MOCK_DATA.apiResponses.error;
                default:
                    throw new Error('API request failed');
            }
        }
        
        return MOCK_DATA.apiResponses.success;
    }

    /**
     * Generate test report
     */
    static generateTestReport(testResults) {
        const totalTests = testResults.length;
        const passedTests = testResults.filter(result => result.passed).length;
        const failedTests = totalTests - passedTests;
        
        return {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                passRate: (passedTests / totalTests * 100).toFixed(2) + '%'
            },
            results: testResults,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Create test environment
     */
    static setupTestEnvironment() {
        // Mock global objects if needed
        if (typeof global !== 'undefined') {
            global.fetch = this.mockFetch(MOCK_DATA.apiResponses.success);
        }
        
        // Setup DOM elements for testing
        const testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
        
        return testContainer;
    }

    /**
     * Cleanup test environment
     */
    static cleanupTestEnvironment() {
        const testContainer = document.getElementById('test-container');
        if (testContainer) {
            testContainer.remove();
        }
    }
}

// Test Cases Factory
class TestCasesFactory {
    /**
     * Generate file upload test cases
     */
    static getFileUploadTestCases() {
        return [
            {
                name: 'Valid PDF Upload',
                file: TestUtils.createMockPDFFile(),
                expectedResult: 'success'
            },
            {
                name: 'Invalid File Type',
                file: TestUtils.createMockFile('content', 'test.txt', 'text/plain'),
                expectedResult: 'error',
                expectedError: 'Please upload a PDF file.'
            },
            {
                name: 'File Too Large',
                file: TestUtils.createMockFile('content', 'large.pdf', 'application/pdf', 15 * 1024 * 1024),
                expectedResult: 'error',
                expectedError: 'File size must be less than 10MB.'
            },
            {
                name: 'Empty File',
                file: TestUtils.createMockFile('', 'empty.pdf', 'application/pdf', 0),
                expectedResult: 'error',
                expectedError: 'File is empty'
            }
        ];
    }

    /**
     * Generate form validation test cases
     */
    static getFormValidationTestCases() {
        return [
            {
                name: 'Valid Form Data',
                data: MOCK_DATA.jobSpecs.valid,
                expectedResult: 'valid'
            },
            {
                name: 'Missing Required Fields',
                data: MOCK_DATA.jobSpecs.invalid,
                expectedResult: 'invalid',
                expectedErrors: ['Missing required field: companyName', 'Missing required field: jobTitle']
            },
            {
                name: 'Invalid Email Format',
                data: { ...MOCK_DATA.jobSpecs.valid, applicantEmail: 'invalid-email' },
                expectedResult: 'invalid',
                expectedErrors: ['Invalid email format']
            }
        ];
    }

    /**
     * Generate API test cases
     */
    static getAPITestCases() {
        return [
            {
                name: 'Successful API Call',
                cvContent: MOCK_DATA.cvContent.sample,
                jobSpecs: MOCK_DATA.jobSpecs.valid,
                shouldFail: false,
                expectedResult: 'success'
            },
            {
                name: 'API Timeout',
                cvContent: MOCK_DATA.cvContent.sample,
                jobSpecs: MOCK_DATA.jobSpecs.valid,
                shouldFail: true,
                failType: 'timeout',
                expectedResult: 'error'
            },
            {
                name: 'Network Error',
                cvContent: MOCK_DATA.cvContent.sample,
                jobSpecs: MOCK_DATA.jobSpecs.valid,
                shouldFail: true,
                failType: 'network',
                expectedResult: 'error'
            }
        ];
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TEST_CONFIG,
        MOCK_DATA,
        TestUtils,
        TestCasesFactory
    };
} else if (typeof window !== 'undefined') {
    window.TestUtils = TestUtils;
    window.TestCasesFactory = TestCasesFactory;
    window.MOCK_DATA = MOCK_DATA;
    window.TEST_CONFIG = TEST_CONFIG;
}
