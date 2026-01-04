import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkTokenGetter } from './api';

// Component that sets up the Clerk token getter for API calls
export default function ClerkTokenProvider({ children }) {
    const { getToken } = useAuth();

    useEffect(() => {
        setClerkTokenGetter(getToken);
    }, [getToken]);

    return children;
}
