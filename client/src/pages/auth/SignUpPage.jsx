import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <SignUp
                    routing="path"
                    path="/register"
                    signInUrl="/login"
                    afterSignUpUrl="/"
                    appearance={{
                        elements: {
                            rootBox: 'mx-auto',
                            card: 'bg-white border border-gray-200 shadow-xl',
                            headerTitle: 'text-black',
                            headerSubtitle: 'text-black',
                            socialButtonsBlockButton: 'bg-white border-gray-300 text-black hover:bg-gray-50',
                            dividerLine: 'bg-gray-300',
                            dividerText: 'text-black',
                            formFieldLabel: 'text-black',
                            formFieldInput: 'bg-white border-gray-300 text-black placeholder:text-gray-500',
                            formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
                            footerActionLink: 'text-purple-600 hover:text-purple-700',
                            identityPreviewText: 'text-black',
                            identityPreviewEditButton: 'text-purple-600',
                            // Hide phone number field
                            formField__phoneNumber: 'hidden',
                            phoneInputBox: 'hidden',
                        }
                    }}
                />
            </div>
        </div>
    );
}
