import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

function SignUp() {
  return (
    <Card className='mx-auto w-96 mt-2'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your email and password to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='space-y-1 text-left'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' placeholder='email@example.com' />
        </div>
        <div className='space-y-1 text-left'>
          <Label htmlFor='password'>Password</Label>
          <Input type='password' id='password' />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <Button size='lg'>Sign Up</Button>
        <div className='text-sm flex flex-col pt-4'>
          Already have an account?
          <Link to='/signin'>
            <Button className='text-sm' variant={'link'}>
              Sign In
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignUp;
