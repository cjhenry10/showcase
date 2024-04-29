import { z } from 'zod';

//max file size constant of 512kb
const MAX_FILE_SIZE = 512000;

function checkFileType(file: File) {
  console.log(typeof file);
  console.log(file);
  const validTypes = [
    'image/jpeg',
    'image/png',
    'text/html',
    'text/css',
    'text/javascript',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
  ];
  return validTypes.includes(file.type);
}

const fileFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => checkFileType(file), 'Invalid file type')
    .refine(
      (file: File | undefined) => file !== undefined && file.size > 0,
      'File is required'
    )
    .refine(
      (file) => file.size < MAX_FILE_SIZE,
      'File size is too large, max is 512KB.'
    ),
});

export default fileFormSchema;
