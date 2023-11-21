// Import the 'useState' hook from React to manage state in a functional component
import { useState } from 'react';

// Import the 'supabase' client from a custom module (e.g., 'supabaseClient')
import { supabase } from './supabaseClient';

// Define the 'Auth' component
export default function Auth() {
  // State variables to manage loading state and user's email
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Function to handle user login with magic link
  const handleLogin = async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Set the loading state to true to show a loading indicator
    setLoading(true);

    // Use Supabase authentication to sign in with OTP (One-Time Password)
    const { error } = await supabase.auth.signInWithOtp({ email });

    // Check for errors during authentication
    if (error) {
      // Show an alert with the error message
      alert(error.error_description || error.message);
    } else {
      // Show an alert indicating that the magic link was sent successfully
      alert('Check your email for the login link!');
    }

    // Set the loading state back to false after the authentication attempt
    setLoading(false);
  };

  // Render the UI for the Auth component
  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in via magic link with your email below</p>
        {/* Form for user login */}
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            {/* Input field for user's email */}
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            {/* Button to trigger the login process */}
            <button className={'button block'} disabled={loading}>
              {/* Display different content based on loading state */}
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
