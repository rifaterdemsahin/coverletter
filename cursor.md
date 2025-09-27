# AI Cover Letter Generator

A modern, AI-powered web application that generates personalized cover letters using Google's Gemini 2.5 API. Users can upload their CV in PDF format and input job specifications to create tailored cover letters.

## Features

- **PDF Upload**: Drag-and-drop or click to upload CV in PDF format
- **Job Specifications Form**: Input company details, job title, description, and personal information
- **AI Generation**: Uses Gemini 2.5 Flash model to generate personalized cover letters
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Copy & Download**: Easy sharing options for generated cover letters
- **Real-time Validation**: Form validation and file type checking
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Integration**: Google Gemini 2.5 Flash API
- **PDF Processing**: Client-side PDF text extraction (simulated)
- **Styling**: Custom CSS with modern design principles
- **Icons**: SVG icons for better performance

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality and API integration
├── package.json        # Project configuration and dependencies
├── cursor.md          # Project documentation
├── coverletter_template.json  # Template data (existing)
└── coverlettersample.txt      # Sample cover letter (existing)
```

## Setup Instructions

### Prerequisites

- Modern web browser with JavaScript enabled
- N8N backend endpoint configured (for production use)
- Local web server (Python, Node.js, or any static server)

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd ai-cover-letter-generator
   ```

2. **Configure N8N Endpoint (Optional for local development)**
   - The app uses `https://n8n.rifaterdemsahin.com/webhook/cover-letter-generator` by default
   - For local development, you can modify the endpoint in `script.js` if needed
   - The N8N workflow handles the Gemini API integration securely

3. **Start a Local Server**
   
   **Option 1: Using Python (Recommended)**
   ```bash
   python -m http.server 8000
   ```
   
   **Option 2: Using Node.js**
   ```bash
   npm install
   npm run serve
   ```
   
   **Option 3: Using any static file server**
   - Serve the files from any static file server
   - Ensure CORS is properly configured for API calls

4. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - The application should load with the modern UI

## Usage

1. **Upload CV**
   - Drag and drop your CV PDF file onto the upload area
   - Or click the upload area to browse and select a file
   - Supported format: PDF only
   - Maximum file size: 10MB

2. **Fill Job Specifications**
   - Company Name: The company you're applying to
   - Job Title: The position you're applying for
   - Job Description: Paste the full job posting/description
   - Your Name: Your full name
   - Your Email: Your contact email

3. **Generate Cover Letter**
   - Click the "Generate Cover Letter" button
   - Wait for the AI to process and generate your personalized cover letter
   - The generated letter will appear in the results section

4. **Copy or Download**
   - Use the "Copy" button to copy the cover letter to clipboard
   - Use the "Download" button to save as a text file

## API Integration

The application integrates with a secure N8N backend that handles Google's Gemini 2.5 Flash API:

- **Backend Endpoint**: `https://n8n.rifaterdemsahin.com/webhook/cover-letter-generator`
- **Model**: `gemini-2.0-flash-exp` (handled by N8N workflow)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 2048 (sufficient for cover letter length)
- **Prompt Engineering**: Custom prompts that analyze CV and job requirements
- **Security**: API keys stored securely on the backend

### API Request Structure

```javascript
{
  "cvContent": "Extracted CV text",
  "jobSpecs": {
    "companyName": "Company Name",
    "jobTitle": "Job Title",
    "jobDescription": "Job Description",
    "applicantName": "Applicant Name",
    "applicantEmail": "applicant@email.com"
  },
  "prompt": "Generated prompt with CV and job specs"
}
```

### API Response Structure

```javascript
{
  "success": true,
  "coverLetter": "Generated cover letter content",
  "error": null
}
```

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, or layout
- The design uses CSS custom properties for easy theming
- Responsive design works on desktop and mobile devices

### AI Prompts
- Edit the `createPrompt()` method in `script.js` to modify how cover letters are generated
- Adjust the prompt to match your preferred writing style or requirements
- Update N8N workflow for backend prompt modifications

### File Processing
- Currently uses simulated PDF text extraction
- To implement real PDF parsing, integrate libraries like:
  - `pdf.js` for client-side processing
  - `pdf-parse` for Node.js backend
  - Server-side PDF processing with Python libraries

## Security Considerations

- **API Key**: API keys stored securely on N8N backend, not exposed to frontend
- **CORS**: Ensure proper CORS configuration for N8N endpoint calls
- **File Validation**: Always validate uploaded files on both client and server
- **Rate Limiting**: Consider implementing rate limiting for production use
- **Backend Security**: N8N workflow handles secure API key management

## Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Features Used**: ES6 modules, Fetch API, File API, Clipboard API
- **Fallbacks**: Graceful degradation for older browsers

## Performance

- **Optimized CSS**: Minimal CSS with efficient selectors
- **Lazy Loading**: Components load as needed
- **Efficient API Calls**: Single API call per generation
- **Client-side Processing**: Reduces server load

## Troubleshooting

### Common Issues

1. **N8N Endpoint Error**
   - Ensure the N8N endpoint is accessible and properly configured
   - Check that the endpoint URL is correct in `script.js`

2. **CORS Errors**
   - Make sure you're running the app from a local server, not opening the HTML file directly
   - The N8N endpoint requires proper CORS headers

3. **PDF Upload Issues**
   - Ensure the file is a valid PDF
   - Check file size (must be under 10MB)
   - Verify file permissions

4. **Generation Fails**
   - Check browser console for error messages
   - Verify internet connection
   - Ensure N8N endpoint is accessible and responding

### Debug Mode

To enable debug logging, add this to the browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Future Enhancements

- [ ] Real PDF text extraction
- [ ] Multiple cover letter templates
- [ ] Cover letter history and favorites
- [ ] Integration with job boards
- [ ] ATS optimization scoring
- [ ] Multi-language support
- [ ] Advanced customization options
- [ ] User accounts and cloud storage
- [ ] Enhanced N8N workflows with additional AI models
- [ ] Backend analytics and usage tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the browser console for error messages

---

**Note**: This application requires a properly configured N8N backend endpoint to function. The current implementation includes simulated PDF processing for demonstration purposes. In a production environment, implement proper PDF text extraction and ensure the N8N workflow is properly configured with the Gemini API key.
