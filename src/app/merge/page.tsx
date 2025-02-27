'use client';

import { LoadingIcon } from '@/components/LoadingIcon';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  jsonData: z.string().min(10, {
    message: 'Sample JSON data is required',
  }),
  template: z.string(), // Ensure a template is selected
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
    defaultValues: { jsonData: '', template: '' }, // Ensure initial value is empty
  });

  const [isDocxLoading, setIsDocxLoading] = useState(false); // State for DOCX loading status
  const [isPdfLoading, setIsPdfLoading] = useState(false); // State for PDF loading status
  const [isTextareaEmpty, setIsTextareaEmpty] = useState(true); // State for checking if textarea is empty

  // Effect to watch form changes and update isTextareaEmpty state
  useEffect(() => {
    const subscription = form.watch((value) => {
      setIsTextareaEmpty(!value.jsonData || value.jsonData.trim() === '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Watch for the selected template to enable/disable the textarea
  const selectedTemplate = form.watch('template');

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
      // const jsonDataForMerge = JSON.parse(data.jsonData); // Parse JSON data

      // Log the data being sent to the API
      console.log('Sending data to API:', {
        data: data.jsonData,
        template: data.template,
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data.jsonData, template: data.template }),
      });

      if (response.ok) {
        const blob = await response.blob(); // Get the response as a blob
        const url = window.URL.createObjectURL(blob); // Create URL for the blob
        const a = document.createElement('a'); // Create a link element

        // const { author } = jsonDataForMerge;
        // const sanitizedAuthor = author.replace(/\s+/g, ''); // Sanitize author name
        const date = new Date().toISOString().split('T')[0]; // Get current date
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Generate timestamp

        // Get the template name without the extension
        const templateName = data.template
          .replace('.docx', '')
          .replace('.pdf', '');

        // Create a dynamic and meaningful filename
        const filename = `MergedOutput_${templateName}_${date}_${timestamp}.${fileExtension}`;

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
    form.reset({ jsonData: '', template: '' });
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className='w-9/10 space-y-6'>
        <FormField
          control={form.control}
          name='template'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Select Template</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className='flex flex-col space-y-1'>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='LMSReportLMTemplate.docx' />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      LMS Report LM Template
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='ServiceReceiptLMTemplate.docx' />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      Service Receipt LM Template
                    </FormLabel>
                  </FormItem>
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='receiptTemplate.docx' />
                    </FormControl>
                    <FormLabel className='font-normal'>
                      Invoice Receipt Template
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={!selectedTemplate} // Disable textarea if no template is selected
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
            disabled={isDocxLoading || isTextareaEmpty || !selectedTemplate}>
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
            disabled={isPdfLoading || isTextareaEmpty || !selectedTemplate}>
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