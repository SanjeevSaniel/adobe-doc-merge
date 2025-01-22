import { config } from 'dotenv'; // Importing config from dotenv to load environment variables
import { createReadStream, readFileSync } from 'fs'; // Importing file system functions for reading files
import path from 'path'; // Importing path module for file path operations
import { NextResponse } from 'next/server'; // Importing NextResponse for server responses
import { Readable } from 'stream'; // Importing Readable stream from stream module
import {
  DocumentMergeJob, // Importing DocumentMergeJob class for creating document merge jobs
  DocumentMergeParams, // Importing DocumentMergeParams class for setting document merge parameters
  DocumentMergeResult, // Importing DocumentMergeResult class for handling document merge results
  MimeType, // Importing MimeType enum for specifying mime types
  OutputFormat, // Importing OutputFormat enum for specifying output formats
  PDFServices, // Importing PDFServices class for interacting with Adobe PDF services
  SDKError, // Importing SDKError class for handling SDK-related errors
  ServiceApiError, // Importing ServiceApiError class for handling API-related errors
  ServicePrincipalCredentials, // Importing ServicePrincipalCredentials class for setting credentials
  ServiceUsageError, // Importing ServiceUsageError class for handling usage-related errors
} from '@adobe/pdfservices-node-sdk'; // Importing Adobe PDF Services SDK components

config(); // Loading environment variables

export async function POST(request: Request) {
  let readStream: Readable | undefined; // Initializing readStream variable
  try {
    // Creating credentials for Adobe PDF Services
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORGANIZATION_ID,
    });

    const pdfServices = new PDFServices({ credentials }); // Initializing PDFServices with credentials

    const requestBody = await request.json(); // Parsing the request body as JSON

    // Ensuring that data and template fields are present in the request body
    const { data, template } = requestBody;
    if (!data || !template) {
      return new NextResponse('Invalid input: data and template are required', {
        status: 400,
      });
    }

    const jsonDataForMerge = data; // Using the structured JSON data directly

    // Constructing the path to the template file
    const templatePath = path.join(
      process.cwd(),
      'public',
      'sampletemplates',
      template,
    );

    // Validating if the template file exists and is readable
    try {
      readFileSync(templatePath);
    } catch (error) {
      console.error('Template file not found or unreadable:', error); // Logging the error
      return new NextResponse('Template file not found or unreadable', {
        status: 400,
      });
    }

    readStream = createReadStream(templatePath) as unknown as Readable; // Creating a readable stream from the template file
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.DOCX,
    }); // Uploading the template file to PDF Services

    // Setting up parameters for document merge
    const params = new DocumentMergeParams({
      jsonDataForMerge,
      outputFormat: OutputFormat.PDF, // Specifying the output format as PDF
    });

    const job = new DocumentMergeJob({ inputAsset, params }); // Creating a document merge job

    const pollingURL = await pdfServices.submit({ job }); // Submitting the job and getting the polling URL
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: DocumentMergeResult,
    }); // Getting the job result

    const resultAsset = pdfServicesResponse.result.asset; // Extracting the result asset
    const streamAsset = await pdfServices.getContent({ asset: resultAsset }); // Getting the content stream of the result asset

    // Reading the content stream into a buffer
    const mergedFileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      streamAsset.readStream.on('data', (chunk: Uint8Array) =>
        chunks.push(chunk),
      );
      streamAsset.readStream.on('end', () => resolve(Buffer.concat(chunks)));
      streamAsset.readStream.on('error', reject);
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Generating a timestamp for the filename
    const filename = `mergedOutput_${timestamp}.pdf`; // Constructing the filename

    // Returning the merged PDF file as a response
    return new NextResponse(mergedFileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err) {
    // Handling different types of errors
    if (err instanceof SDKError) {
      console.error('SDKError encountered:', err);
    } else if (err instanceof ServiceUsageError) {
      console.error('ServiceUsageError encountered:', err);
    } else if (err instanceof ServiceApiError) {
      console.error('ServiceApiError encountered:', err);
    } else {
      console.error('Exception encountered while executing operation', err);
    }
    return new NextResponse('Failed to merge PDF files', { status: 500 });
  } finally {
    // Ensuring the readStream is properly destroyed
    if (
      readStream &&
      'destroy' in readStream &&
      typeof readStream.destroy === 'function'
    ) {
      (readStream as Readable).destroy();
    }
  }
}
