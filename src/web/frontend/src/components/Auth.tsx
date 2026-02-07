import { useFirebaseAuth } from '../hooks/useFirebase';

export function Auth() {
  const { signInWithGoogle, loading, error } = useFirebaseAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#252422] mb-2">
            Cleveland LGBTQ Center
          </h1>
          <p className="text-[#252422]/60">
            Client Automation System
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-200 text-[#252422] py-3 rounded-lg font-medium hover:border-[#E6511A] hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-[#252422]/50">
          <p>Secure, HIPAA-aware client management</p>
          <p className="mt-1">Built for the Cleveland LGBTQ Center</p>
          <p className="mt-2 text-xs">
            Sign in with your @lgbtqcleveland.org account
          </p>
        </div>
      </div>
    </div>
  );
}
