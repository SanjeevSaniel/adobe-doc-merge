# Doc-Gen-Next

This project demonstrates how to merge DOCX files using the Adobe PDF Services API in a Next.js application. The project includes a form where users can input JSON data, which is then used to merge and generate a DOCX file for download.

## Table of Contents

- [Doc-Gen-Next](#doc-gen-next)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [POST /api/merge](#post-apimerge)
      - [Request](#request)
      - [Response](#response)
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

   <http://localhost:3000/merge>

3. Input JSON Data: Paste your JSON data into the textarea provided in the form.

4. Submit the Form: Click the "Submit" button to send the JSON data to the API. The application will process the data and generate a merged DOCX file.

5. Download the Merged File: The merged DOCX file will be generated and downloaded automatically.

## API Endpoints

### POST /api/merge

This endpoint accepts JSON data, merges it with a DOCX template, and returns the merged file for download.

#### Request

- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
- **Body**:

    ```json
    {
      "author": "Author Name",
      "other": "Your other JSON data here"
    }

#### Response

- **Success**: The merged DOCX file is returned as a downloadable attachment.
- **Error**: Returns a `500` status code with an error message if the merge fails.

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
