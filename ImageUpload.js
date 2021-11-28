import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from './firebase.js';
import firebase from "firebase";
import './ImageUpload.css';
function ImageUpload({username}) {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //function for progress of upload ...
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // this is the final part, where upload is complete
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post the image which is inside of the db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    };
    return (
        <div className="imageupload">
        {/* We want to be able to */}
        {/* Caption input */}
        {/* File input */}
        {/* POST/SUBMIT button */}

        <progress className="imageUpload__progress" value={progress} max="100" />
        <input type="text" placeholder='Enter a Caption ...' onChange={ event => setCaption(event.target.value)} value={caption}/>
        <input type="file" onChange={handleChange}/>
        <Button onClick={handleUpload}>
            Upload
        </Button>
        </div>

    )
}

export default ImageUpload
