import React, { useContext } from 'react';
import { AccountContext } from './Account';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function PrivateComponent({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useContext(AccountContext);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!isLoggedIn) {
    return (
      <div>
        <h6>You need to be signed in to view this page.</h6>
        <Link to='/signin'>
          <Button variant={'link'}>Sign In</Button>
        </Link>
      </div>
    );
  } else {
    return children;
  }
}

export default PrivateComponent;
