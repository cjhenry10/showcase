import { createContext, useEffect, useState } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from './UserPool';
import { toast } from 'sonner';

type AccountContextType = {
  authenticateUser: AuthenticateUser;
  getSession: GetSession;
  isLoggedIn?: boolean;
  isLoading?: boolean;
  logout: () => void;
};

type AuthenticateUser = (email: string, password: string) => Promise<any>;
type GetSession = () => Promise<any>;

const AccountContext = createContext<AccountContextType>(
  {} as AccountContextType
);

function Account(props: any) {
  async function getSession() {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err: any, session: unknown) => {
          if (err) {
            reject('error obtaining your session');
          } else {
            resolve(session);
            console.log(session);
          }
        });
      } else {
        reject('session not found, please sign in');
      }
    });
  }

  function signUp(email: string, password: string) {}

  async function authenticateUser(email: string, password: string) {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: email, Pool });

      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          toast.success('Signed in successfully', {
            classNames: {
              toast:
                'bg-background text-foreground border-neutral-800 border-[1px] shadow-lg',
            },
          });
          console.log('onSuccess:', data);
          resolve(data);
          setIsLoggedIn(true);
        },
        onFailure: (err) => {
          console.error('onFailure:', err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log('newPasswordRequired:', data);
          resolve(data);
        },
      });
    });
  }

  function logout() {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
      setIsLoggedIn(false);
      toast.success('Signed out successfully', {
        classNames: {
          toast:
            'bg-background text-foreground border-neutral-800 border-[1px] shadow-lg',
        },
      });
    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('checking session');
    getSession()
      .then(() => {
        setIsLoggedIn(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, []);

  return (
    <AccountContext.Provider
      value={{ authenticateUser, getSession, isLoggedIn, isLoading, logout }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

export { Account, AccountContext };
