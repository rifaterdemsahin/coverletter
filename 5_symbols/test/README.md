# Test Directory - AI Cover Letter Generator

This directory contains test utilities, mock data, and test configurations for the AI Cover Letter Generator application.

## Directory Structure

```
test/
├── README.md              # This file - test directory documentation
├── test-utils.js          # JavaScript test utilities and helper functions
├── test-data.json         # Test data, mock responses, and configurations
└── [future test files]    # Additional test files as needed
```

## Files Overview

### test-utils.js
JavaScript utility functions for testing the AI Cover Letter Generator:

- **TestUtils Class**: Core testing utilities
  - `createMockPDFFile()` - Create mock PDF files for testing
  - `createMockFile()` - Create files with specific properties
  - `mockFetch()` - Mock fetch function for API testing
  - `validateFile()` - File validation utilities
  - `validateFormData()` - Form data validation
  - `simulatePDFExtraction()` - Simulate PDF text extraction
  - `simulateAPICall()` - Simulate API calls with various scenarios
  - `generateTestReport()` - Generate test execution reports

- **TestCasesFactory Class**: Factory for creating test cases
  - `getFileUploadTestCases()` - File upload test scenarios
  - `getFormValidationTestCases()` - Form validation test scenarios
  - `getAPITestCases()` - API integration test scenarios

- **Mock Data**: Predefined test data including:
  - Sample job specifications (valid, invalid, edge cases)
  - Sample CV content
  - Mock API responses (success, error, timeout scenarios)

### test-data.json
Comprehensive test data and configurations:

- **Sample Files**: Mock PDF files with various properties
- **Job Specifications**: Valid, invalid, and edge case job specs
- **Mock API Responses**: Success and error response scenarios
- **Test Scenarios**: Detailed test scenarios and expected results
- **Performance Metrics**: Target performance benchmarks
- **Browser Compatibility**: Supported browsers and platforms
- **Accessibility Tests**: WCAG compliance requirements
- **Security Tests**: Data security and API security test cases

## Usage

### In Browser Testing
```javascript
// Load test utilities
<script src="./test-utils.js"></script>

// Use in tests
const mockFile = TestUtils.createMockPDFFile();
const validation = TestUtils.validateFile(mockFile);
const testCases = TestCasesFactory.getFileUploadTestCases();
```

### In Node.js Testing
```javascript
const { TestUtils, TestCasesFactory, MOCK_DATA } = require('./test-utils.js');

// Create test scenarios
const testCases = TestCasesFactory.getFileUploadTestCases();
const mockResponse = TestUtils.mockFetch(MOCK_DATA.apiResponses.success);
```

### Test Data Access
```javascript
// Access test data
const testData = require('./test-data.json');
const validJobSpec = testData.sampleFiles.jobSpecifications.validJobSpec;
const performanceTargets = testData.performanceMetrics.targets;
```

## Test Categories

### 1. Unit Tests
Test individual components and functions:
- File validation logic
- Form validation logic
- Text sanitization functions
- PDF processing utilities

### 2. Integration Tests
Test component interactions:
- File upload → PDF processing integration
- Form validation → API call integration
- API response → UI display integration

### 3. End-to-End Tests
Test complete user workflows:
- Upload CV → Fill form → Generate cover letter
- Error handling workflows
- Success scenarios

### 4. Performance Tests
Test application performance:
- File processing times
- API response times
- Memory usage
- Load handling

### 5. Compatibility Tests
Test cross-browser and device compatibility:
- Different browser versions
- Mobile devices
- Various screen sizes

### 6. Accessibility Tests
Test accessibility compliance:
- Keyboard navigation
- Screen reader support
- Color contrast
- ARIA compliance

## Test Execution

### Manual Testing
Use the provided test utilities to create manual test scenarios:

```javascript
// Setup test environment
const testContainer = TestUtils.setupTestEnvironment();

// Run test scenarios
const testCases = TestCasesFactory.getFileUploadTestCases();
testCases.forEach(testCase => {
    // Execute test case
    console.log(`Running: ${testCase.name}`);
    // ... test execution logic
});

// Cleanup
TestUtils.cleanupTestEnvironment();
```

### Automated Testing
The test utilities support automated testing frameworks:

```javascript
// Jest example
describe('File Upload Tests', () => {
    test('should validate PDF files correctly', () => {
        const mockFile = TestUtils.createMockPDFFile();
        const validation = TestUtils.validateFile(mockFile);
        expect(validation.isValid).toBe(true);
    });
    
    test('should reject invalid file types', () => {
        const mockFile = TestUtils.createMockFile('content', 'test.txt', 'text/plain');
        const validation = TestUtils.validateFile(mockFile);
        expect(validation.isValid).toBe(false);
        expect(validation.errors).toContain('Invalid file type');
    });
});
```

## Test Data Management

### Adding New Test Cases
1. Add test case data to `test-data.json`
2. Create corresponding utility functions in `test-utils.js`
3. Update test scenarios as needed

### Mock Data Updates
- Update `MOCK_DATA` object in `test-utils.js` for JavaScript mock data
- Update `test-data.json` for comprehensive test configurations
- Ensure mock data reflects realistic scenarios

### Test Environment Setup
- Use `TestUtils.setupTestEnvironment()` to initialize test environment
- Use `TestUtils.cleanupTestEnvironment()` to clean up after tests
- Mock external dependencies (APIs, file system, etc.)

## Integration with Main Test Plan

This test directory supports the comprehensive test plan defined in `/7_test/test.md`:

- **Test Cases**: Provides concrete test case implementations
- **Mock Data**: Supplies realistic test data for all scenarios
- **Utilities**: Offers reusable testing functions
- **Configurations**: Defines test environment settings

## Future Enhancements

Planned additions to this test directory:

- **Visual Regression Tests**: Screenshot comparison utilities
- **Load Testing Scripts**: Performance testing automation
- **Security Testing Tools**: Vulnerability scanning utilities
- **Accessibility Testing Automation**: Automated a11y testing
- **Cross-Browser Testing Setup**: Browser automation configurations

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Include comprehensive test data
3. Add appropriate error handling
4. Document new utilities and functions
5. Update this README with new functionality

## Support

For questions about testing utilities or test data:

1. Review the main test plan in `/7_test/test.md`
2. Check existing test cases and mock data
3. Consult the application documentation
4. Create issues for missing test scenarios or utilities
