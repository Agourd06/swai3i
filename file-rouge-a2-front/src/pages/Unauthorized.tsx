import { useNavigate, useLocation } from 'react-router-dom';

interface LocationState {
    from: {
        pathname: string;
    };
}

export default function Unauthorized() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as LocationState)?.from?.pathname || '/';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <h1 className="text-4xl font-bold text-red-600">Unauthorized Access</h1>
                <p className="mt-2 text-gray-600">
                    You don't have permission to access this page.
                </p>
                <div className="mt-4">
                    <button
                        onClick={() => navigate(from, { replace: true })}
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        Go back
                    </button>
                </div>
            </div>
        </div>
    );
} 