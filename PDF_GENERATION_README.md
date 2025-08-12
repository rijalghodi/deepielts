# PDF Generation Feature

This document explains how to use the new PDF generation functionality for IELTS Writing feedback.

## Overview

The PDF generation feature allows users to download their IELTS Writing feedback as a professionally formatted PDF document. The PDF is generated using PDFKit and stored in Firebase Storage for easy access.

## Features

- **Professional Formatting**: Clean, readable PDF layout with proper typography
- **Metadata**: Includes submission ID, generation timestamp, and custom filename
- **Firebase Storage**: Secure cloud storage with public access URLs
- **Smart Caching**: Checks if PDF already exists before generating new ones
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during PDF generation
- **Persistent Storage**: PDF URLs are stored in submission records for future access

## Smart Caching

The PDF generation system includes intelligent caching to avoid unnecessary regeneration:

1. **Check Existing**: When a PDF generation request is made, the system first checks if a PDF already exists for that submission
2. **Return Existing**: If a PDF exists, it returns the existing URL immediately without regenerating
3. **Generate New**: If no PDF exists, it generates a new one and stores the URL for future requests
4. **Persistent Storage**: PDF URLs are stored in the submission record for quick access

This approach:

- Reduces processing time for repeat requests
- Saves Firebase Storage costs by avoiding duplicate files
- Improves user experience with faster response times
- Maintains consistency across multiple requests

## API Endpoint

### Generate PDF from Feedback

**POST** `/api/submissions/[submissionId]/pdf`

**Request Body:**

```json
{
  "fileName": "optional_custom_filename"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "pdfUrl": "https://storage.googleapis.com/bucket-name/feedback-pdfs/filename_submissionId_timestamp.pdf",
    "submissionId": "submission_id",
    "fileName": "filename_submissionId_timestamp",
    "isExisting": false
  }
}
```

**Response Fields:**

- `pdfUrl`: Direct link to the generated PDF file
- `submissionId`: ID of the submission
- `fileName`: Name of the generated PDF file
- `isExisting`: Boolean indicating if this is a newly generated PDF (false) or an existing one (true)

## Client-Side Usage

### Using the API Function

```typescript
import { submissionGeneratePDF } from "@/lib/api/submission.api";

// Generate PDF with default filename
const response = await submissionGeneratePDF(submissionId);

// Generate PDF with custom filename
const response = await submissionGeneratePDF(submissionId, "my_feedback");

if (response?.data?.pdfUrl) {
  // Open PDF in new tab
  window.open(response.data.pdfUrl, "_blank");
}
```

### Using the Component

The `SubmissionView` component now includes a "Download PDF" button that automatically generates and opens the PDF:

```tsx
<SubmissionView
  isOpen={isOpen}
  onClose={onClose}
  question={question}
  answer={answer}
  date={date}
  feedback={feedback}
  id={id}
/>
```

## PDF Structure

The generated PDF includes:

1. **Header**: "IELTS Writing Feedback" title
2. **Metadata**: Submission ID and generation timestamp
3. **Content**: Formatted feedback text with proper paragraph spacing
4. **Styling**: Professional typography with different font sizes for headings and body text

## File Storage

- **Location**: Firebase Storage bucket under `feedback-pdfs/` folder
- **Naming Convention**: `{filename}_{submissionId}_{timestamp}.pdf`
- **Access**: Public URLs for easy sharing and downloading
- **Metadata**: Includes submission ID, generation time, and original filename

## Error Handling

The system handles various error scenarios:

- **Authentication**: Users must be logged in to access their submissions
- **Ownership**: Users can only generate PDFs for their own submissions
- **Feedback Availability**: PDF generation requires existing feedback
- **Storage Errors**: Graceful handling of Firebase Storage issues
- **PDF Generation Errors**: Proper error messages for PDF creation failures

## Dependencies

- **PDFKit**: PDF generation library
- **Firebase Admin**: Cloud storage integration
- **Next.js API Routes**: Backend endpoint handling

## Environment Variables

Ensure these Firebase environment variables are configured:

```env
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket-name
FIREBASE_ADMIN_CLIENT_EMAIL=your-admin-email
FIREBASE_ADMIN_PRIVATE_KEY=your-admin-private-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Security Considerations

- **Authentication Required**: All PDF generation requests require valid user authentication
- **User Isolation**: Users can only access PDFs for their own submissions
- **Rate Limiting**: Consider implementing rate limiting for PDF generation
- **File Cleanup**: Implement periodic cleanup of old PDF files if needed

## Future Enhancements

Potential improvements for the PDF generation feature:

1. **Custom Templates**: Different PDF layouts for different question types
2. **Batch Generation**: Generate PDFs for multiple submissions at once
3. **Email Integration**: Send PDFs directly to user's email
4. **Watermarking**: Add user identification or branding to PDFs
5. **Compression**: Optimize PDF file sizes for faster downloads
6. **Caching**: Cache generated PDFs to avoid regeneration
