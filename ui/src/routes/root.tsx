import React, { useEffect, useState, useContext } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AccountContext } from '@/auth/Account';

function Root() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [value, setValue] = useState('');
  const { pathname } = useLocation();

  const { isLoggedIn, logout } = useContext(AccountContext);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <NavigationMenu
        value={value}
        onValueChange={setValue}
        className='border-neutral-800 p-2 border-[1px] rounded mx-auto px-8 justify-center [&>div:first-child]:w-full'
      >
        <NavigationMenuList>
          {screenWidth > 768 ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink asChild onClick={() => setValue('')}>
                  <Link to='/dashboard'>
                    <Button variant={'outline'}>Dashboard</Button>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuTrigger className='border-[1px] border-neutral-800'>
                Menu
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuIndicator />
                <NavigationMenuList className='flex flex-col'>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild onClick={() => setValue('')}>
                      <Link to='/'>
                        <Button variant={'ghost'} className='w-36'>
                          Home
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to='/dashboard'>
                        <Button variant={'ghost'} className='w-36'>
                          Dashboard
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <NavigationMenuLink asChild onClick={() => setValue('')}>
              <Link to='/'>
                <h3 className='text-primary italic font-semibold text-3xl mx-8'>
                  S
                </h3>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {isLoggedIn && pathname !== '/signin' && pathname !== '/signup' ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger className='border-[1px] border-neutral-800'>
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuIndicator />
                <NavigationMenuList className='flex flex-col'>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild onClick={() => setValue('')}>
                      <Link to='/profile'>
                        <Button variant={'ghost'} className='w-36'>
                          Profile
                        </Button>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild onClick={() => setValue('')}>
                      <Button
                        onClick={logout}
                        variant={'ghost'}
                        className='w-36'
                      >
                        Sign Out
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to='/signin'>
                  <Button variant={'default'}>Sign In</Button>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <main className='p-1'>
        <Outlet />
      </main>
      <Toaster />
      {/* <NavigationMenu className='mx-auto'>
        <NavigationMenuList className='w-full'>
          <NavigationMenuItem className='w-full'>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent className='flex flex-col w-full'>
              <NavigationMenuLink>Link</NavigationMenuLink>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Item Three</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
    </>
  );
}

export default Root;
