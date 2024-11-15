# Document Generation API

This project provides endpoints for generating DOCX and PDF documents using Adobe PDF Services. Users can select a template, provide data, and receive a generated document based on their inputs. 

## Features

- Generate DOCX and PDF files.
- Select from multiple templates.
- Provide custom data for document generation.
- Download documents with meaningful filenames.

## Table of Contents

- [Document Generation API](#document-generation-api)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Common Request and Response Details](#common-request-and-response-details)
      - [Request](#request)
      - [Response](#response)
    - [POST /api/generate-docx](#post-apigenerate-docx)
    - [POST /api/generate-pdf](#post-apigenerate-pdf)
  - [Environment Variables](#environment-variables)
  - [Dependencies](#dependencies)
  - [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/doc-gen-next.git
   cd doc-gen-next
   
2. Install the dependencies:

    ```bash
    npm install

3. Create a .env file in the root directory with your Adobe PDF Services credentials:

    ```env
    PDF_SERVICES_CLIENT_ID=your-client-id
    PDF_SERVICES_CLIENT_SECRET=your-client-secret
    PDF_SERVICES_ORGANIZATION_ID=your-organization-id

## Usage

1. Start the Development Server: Start the Next.js development server to serve the application locally.

   ```bash
   npm run dev
2. Navigate to the Application: Open your browser and navigate to

   <http://localhost:3000>

3. Input JSON Data: Paste your JSON data into the textarea provided in the form.

4. Submit the Form: Click the "Submit" button to send the JSON data to the API. The application will process the data and generate a merged DOCX file.

5. Download the Merged File: The merged DOCX file will be generated and downloaded automatically.

## API Endpoints

### Common Request and Response Details

#### Request

- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Body**:

    ```json
    {
      "data": { 
        "author": "Gary Lee", 
        "Company": { 
          "Name": "Projected", 
          "Address": "19718 Mandrake Way", 
          "PhoneNumber": "+1-100000098" 
          }, 
          "Invoice": { 
            "Date": "January 15, 2021", 
            "Number": 123, 
            "Items": [ 
              { 
                "item": "Gloves", 
                "description": "Microwave gloves", 
                "UnitPrice": 5, 
                "Quantity": 2, 
                "Total": 10 
              }, 
              { 
                "item": "Bowls", 
                "description": "Microwave bowls", 
                "UnitPrice": 10, 
                "Quantity": 2, 
                "Total": 20 
              } 
            ] 
          }, 
          "Customer": { 
            "Name": "Collins Candy", 
            "Address": "315 Dunning Way", 
            "PhoneNumber": "+1-200000046", 
            "Email": "cc@abcdef.co.dw" 
          }, 
          "Tax": 5, 
          "Shipping": 5, 
          "clause": { 
            "overseas": "The shipment might take 5-10 more than informed." 
          }, 
          "paymentMethod": "Cash" 
        },
      "template": "Template_File_Name"
    }

#### Response

- **Success**: The merged file is returned as a downloadable attachment.
- **Error**: Returns a `500` status code with an error message if the merge fails.

### POST /api/generate-docx

This endpoint accepts JSON data, merges it with a DOCX template, and returns the merged DOCX file for download.

- Deployed endpoint: <https://adobe-doc-merge.vercel.app/api/generate-docx>

### POST /api/generate-pdf

This endpoint accepts JSON data, merges it with a DOCX template, and returns the merged PDF file for download.

- Deployed endpoint: <https://adobe-doc-merge.vercel.app/api/generate-pdf>

## Environment Variables

This project requires the following environment variables, which should be added to your `.env` file:

- `PDF_SERVICES_CLIENT_ID`: Your Adobe PDF Services client ID.
- `PDF_SERVICES_CLIENT_SECRET`: Your Adobe PDF Services client secret.
- `PDF_SERVICES_ORGANIZATION_ID`: Your Adobe PDF Services organization ID.

## Dependencies

- `@adobe/pdfservices-node-sdk`: Adobe PDF Services Node SDK.
- `next`: Next.js framework.
- `react`: React library.
- `react-dom`: React DOM library.
- `react-hook-form`: For managing form state and validation.
- `zod`: For form schema validation.

## License

This project is licensed under the MIT License.
