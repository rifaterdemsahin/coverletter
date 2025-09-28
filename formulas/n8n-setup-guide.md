# N8N Cover Letter Generator Setup Guide

This guide will help you set up the N8N workflow for the AI Cover Letter Generator.

## 📋 Prerequisites

- N8N instance running (cloud or self-hosted)
- OpenRouter API account with Gemini 2.5 Flash access
- Basic understanding of N8N workflows

## 🚀 Setup Instructions

### 1. Import the Workflow

1. **Download the workflow file**: `n8n-cover-letter-workflow.json`
2. **Open N8N**: Navigate to your N8N instance
3. **Import workflow**: 
   - Click "Import from file" or use the import button
   - Select the `n8n-cover-letter-workflow.json` file
   - The workflow will be imported with all nodes and connections

### 2. Configure Credentials

#### OpenRouter API Credentials
1. **Get OpenRouter API Key**:
   - Visit [OpenRouter](https://openrouter.ai/)
   - Create an account and get your API key
   - Ensure you have access to Gemini 2.5 Flash model

2. **Configure in N8N**:
   - Go to Settings → Credentials
   - Click "Add Credential"
   - Select "OpenRouter API"
   - Enter your API key
   - Name it "OpenRouter account"
   - Save the credential

3. **Update the workflow**:
   - Open the "Gemini 2.5 Flash Model" node
   - Select your OpenRouter credentials
   - Save the node

### 3. Activate the Workflow

1. **Activate the workflow**: Toggle the "Active" switch in the top right
2. **Get the webhook URL**: 
   - Click on the "Webhook Trigger" node
   - Copy the webhook URL
   - It should look like: `https://your-n8n-instance.com/webhook/cover-letter-generator`

### 4. Update Frontend Configuration

Update your frontend `script.js` file with the correct N8N endpoint:

```javascript
const N8N_ENDPOINT = 'https://your-n8n-instance.com/webhook/cover-letter-generator';
```

## 🔧 Workflow Structure

### Nodes Overview

1. **Webhook Trigger**: Receives POST requests from the frontend
2. **Extract Input Data**: Parses the incoming JSON data
3. **AI Agent**: Processes the prompt and generates the cover letter
4. **Gemini Model**: Provides the AI language model
5. **Format Response**: Structures the response for the frontend
6. **Webhook Response**: Sends the response back to the frontend

### Data Flow

```
Frontend → Webhook → Extract Data → AI Agent → Gemini → Format → Response → Frontend
```

## 📊 Expected Request Format

The workflow expects the following JSON structure:

```json
{
  "cvContent": "Extracted CV text content",
  "jobSpecs": {
    "companyName": "Company Name",
    "jobTitle": "Job Title",
    "jobDescription": "Full job description",
    "applicantName": "Applicant Name",
    "applicantEmail": "applicant@email.com"
  },
  "prompt": "Generated prompt with instructions"
}
```

## 📤 Expected Response Format

The workflow returns the following JSON structure:

```json
{
  "success": true,
  "coverLetter": "Generated cover letter content",
  "error": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🛠️ Customization Options

### 1. Modify the AI Prompt

Edit the "AI Agent - Cover Letter Generator" node to:
- Change the writing style
- Add specific requirements
- Modify the output format
- Include additional instructions

### 2. Adjust AI Model Settings

In the "Gemini 2.5 Flash Model" node:
- **Temperature**: Adjust creativity (0.0-1.0)
- **Max Output Tokens**: Control response length
- **Top P**: Control response diversity

### 3. Add Error Handling

The workflow includes basic error handling. You can enhance it by:
- Adding specific error types
- Implementing retry logic
- Adding logging for debugging

## 🔍 Testing the Workflow

### 1. Test with Sample Data

Use the following test payload:

```json
{
  "cvContent": "John Doe\nSoftware Engineer\n5 years experience in Python, JavaScript, React\nBachelor's in Computer Science",
  "jobSpecs": {
    "companyName": "Tech Corp",
    "jobTitle": "Senior Software Engineer",
    "jobDescription": "We are looking for a senior software engineer with experience in Python and React",
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@email.com"
  },
  "prompt": "Generate a professional cover letter"
}
```

### 2. Verify Response

Check that the response includes:
- `success: true`
- `coverLetter` field with generated content
- Proper formatting and structure

## 🚨 Troubleshooting

### Common Issues

1. **Webhook not responding**:
   - Check if the workflow is activated
   - Verify the webhook URL is correct
   - Ensure N8N instance is accessible

2. **AI generation fails**:
   - Verify OpenRouter credentials are correct
   - Check if you have access to Gemini 2.5 Flash
   - Ensure API key has sufficient credits

3. **CORS errors**:
   - Configure CORS settings in N8N
   - Add your frontend domain to allowed origins

### Debug Steps

1. **Check execution logs**:
   - Go to Executions tab in N8N
   - Review failed executions
   - Check error messages

2. **Test individual nodes**:
   - Use the "Execute Node" feature
   - Test each node separately
   - Verify data flow

## 📈 Performance Optimization

### 1. Response Time
- Monitor execution times
- Optimize prompt length
- Consider caching for repeated requests

### 2. Cost Management
- Monitor API usage
- Set up usage limits
- Optimize token usage

## 🔒 Security Considerations

1. **API Key Protection**:
   - Store credentials securely in N8N
   - Never expose API keys in frontend code
   - Use environment variables for sensitive data

2. **Input Validation**:
   - Validate incoming data
   - Sanitize user inputs
   - Implement rate limiting

3. **Access Control**:
   - Secure your N8N instance
   - Use HTTPS for webhooks
   - Implement authentication if needed

## 📝 Maintenance

### Regular Tasks

1. **Monitor API usage**: Check OpenRouter usage and costs
2. **Update prompts**: Refine AI instructions based on results
3. **Test workflow**: Regularly test with new data
4. **Backup workflow**: Export and save workflow configurations

### Updates

1. **Model updates**: Stay updated with new Gemini model versions
2. **Prompt improvements**: Continuously improve based on user feedback
3. **Feature additions**: Add new capabilities as needed

## 🆘 Support

If you encounter issues:

1. Check the N8N documentation
2. Review OpenRouter API documentation
3. Test with sample data
4. Check execution logs for errors

## 📚 Additional Resources

- [N8N Documentation](https://docs.n8n.io/)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Webhook Testing Tools](https://webhook.site/)

---

**Note**: This workflow template is designed to work with the AI Cover Letter Generator frontend. Make sure to update the frontend configuration with your N8N webhook URL after setup.
