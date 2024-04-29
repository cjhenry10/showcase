import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import React, { useState } from 'react';
import fileFormSchema from './fileFormSchema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';

function FileForm() {
  const form = useForm<z.infer<typeof fileFormSchema>>({
    resolver: zodResolver(fileFormSchema),
  });

  function onSubmit(data: z.infer<typeof fileFormSchema>) {
    console.log(data);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      form.setValue('file', e.target.files[0]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-96'>
        <FormField
          control={form.control}
          name='file'
          render={() => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                {/* <Input placeholder='shadcn' {...field} /> */}
                <Input
                  id='file-input'
                  type='file'
                  name='file'
                  accept='.zip,.txt'
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormDescription>
                This is the zip folder with your website files.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}

export default FileForm;

// temp

// const [files, setFiles] = useState<File[]>([]);

// function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//   if (e.target.files) {
//     setFiles(Array.from(e.target.files));
//   }
// }

// function removeFile(index: number) {
//   setFiles(files.filter((_file: any, i: number) => i !== index));
// }

{
  /* <div className='bg-neutral-800 p-4 rounded-lg shadow-lg w-1/3 flex flex-wrap mx-auto'>
        <Input
          className='hidden'
          id='file-input'
          type='file'
          multiple
          name='files[]'
          webkitdirectory
          onChange={handleFileChange}
        />
        <div className='flex items-center justify-between w-full'>
          <Button
            size='sm'
            variant={'secondary'}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Select files
          </Button>
          {files.length > 0 && <span>{files.length} selected</span>}
        </div>
        {files && (
          <ul className='w-full'>
            {Array.from(files).map((file, index) => (
              <li
                className='bg-neutral-700 my-1 ps-4 rounded text-start text-sm flex items-center justify-between'
                key={index}
              >
                {file.name}
                <Button
                  size='sm'
                  variant={'ghost'}
                  // className='bg-neutral-500/80'
                  onClick={() => removeFile(index)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        )}
        {files.length > 0 && (
          <Button className='ms-auto' variant={'default'}>
            Next
          </Button>
        )}
      </div> */
}
