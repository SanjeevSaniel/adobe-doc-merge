'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Header from '../header';
import { LoadingIcon } from '@/components/LoadingIcon';

const FormSchema = z.object({
  jsonData: z.string().min(10, {
    message: 'Sample JSON data is required',
  }),
});

// Define types for form data
type FormData = z.infer<typeof FormSchema>;

interface HandleDownloadParams {
  data: FormData;
  endpoint: string;
  fileExtension: 'docx' | 'pdf';
}

const GenerateDocumentPage: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { jsonData: '' },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDocxLoading, setIsDocxLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isTextareaEmpty, setIsTextareaEmpty] = useState(true);

  useEffect(() => {
    const subscription = form.watch((value) => {
      setIsTextareaEmpty(!value.jsonData || value.jsonData.trim() === '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const readFileAsBinary = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read file as binary'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsArrayBuffer(file);
    });
  };

  async function handleDownload({
    data,
    endpoint,
    fileExtension,
  }: HandleDownloadParams) {
    if (fileExtension === 'docx') {
      setIsDocxLoading(true);
    } else {
      setIsPdfLoading(true);
    }
    try {
      let binaryFile: ArrayBuffer | null = null;
      if (selectedFile) {
        binaryFile = await readFileAsBinary(selectedFile);
      }
      console.log('Sending data to API:', {
        data: data.jsonData,
        file: binaryFile,
      });
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: data.jsonData, file: binaryFile }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const templateName = 'Template';
        const filename = `MergedOutput_${templateName}_${date}_${timestamp}.${fileExtension}`;
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast({
          title: 'File downloaded successfully!',
          description: `Your file has been downloaded as ${filename}.`,
        });
      } else {
        toast({ title: 'Error', description: 'Failed to merge files.' });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: `An error occurred: ${error.message}`,
        });
      } else {
        toast({ title: 'Error', description: 'An unknown error occurred.' });
      }
    } finally {
      if (fileExtension === 'docx') {
        setIsDocxLoading(false);
      } else {
        setIsPdfLoading(false);
      }
    }
  }

  function handleReset() {
    form.reset({ jsonData: '' });
    setSelectedFile(null);
  }

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full'>
      <Header />
      <div>
        <Form {...form}>
          <form className='w-9/10 space-y-6'>
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <FormLabel htmlFor='picture'>
                Upload the sample template
              </FormLabel>
              <FormControl>
                <input
                  id='picture'
                  type='file'
                  onChange={handleFileChange}
                />
              </FormControl>
            </div>
            <FormField
              control={form.control}
              name='jsonData'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Place your sample JSON data here.'
                      className='resize'
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4'>
              <Button
                type='button'
                onClick={() =>
                  form.handleSubmit((data) =>
                    handleDownload({
                      data,
                      endpoint: '/api/generate-docx',
                      fileExtension: 'docx',
                    }),
                  )()
                }
                disabled={isDocxLoading || isTextareaEmpty}>
                {isDocxLoading ? <LoadingIcon /> : 'Download DOCX'}
              </Button>
              <Button
                type='button'
                onClick={() =>
                  form.handleSubmit((data) =>
                    handleDownload({
                      data,
                      endpoint: '/api/generate-pdf',
                      fileExtension: 'pdf',
                    }),
                  )()
                }
                disabled={isPdfLoading || isTextareaEmpty}>
                {isPdfLoading ? <LoadingIcon /> : 'Download PDF'}
              </Button>
              <Button
                variant='secondary'
                type='button'
                onClick={handleReset}
                disabled={isTextareaEmpty || isDocxLoading || isPdfLoading}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default GenerateDocumentPage;
