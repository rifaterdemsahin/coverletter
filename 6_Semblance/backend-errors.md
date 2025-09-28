# Backend Errors (N8N) - AI Cover Letter Generator

## Overview

This document covers all backend-related errors including N8N webhook issues, Gemini API problems, and data processing failures.

## Webhook Errors

### Error: "Invalid webhook request"
**Cause**: Malformed request or missing required fields
**Solution**:
```javascript
// N8N webhook validation
const cvContent = $input.first().json.cvContent;
const jobSpecs = $input.first().json.jobSpecs;
const prompt = $input.first().json.prompt;

if (!cvContent || !jobSpecs || !prompt) {
    return {
        success: false,
        error: 'Missing required fields: cvContent, jobSpecs, or prompt'
    };
}
```
**Prevention**: Frontend validation
**User Action**: Ensure all fields are filled

### Error: "Request too large"
**Cause**: Payload exceeds size limits
**Solution**:
```javascript
// Size validation
const requestSize = JSON.stringify($input.first().json).length;
if (requestSize > 1024 * 1024) { // 1MB limit
    return {
        success: false,
        error: 'Request payload too large'
    };
}
```
**Prevention**: Frontend size limits
**User Action**: Reduce content size

## Gemini API Errors

### Error: "Gemini API key invalid"
**Cause**: Invalid or expired API key
**Solution**:
```javascript
// API key validation
if (!process.env.GEMINI_API_KEY) {
    return {
        success: false,
        error: 'API key not configured'
    };
}
```
**Prevention**: Regular key validation
**User Action**: Contact administrator

### Error: "Gemini API rate limit exceeded"
**Cause**: Too many requests per minute
**Solution**:
```javascript
// Rate limiting
const rateLimit = await checkRateLimit();
if (rateLimit.exceeded) {
    return {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: rateLimit.retryAfter
    };
}
```
**Prevention**: Request queuing
**User Action**: Wait and retry

### Error: "Failed to generate cover letter. API response error: Invalid response from N8N endpoint"
**Cause**: N8N endpoint returned an unexpected response format or structure
**Solution**:
```javascript
// Enhanced response validation
const data = await response.json();
console.log('📄 Response Data:', data);

if (!data.success || !data.coverLetter) {
    console.error('❌ Invalid Response Structure:', {
        success: data.success,
        hasCoverLetter: !!data.coverLetter,
        error: data.error,
        responseKeys: Object.keys(data)
    });
    throw new Error(data.error || 'Invalid response from N8N endpoint');
}
```

**Debug Information**: Check browser console for detailed response structure
**Common Causes**:
1. N8N workflow returned `success: false`
2. Missing `coverLetter` field in response
3. Unexpected response format (not JSON)
4. Server-side error in N8N workflow
5. Gemini API returned an error

**Prevention**: Robust response validation and error handling
**User Action**: Try again or contact support if issue persists

**Troubleshooting Steps**:
1. Check browser console for detailed error logs
2. Verify N8N workflow is running correctly
3. Check if Gemini API key is valid and has quota
4. Test with smaller content to avoid rate limits
5. Verify N8N workflow returns expected JSON structure

### Error: "Failed to generate cover letter. API connection failed: API request failed: N8N request failed: 500 - - Workflow Webhook Error: Workflow could not be started!"
**Cause**: N8N workflow failed to start due to internal server error or configuration issues
**Solution**:
```javascript
// Enhanced error handling for workflow startup failures
catch (error) {
    if (error.message.includes('Workflow could not be started')) {
        console.error('❌ N8N Workflow Startup Failed:', {
            status: 500,
            error: 'Workflow could not be started',
            timestamp: new Date().toISOString(),
            endpoint: N8N_ENDPOINT
        });
        
        detailedError = `N8N workflow startup failed: ${error.message}`;
        errorMessage += detailedError;
        troubleshootingSteps = `
🔧 N8N WORKFLOW STARTUP TROUBLESHOOTING:
1. Check N8N server status and logs
2. Verify workflow is active and properly configured
3. Check if workflow has proper webhook configuration
4. Ensure all required nodes are properly connected
5. Verify workflow permissions and access rights
6. Check N8N server resources (CPU, memory, disk space)
7. Try restarting the N8N service
8. Contact N8N administrator if issue persists`;
    }
}
```

**Debug Information**: Check N8N server logs for detailed workflow startup errors
**Common Causes**:
1. N8N server is overloaded or out of resources
2. Workflow is disabled or not active
3. Webhook configuration is incorrect
4. Missing or misconfigured workflow nodes
5. N8N server internal error
6. Workflow execution queue is full
7. Database connectivity issues in N8N
8. Node.js process issues in N8N

**Prevention**: Regular N8N server monitoring and health checks
**User Action**: Wait a few minutes and try again, or contact administrator

**Troubleshooting Steps**:
1. **Check N8N Server Status**: Verify N8N service is running
2. **Check Workflow Status**: Ensure workflow is active and enabled
3. **Review N8N Logs**: Look for server-side error messages
4. **Check Server Resources**: Monitor CPU, memory, and disk usage
5. **Verify Webhook Configuration**: Ensure webhook is properly set up
6. **Test Workflow Manually**: Try running workflow from N8N interface
7. **Restart N8N Service**: If accessible, restart the N8N service
8. **Check Database**: Verify N8N database connectivity

**Server-Side Debugging**:
```bash
# Check N8N service status
sudo systemctl status n8n

# Check N8N logs
sudo journalctl -u n8n -f

# Check server resources
htop
df -h
free -m

# Test N8N endpoint directly
curl -X POST https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a \
  -H "Content-Type: application/json" \
  -d '{"test": true}' \
  -v
```

### Error: "Gemini API timeout"
**Cause**: API request taking too long
**Solution**:
```javascript
// Timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000);

try {
    const response = await fetch(geminiUrl, {
        signal: controller.signal,
        // ... other options
    });
} catch (error) {
    if (error.name === 'AbortError') {
        return {
            success: false,
            error: 'API request timeout'
        };
    }
}
```
**Prevention**: Appropriate timeout values
**User Action**: Retry request

### Error: "Gemini API content policy violation"
**Cause**: Content violates AI safety policies
**Solution**:
```javascript
// Content filtering
const filteredContent = await filterContent(cvContent, jobSpecs);
if (!filteredContent.safe) {
    return {
        success: false,
        error: 'Content violates safety policies'
    };
}
```
**Prevention**: Content pre-filtering
**User Action**: Review and modify content

## Data Processing Errors

### Error: "PDF text extraction failed"
**Cause**: Corrupted or unsupported PDF format
**Solution**:
```javascript
// PDF processing error handling
try {
    const pdfText = await extractPDFText(pdfBuffer);
    if (!pdfText || pdfText.length < 10) {
        throw new Error('PDF text extraction failed');
    }
} catch (error) {
    return {
        success: false,
        error: 'Failed to extract text from PDF'
    };
}
```
**Prevention**: PDF validation
**User Action**: Use different PDF file

### Error: "Prompt too long"
**Cause**: Generated prompt exceeds token limits
**Solution**:
```javascript
// Prompt length validation
const promptLength = prompt.length;
if (promptLength > 8000) { // Token limit
    const truncatedPrompt = truncatePrompt(prompt, 8000);
    // Use truncated prompt
}
```
**Prevention**: Content summarization
**User Action**: Reduce input content
