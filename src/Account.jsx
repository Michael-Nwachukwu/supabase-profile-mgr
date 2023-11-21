// Import React hooks and the supabase client
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';

// Define the 'Account' component
export default function Account({ session }) {
  // State variables to manage loading state and user profile information
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  // useEffect hook to fetch and update user profile information
  useEffect(() => {
    // Variable to track whether the component is still mounted
    let ignore = false;

    // Function to get user profile information
    async function getProfile() {
      // Set loading state to true before fetching data
      setLoading(true);

      // Extract user information from the session
      const { user } = session;

      // Fetch user profile data from the 'profiles' table in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      // Check if the component is still mounted
      if (!ignore) {
        // Handle errors or update profile state based on fetched data
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setWebsite(data.website);
          setAvatarUrl(data.avatar_url);
        }
      }

      // Set loading state to false after data is fetched
      setLoading(false);
    }

    // Call the getProfile function
    getProfile();

    // Cleanup function to handle component unmounting
    return () => {
      ignore = true;
    };
  }, [session]); // Run the effect whenever the session changes

  // Function to update the user profile
  async function updateProfile(event, avatarUrl) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Set loading state to true before sending the update request
    setLoading(true);

    // Extract user information from the session
    const { user } = session;

    // Construct the profile update object
    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date(),
    };

    // Update the user profile data in the 'profiles' table in Supabase
    const { error } = await supabase.from('profiles').upsert(updates);

    // Handle errors or update the avatar_url state
    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }

    // Set loading state to false after the update request is complete
    setLoading(false);
  }

  // Render the UI for the Account component
  return (
    <form onSubmit={(e) => updateProfile(e, avatar_url)} className="form-widget">
        <Avatar
            url={avatar_url}
            size={150}
            onUpload={(event, url) => {
                updateProfile(event, url)
            }}
        />
        <div>
            {/* Display the user's email (read-only) */}
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div>
            {/* Input for the user's username */}
            <label htmlFor="username">Name</label>
            <input
            id="username"
            type="text"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div>
            {/* Input for the user's website */}
            <label htmlFor="website">Website</label>
            <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
            />
        </div>

        <div>
            {/* Button to update the user profile */}
            <button className="button block primary" type="submit" disabled={loading}>
            {loading ? 'Loading ...' : 'Update'}
            </button>
        </div>

        <div>
            {/* Button to sign out */}
            <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
            Sign Out
            </button>
        </div>
    </form>
  );
}
