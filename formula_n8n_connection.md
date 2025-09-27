# N8N Webhook Connection Formula

This document describes the parameters and format required to connect to the N8N webhook for the AI Cover Letter Generator.

## Endpoint Information

- **URL**: `https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Body Structure

The webhook expects a JSON payload with the following structure:

```json
{
  "cvContent": "string",
  "jobSpecs": {
    "companyName": "string",
    "jobTitle": "string", 
    "jobDescription": "string",
    "applicantName": "string",
    "applicantEmail": "string"
  },
  "prompt": "string"
}
```

## Parameter Details

### `cvContent` (string, required)
- **Description**: The extracted text content from the uploaded CV/Resume PDF
- **Example**: 
  ```
  "John Doe
  Software Engineer
  
  Experience:
  - 5 years of experience in web development
  - Expert in React, Node.js, Python
  - Strong background in cloud architecture
  
  Education:
  - Bachelor's in Computer Science"
  ```

### `jobSpecs` (object, required)
Contains all the job application details collected from the form:

#### `companyName` (string, required)
- **Description**: The name of the company the applicant is applying to
- **Example**: `"Google"`, `"Microsoft"`, `"Apple"`

#### `jobTitle` (string, required)
- **Description**: The position title being applied for
- **Example**: `"Software Engineer"`, `"Product Manager"`, `"DevOps Engineer"`

#### `jobDescription` (string, required)
- **Description**: The full job description text from the job posting
- **Example**: 
  ```
  "We are looking for a Senior Software Engineer to join our team. 
  You will be responsible for developing scalable web applications 
  using React and Node.js. Experience with cloud platforms preferred."
  ```

#### `applicantName` (string, required)
- **Description**: The full name of the job applicant
- **Example**: `"John Doe"`, `"Jane Smith"`

#### `applicantEmail` (string, required)
- **Description**: The email address of the job applicant
- **Example**: `"john.doe@email.com"`

### `prompt` (string, required)
- **Description**: The complete AI prompt that includes all context, instructions, and reference examples
- **Content**: This is a comprehensive prompt that includes:
  - CV content
  - Job specifications
  - Reference cover letter example
  - Detailed instructions for AI generation
  - Formatting guidelines

## Expected Response Format

The webhook should return a JSON response with the following structure:

```json
{
  "success": true,
  "coverLetter": "Generated cover letter content here...",
  "error": null
}
```

### Response Fields

#### `success` (boolean, required)
- **Description**: Indicates whether the request was processed successfully
- **Values**: `true` or `false`

#### `coverLetter` (string, required when success is true)
- **Description**: The AI-generated cover letter content
- **Format**: Plain text with proper formatting

#### `error` (string, optional)
- **Description**: Error message when success is false
- **Example**: `"Failed to generate cover letter due to API rate limit"`

## Error Handling

### HTTP Status Codes
- `200`: Success - Request processed successfully
- `400`: Bad Request - Invalid parameters or malformed request
- `500`: Internal Server Error - Server-side processing error

### Error Response Format
```json
{
  "success": false,
  "coverLetter": null,
  "error": "Detailed error message here"
}
```

## Example Complete Request

```json
{
  "cvContent": "Jane Smith\nSoftware Engineer\n\nExperience:\n- 3 years full-stack development\n- React, Node.js, PostgreSQL\n- AWS cloud experience\n\nEducation:\n- BS Computer Science, MIT",
  "jobSpecs": {
    "companyName": "Google",
    "jobTitle": "Senior Software Engineer",
    "jobDescription": "We are seeking a Senior Software Engineer to join our team. You will work on large-scale distributed systems, collaborate with cross-functional teams, and contribute to Google's core products. Requirements: 5+ years experience, strong programming skills, cloud experience preferred.",
    "applicantName": "Jane Smith",
    "applicantEmail": "jane.smith@email.com"
  },
  "prompt": "You are an expert cover letter writer. Generate a professional, personalized cover letter based on the following information:\n\nCANDIDATE CV:\nJane Smith\nSoftware Engineer\n\nExperience:\n- 3 years full-stack development\n- React, Node.js, PostgreSQL\n- AWS cloud experience\n\nEducation:\n- BS Computer Science, MIT\n\nJOB APPLICATION DETAILS:\n- Company: Google\n- Position: Senior Software Engineer\n- Job Description: We are seeking a Senior Software Engineer...\n- Applicant Name: Jane Smith\n- Applicant Email: jane.smith@email.com\n\n[Additional prompt instructions continue...]"
}
```

## Implementation Notes

1. **Content-Type**: Always set to `application/json`
2. **Method**: Must be `POST`
3. **Validation**: All required fields must be present and non-empty
4. **Size Limits**: Consider implementing reasonable limits for text fields
5. **Rate Limiting**: The webhook may implement rate limiting for API calls
6. **Timeout**: Consider implementing appropriate timeout values for the request

## Security Considerations

- The webhook endpoint should implement proper authentication if needed
- Validate all input parameters on the server side
- Implement rate limiting to prevent abuse
- Log requests for monitoring and debugging purposes
- Consider implementing request signing for enhanced security

## Testing the Connection

You can test the webhook connection using tools like:
- **Postman**: Create a POST request with the JSON payload
- **curl**: Use command-line curl with JSON data
- **JavaScript fetch**: Use the browser's fetch API as implemented in the application

Example curl command:
```bash
curl -X POST https://n8n.rifaterdemsahin.com/webhook/d6f37ea7-92a9-462e-845c-0c0455a18e0a \
  -H "Content-Type: application/json" \
  -d '{
    "cvContent": "Your CV content here...",
    "jobSpecs": {
      "companyName": "Test Company",
      "jobTitle": "Test Position",
      "jobDescription": "Test job description...",
      "applicantName": "Test User",
      "applicantEmail": "test@example.com"
    },
    "prompt": "Test prompt content..."
  }'
```
