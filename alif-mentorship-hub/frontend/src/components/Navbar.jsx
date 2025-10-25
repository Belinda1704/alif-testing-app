import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page is a dashboard page
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/student/') || 
                         location.pathname.includes('/mentor/');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
    };

    // Initial check
    checkAuth();

    // Listen for storage changes to update auth state
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom login/logout events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginSuccess', handleStorageChange);
    window.addEventListener('logoutSuccess', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleStorageChange);
      window.removeEventListener('logoutSuccess', handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('logoutSuccess'));
    
    navigate("/");
  };

  return (
    <nav className="bg-linear-to-br from-blue-50 to-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-blue-600">Alif Mentorship Hub</h1>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          {!isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Login
              </Link>
              <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              {/* Only show sign out button on dashboard pages */}
              {isDashboardPage && (
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Sign Out
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
