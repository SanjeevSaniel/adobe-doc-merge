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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  bio: z.string().min(10, {
    message: 'Sample JSON data is required',
  }),
});

export default function MergePage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      // Ensure the JSON data is correctly formatted
      const jsonDataForMerge = JSON.parse(data.bio);

      const response = await fetch('/api/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonDataForMerge), // Send the parsed JSON data
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Extract author and generate a descriptive and unique filename
        const { author } = jsonDataForMerge;
        const sanitizedAuthor = author.replace(/\s+/g, ''); // Remove spaces from author name
        const date = new Date().toISOString().split('T')[0];
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
        const filename = `Invoice_${sanitizedAuthor}_${date}_${timestamp}.docx`;

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
        toast({
          title: 'Error',
          description: 'Failed to merge files.',
        });
      }
    } catch (error) {
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
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-2/3 space-y-6'>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isLoading}>
          {isLoading ? <LoadingIcon /> : 'Submit'}
        </Button>
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
