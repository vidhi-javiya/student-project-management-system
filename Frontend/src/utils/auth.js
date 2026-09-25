// Save JWT Token, User Details, and Login Timestamp to LocalStorage
export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  // Record current time to track session duration accurately
  localStorage.setItem('loginTime', Date.now().toString());
};

// Retrieve JWT Token from LocalStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Retrieve and parse User Data from LocalStorage
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// LOGOUT: Clear storage and redirect user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  sessionStorage.clear();
  
  // Redirect to login page
  window.location.href = '/'; 
};

// Check if the session has exceeded the specified timeout limit
export const checkTokenExpiration = (navigate) => {
  const loginTime = localStorage.getItem('loginTime');
  
  if (!loginTime) {
    return false; // Return false if user is not logged in
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - parseInt(loginTime, 10);
  
  // Define session timeout threshold (e.g., 10 minutes = 10 * 60 * 1000 ms)
  const LIMIT_TIME = 10 * 60 * 1000; 

  if (elapsedTime > LIMIT_TIME) {
    // Session expired: Clear auth data and notify user
    logout();
    alert('Your session has expired! Please log in again.');
    
    if (navigate) {
      navigate('/', { replace: true });
    } else {
      window.location.href = '/';
    }
    return true; // Session expired
  }

  return false; // Session still active
};