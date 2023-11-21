import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Avatar({ url, size, onUpload }) {

    // set global variables for avatarUrl which we will be using in App.jsx
    const [avatarUrl, setAvatarUrl] = useState(null)
    // loading state
    const [uploading, setUploading] = useState(false)

    // function to run anytime component mounts. In here we are calling the function that provides the image displayed on avatar.
    useEffect(() => {
        // so if a url exists, (which is being set in uploadAvatar funtion and defined in app.jsx.) download the image. 
        if (url) downloadImage(url);
    }, [url])

    // function to retrieve image from supabase storage
    async function downloadImage(path) {
        try {
            // The download function returns a signed URL that can be used to download the file.
            const { data, error } = await supabase.storage.from('avatars').download(path);
            // If the download is successful, the data object will contain the downloaded file. If there is an error, the error object will contain information about the error.
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data);
            // set avatarUrl to the retrieved image signed url
            setAvatarUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error.message);
            alert('Error downloading image: ', error.message);
        }
    }

    // function to upload avatar image to profile
    async function uploadAvatar(event) {
        try {
            // trigger loading state
            setUploading(true)

            // if input is empty, throw error
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            // save file and filename and filepath
            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // upload image and error handling
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            // if error, throw.
            if (uploadError) {
                throw uploadError
            }

            // onUpload, alias updateProfile, defined in Accounts.jsx: Function to update profile details in db
            onUpload(event, filePath);
        } catch (error) {
            alert(error.message)
        } finally {
            // trigger uploading state
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}
            <div style={{ width: size }}>
                <label className="button primary block" htmlFor="single">
                    {uploading ? 'Uploading ...' : 'Upload'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}