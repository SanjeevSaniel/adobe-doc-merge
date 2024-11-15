import { config } from 'dotenv'; // Loads environment variables from a .env file
import { createReadStream } from 'fs'; // Creates a readable stream for the file system
import path from 'path'; // Handles file paths
import { NextResponse } from 'next/server'; // Response helper for Next.js API routes
import { Readable } from 'stream'; // Stream interface for Node.js
import {
  DocumentMergeJob,
  DocumentMergeParams,
  DocumentMergeResult,
  MimeType,
  OutputFormat,
  PDFServices,
  SDKError,
  ServiceApiError,
  ServicePrincipalCredentials,
  ServiceUsageError,
} from '@adobe/pdfservices-node-sdk';

config(); // Load environment variables

export async function POST(request: Request) {
  let readStream: Readable | undefined;
  try {
    // Create service principal credentials
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORGANIZATION_ID,
    });

    // Initialize PDF services
    const pdfServices = new PDFServices({ credentials });

    // Read JSON from request body
    const jsonDataForMerge = await request.json(); // Read JSON from request body

    // Adjusted file path
    const templatePath = path.join(
      process.cwd(),
      'public',
      'sampletemplates',
      'receiptTemplate.docx',
    );
    readStream = createReadStream(templatePath) as unknown as Readable;
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.DOCX,
    });

    // Set document merge parameters
    const params = new DocumentMergeParams({
      jsonDataForMerge,
      outputFormat: OutputFormat.DOCX,
    });

    // Create and submit the document merge job
    const job = new DocumentMergeJob({ inputAsset, params });

    // Retrieve the result of the document merge job
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: DocumentMergeResult,
    });

    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    // Read the resulting file into a buffer
    const mergedFileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      streamAsset.readStream.on('data', (chunk: Uint8Array) =>
        chunks.push(chunk),
      );
      streamAsset.readStream.on('end', () => resolve(Buffer.concat(chunks)));
      streamAsset.readStream.on('error', reject);
    });

    // Generate a unique file name using a timestamp
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const filename = `mergedOutput_${timestamp}.docx`;

    // Return the merged file in the response
    return new NextResponse(mergedFileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  } catch (err) {
    // Handle various errors
    if (err instanceof SDKError) {
      console.error('SDKError encountered:', err);
    } else if (err instanceof ServiceUsageError) {
      console.error('ServiceUsageError encountered:', err);
    } else if (err instanceof ServiceApiError) {
      console.error('ServiceApiError encountered:', err);
    } else {
      console.error('Exception encountered while executing operation', err);
    }
    return new NextResponse('Failed to merge DOCX files', { status: 500 });
  } finally {
    // Cleanup read stream
    if (
      readStream &&
      'destroy' in readStream &&
      typeof readStream.destroy === 'function'
    ) {
      (readStream as Readable).destroy();
    }
  }
}
