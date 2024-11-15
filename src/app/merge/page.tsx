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
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  bio: z.string().min(10, {
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

export default function MergePage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { bio: '' }, // Ensure initial value is empty
  });

  const [isDocxLoading, setIsDocxLoading] = useState(false); // State for DOCX loading status
  const [isPdfLoading, setIsPdfLoading] = useState(false); // State for PDF loading status
  const [isTextareaEmpty, setIsTextareaEmpty] = useState(true); // State for checking if textarea is empty

  // Effect to watch form changes and update isTextareaEmpty state
  useEffect(() => {
    const subscription = form.watch((value) => {
      setIsTextareaEmpty(!value.bio || value.bio.trim() === '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
      const jsonDataForMerge = JSON.parse(data.bio);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonDataForMerge),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        const { author } = jsonDataForMerge;
        const sanitizedAuthor = author.replace(/\s+/g, '');
        const date = new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Generate timestamp
        const filename = `Invoice_${sanitizedAuthor}_${date}_${timestamp}.${fileExtension}`;

        a.style.display = 'none';
        a.href = url;
        a.download = filename; // Set download attribute with filename
        document.body.appendChild(a); // Append link to the body
        a.click(); // Trigger click to start download
        window.URL.revokeObjectURL(url); // Revoke the object URL

        toast({
          title: 'File downloaded successfully!',
          description: `Your file has been downloaded as ${filename}.`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to merge files.',
        });
      }
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        toast({
          title: 'Error',
          description: `An error occurred: ${error.message}`,
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      if (fileExtension === 'docx') {
        setIsDocxLoading(false);
      } else {
        setIsPdfLoading(false);
      }
    }
  }

  // Function to reset form
  function handleReset() {
    form.reset({ bio: '' });
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Data</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Place your sample JSON data here.'
                  className='resize'
                  rows={5}
                  // cols={10}
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
                  endpoint: '/api/merge',
                  fileExtension: 'docx',
                }),
              )()
            }
            disabled={isDocxLoading}>
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
            disabled={isPdfLoading}>
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
  );
}

function LoadingIcon() {
  return (
    <svg
      className='animate-spin h-5 w-5 mr-3 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'>
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8v8z'></path>
    </svg>
  );
}
