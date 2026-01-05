import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Welcome <span className="gradient-text-warm">Back</span>
                    </h1>
                    <p className="text-gray-600">
                        Sign in to access your furniture collection
                    </p>
                </div>

                <SignIn
                    routing="path"
                    path="/login"
                    signUpUrl="/register"
                    afterSignInUrl="/"
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'shadow-xl',
                        }
                    }}
                />
            </div>
        </div>
    );
}
