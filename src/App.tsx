import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { Activity, MessageSquare } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">SMS Management System</h1>
            </div>
            {isAuthenticated && (
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">System Active</span>
              </div>
            )}
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Switch>
              <Route path="/login">
                {!isAuthenticated ? (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Redirect to="/dashboard" />
                )}
              </Route>
              <Route path="/dashboard">
                {isAuthenticated ? (
                  <Dashboard setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>
              <Redirect from="/" to="/dashboard" />
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;