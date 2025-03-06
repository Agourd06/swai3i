import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
                <p className="text-gray-500 mt-2 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFound; 