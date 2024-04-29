import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { AccountContext } from '@/auth/Account';
import PulseLoader from 'react-spinners/PulseLoader';
import ClipLoader from 'react-spinners/ClipLoader';

function Dashboard() {
  const { isLoggedIn, isLoading } = React.useContext(AccountContext);

  // const location = useLocation();
  // console.log(location);

  if (isLoading) {
    return (
      <ClipLoader
        speedMultiplier={0.5}
        color='#eaeaea'
        loading={isLoading}
        size={48}
        className='mt-8'
      />
    );
  } else if (isLoggedIn) {
    return <div>Dashboard</div>;
  } else {
    return <div>Not logged in</div>;
  }
}

export default Dashboard;
