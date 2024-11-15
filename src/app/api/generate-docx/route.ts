import { config } from 'dotenv';
import { createReadStream, readFileSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
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

config();

export async function POST(request: Request) {
  let readStream: Readable | undefined;
  try {
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET,
      organizationId: process.env.PDF_SERVICES_ORGANIZATION_ID,
    });

    const pdfServices = new PDFServices({ credentials });

    const requestBody = await request.json();

    // Ensure that data and template fields are present
    const { data, template } = requestBody;
    if (!data || !template) {
      return new NextResponse('Invalid input: data and template are required', {
        status: 400,
      });
    }

    const jsonDataForMerge = data; // No need to parse JSON data

    const templatePath = path.join(
      process.cwd(),
      'public',
      'sampletemplates',
      template,
    );

    // Validate if the template exists and is readable
    try {
      readFileSync(templatePath);
    } catch (error) {
      console.error('Template file not found or unreadable:', error); // Log the error
      return new NextResponse('Template file not found or unreadable', {
        status: 400,
      });
    }

    readStream = createReadStream(templatePath) as unknown as Readable;
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.DOCX,
    });

    const params = new DocumentMergeParams({
      jsonDataForMerge,
      outputFormat: OutputFormat.DOCX, // For generating DOCX files
    });

    const job = new DocumentMergeJob({ inputAsset, params });

    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: DocumentMergeResult,
    });

    const resultAsset = pdfServicesResponse.result.asset;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    const mergedFileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      streamAsset.readStream.on('data', (chunk: Uint8Array) =>
        chunks.push(chunk),
      );
      streamAsset.readStream.on('end', () => resolve(Buffer.concat(chunks)));
      streamAsset.readStream.on('error', reject);
    });

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const filename = `mergedOutput_${timestamp}.docx`;

    return new NextResponse(mergedFileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  } catch (err) {
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
    if (
      readStream &&
      'destroy' in readStream &&
      typeof readStream.destroy === 'function'
    ) {
      (readStream as Readable).destroy();
    }
  }
}
