'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';

interface Item {
  item: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface FormData {
  author: string;
  company: {
    name: string;
    address: string;
    phoneNumber: string;
  };
  invoice: {
    date: string;
    number: number;
    items: Item[];
  };
  customer: {
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
  };
  tax: number;
  shipping: number;
  clause: {
    overseas: string;
  };
  paymentMethod: string;
}

const InvoiceForm: React.FC = () => {
  const form = useForm<FormData>({
    defaultValues: {
      author: 'Gary Lee',
      company: {
        name: 'Projected',
        address: '19718 Mandrake Way',
        phoneNumber: '+1-100000098',
      },
      invoice: {
        date: 'January 15, 2021',
        number: 123,
        items: [
          {
            item: 'Gloves',
            description: 'Microwave gloves',
            unitPrice: 5,
            quantity: 2,
            total: 10,
          },
          {
            item: 'Bowls',
            description: 'Microwave bowls',
            unitPrice: 10,
            quantity: 2,
            total: 20,
          },
        ],
      },
      customer: {
        name: 'Collins Candy',
        address: '315 Dunning Way',
        phoneNumber: '+1-200000046',
        email: 'cc@abcdef.co.dw',
      },
      tax: 5,
      shipping: 5,
      clause: {
        overseas: 'The shipment might take 5-10 more than informed.',
      },
      paymentMethod: 'Cash',
    },
  });

  // const { setValue, watch } = form;

  // Watch changes in form values
  // const watchFormData = watch();

  // const handleItemChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number,
  //   field: keyof Item,
  // ) => {
  //   const value =
  //     field === 'unitPrice' || field === 'quantity' || field === 'total'
  //       ? parseFloat(e.target.value) // Ensure numeric fields are parsed correctly
  //       : e.target.value;

  //   const newItems = [...watchFormData.invoice.items];
  //   newItems[index] = { ...newItems[index], [field]: value } as Item; // Type assertion
  //   setValue('invoice.items', newItems);
  // };

  const onSubmit = (data: FormData) => {
    alert('Form submitted successfully!\n' + JSON.stringify(data, null, 2));
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col p-2 w-full gap-4'>
        <div className='grid grid-cols-3 gap-2 w-full p-4 border-2'>
          <FormField
            control={form.control}
            name='author'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Author'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='p-4 border-2 rounded-lg'>
          <h2 className='text-md font-semibold underline'>Company Details</h2>
          <div className='grid grid-cols-3 gap-2 w-full'>
            <FormField
              control={form.control}
              name='company.name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Company Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='company.address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Address'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='company.phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+1-100000098'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='p-4 border-2 rounded-lg'>
          <h2 className='text-md font-semibold underline'>Invoice</h2>
          <div className='flex flex-col gap-2 w-full'>
            <div className='grid grid-cols-3 gap-2 w-full'>
              <FormField
                control={form.control}
                name='invoice.date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Date'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='invoice.number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Number'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.getValues('invoice.items').map((item, index) => (
              <div
                key={index}
                className='w-full p-2 border-2'>
                <h2>Item {index + 1}</h2>
                <div className='grid grid-cols-3 gap-2'>
                  <FormField
                    key={index}
                    name={`invoice.items.${index}.item`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='+1-100000098'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={index}
                    name={`invoice.items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='+1-100000098'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={index}
                    name={`invoice.items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='+1-100000098'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={index}
                    name={`invoice.items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='+1-100000098'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    key={index}
                    name={`invoice.items.${index}.total`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='+1-100000098'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='p-4 border-2 rounded-lg'>
          <h2 className='text-md font-semibold underline'>Customer Details</h2>
          <div className='grid grid-cols-3 gap-2 w-full'>
            <FormField
              control={form.control}
              name='customer.name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='customer.address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Address'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='company.phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='+1-100000098'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='company.email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='sample@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='p-4 border-2 rounded-lg'>
          <h2 className='text-md font-semibold underline'>Other Details</h2>
          <div className='grid grid-cols-3 gap-2 w-full'>
            <FormField
              control={form.control}
              name='tax'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Tax'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='shipping'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Shipping'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='clause.overseas'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overseas Clause</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='XYZ'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='paymentMethod'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Cash'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex justify-center'>
          <Button
            type='submit'
            className='w-fit'>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
