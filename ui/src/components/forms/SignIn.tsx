import { AccountContext } from '@/auth/Account';
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
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { authenticateUser } = useContext(AccountContext);

  const navigate = useNavigate();

  function onSubmit() {
    authenticateUser(email, password)
      .then((data: any) => {
        console.log('Logged in!', data);
        navigate('/dashboard');
      })
      .catch((err: any) => {
        console.error('Failed to login!', err);
      });
  }
  return (
    <Card className='mx-auto w-96 mt-2'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='space-y-1 text-left'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            placeholder='email@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='space-y-1 text-left'>
          <Label htmlFor='password'>Password</Label>
          <Input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className='flex flex-col'>
        <Button size='lg' onClick={onSubmit}>
          Sign In
        </Button>
        <div className='text-sm flex flex-col pt-4'>
          Don't have an account?
          <Link to='/signup'>
            <Button className='text-sm' variant={'link'}>
              Sign Up
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignIn;
