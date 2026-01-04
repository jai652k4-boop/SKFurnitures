import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import { store } from './store';
import './index.css';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

// Clerk appearance customization for clean white theme
const clerkAppearance = {
    baseTheme: undefined,
    variables: {
        colorPrimary: '#667eea', // Purple accent
        colorBackground: '#ffffff', // White background
        colorText: '#000000', // Black text everywhere
        colorTextOnPrimaryBackground: '#ffffff', // White text on purple
        colorInputBackground: '#ffffff', // White input background
        colorInputText: '#000000', // Black text in inputs
        borderRadius: '0.5rem',
        fontSize: '0.9375rem',
    },
    elements: {
        formButtonPrimary: {
            backgroundColor: '#667eea',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
            '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.35)',
            }
        },
        card: {
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e9ecef',
        },
        headerTitle: {
            color: '#000000', // Black title
            fontWeight: '700',
        },
        headerSubtitle: {
            color: '#000000', // Black subtitle
        },
        socialButtonsBlockButton: {
            border: '2px solid #dee2e6',
            color: '#000000', // Black text on social buttons
            backgroundColor: '#ffffff',
            '&:hover': {
                backgroundColor: '#f8f9fa',
                borderColor: '#667eea',
            }
        },
        formFieldLabel: {
            color: '#000000', // Black labels
            fontWeight: '500',
        },
        formFieldInput: {
            borderColor: '#dee2e6',
            color: '#000000', // Black input text
            backgroundColor: '#ffffff',
            '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
            }
        },
        footerActionLink: {
            color: '#667eea',
            '&:hover': {
                color: '#5568d3',
            }
        },
        dividerLine: {
            backgroundColor: '#e9ecef',
        },
        dividerText: {
            color: '#000000', // Black "or" divider text
        },
        formFieldInputShowPasswordButton: {
            color: '#000000', // Black show/hide password icon
        },
        identityPreviewText: {
            color: '#000000', // Black identity preview
        },
        formFieldAction: {
            color: '#667eea', // Purple for "Use phone" link
        },
    },
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={clerkAppearance}
        >
            <Provider store={store}>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <App />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: 'rgba(26, 26, 46, 0.95)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }
                        }}
                    />
                </BrowserRouter>
            </Provider>
        </ClerkProvider>
    </React.StrictMode>
);
