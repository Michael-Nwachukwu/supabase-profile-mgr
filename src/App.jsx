// Import CSS styles from the 'App.css' file
// import './App.css';

// Import React hooks and components
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Account from './Account';

// Define the 'App' component
function App() {
  // State variable to manage the user session
  const [session, setSession] = useState(null);

  // useEffect hook to fetch and update the user session
  useEffect(() => {
    // Fetch the current user session using Supabase authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Set the user session in the component state
      setSession(session);
    });

    // Subscribe to changes in the authentication state (user login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      // Update the user session in the component state on state changes
      setSession(session);
    });

    // // Cleanup function for unsubscribing from the auth state changes
    // // included the if session check because was throwing erros. so were checking if a session exists before executing
    // return () => {
    //   if(session){
    //     supabase.auth.removeAuthListener();
    //   }
    // };
  }, []); // Run the effect only once on component mount

  // Render the UI for the App component
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {/* Conditional rendering: Display Auth component if no session, otherwise display Account component */}
      {!session ? <Auth /> : <Account key={session.user.id} session={session} />}
      
    </div>
  );
}

// Export the 'App' component as the default export
export default App;
