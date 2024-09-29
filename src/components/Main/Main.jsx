import React, { useState, useRef, useContext, useReducer, useEffect } from 'react';
import avatar from "../../assets/images/nexus.png";
import { Avatar, Button, Alert } from '@material-tailwind/react';
import live from "../../assets/images/live.jpg";
import smile from "../../assets/images/smile.jpg";
import addImage from "../../assets/images/upload.jpg";
import { AuthContext } from '../AppContext/AppContext';
import { doc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../firebase/firebase';
import { PostsReducer, postActions, postsStates } from '../AppContext/PostReducer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import PostCard from './PostCard';

const Main = () => {
    const { user, userData } = useContext(AuthContext);
    const text = useRef("");
    const scrollRef = useRef(null);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const collectionRef = collection(db, "posts");
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const { SUBMIT_POST, HANDLE_ERROR } = postActions;
    const [progressBar, setProgressBar] = useState(0);

    const handleUpload = (e) => {
        e.preventDefault();
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
            if (!validTypes.includes(selectedFile.type)) {
                alert("Invalid file type.");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (text.current.value.trim() === "") {
            dispatch({ type: HANDLE_ERROR });
            alert("Post text cannot be empty.");
            return;
        }

        // If there's a file, upload the image first
        if (file) {
            await submitImage(); // Ensure the image is uploaded before submitting the post
        }

        // Make sure image is set before posting
        if (!image) {
            alert("Image upload failed. Please try again.");
            return;
        }

        try {
            const postRef = doc(collection(db, "posts"));
            const documentId = postRef.id;
            await setDoc(postRef, {
                documentId,
                uid: user?.uid || userData?.uid,
                logo: user?.photoURL || avatar,
                name: user?.displayName || userData?.name,
                email: user?.email || userData?.email,
                text: text.current.value,
                image,
                timestamp: serverTimestamp(),
            });

            // Reset form
            text.current.value = "";
            setImage(null);
            setFile(null);
            setProgressBar(0);
        } catch (err) {
            dispatch({ type: HANDLE_ERROR });
            alert(err.message);
            console.error(err.message);
        }
    };

    const storage = getStorage();
    const metadata = { contentType: "image/jpeg" };

    const submitImage = async () => {
        if (!file) return;

        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressBar(progress);
            },
            (error) => {
                alert(error.message);
                console.error("Upload error: ", error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setImage(downloadURL);
                } catch (err) {
                    dispatch({ type: HANDLE_ERROR });
                    alert(err.message);
                    console.error(err.message);
                }
            }
        );
    };

    useEffect(() => {
        const postData = async () => {
            const q = query(collectionRef, orderBy('timestamp', 'asc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                dispatch({
                    type: SUBMIT_POST,
                    posts: snapshot.docs.map((doc) => doc.data()),
                });
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            });

            return () => unsubscribe();
        };

        postData();
    }, [collectionRef, dispatch, SUBMIT_POST]);

    return (
        <div className='flex flex-col items-center relative right-24  md:left-3' >
            <div className='flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg'>
                <div className='flex items-center border-b-2 border-gray-300 pb-4 pl-3 w-full'>
                    <Avatar size="sm" variant='circular' src={user?.photoURL || avatar} />
                    <form className='w-full' onSubmit={handleSubmitPost}>
                        <div className='flex justify-between items-center'>
                            <div className='w-full ml-4'>
                                <input
                                    type='text'
                                    name='text'
                                    className='outline-none w-full bg-white rounded-md'
                                    placeholder={`What's on your mind User ${user?.displayName?.split(" ")[0] || userData?.name?.charAt(0).toUpperCase() + userData?.name?.slice(1)}`}
                                    ref={text}
                                />
                            </div>
                            <div className='mx-4'>
                                {image && <img className='h-24 rounded-xl' src={image} alt='PreviewImage' />}
                            </div>
                            <div className='cursor-pointer '>
                                <Button className='hover:bg-blue-600 ' type='submit'>Post</Button>
                            </div>
                        </div>
                    </form>
                </div>
                <span style={{ width: `${progressBar}%` }} className='bg-blue-700 py-1 rounded-md'></span>
                <div className='flex justify-around items-center pt-4'>
                    <div className='flex items-center'>
                        <label htmlFor='addImage' className='cursor-pointer flex items-center'>
                            <img className='h-10 mr-4' src={addImage} alt='addImage' />
                            <input
                                id='addImage'
                                type='file'
                                style={{ display: "none" }}
                                onChange={handleUpload}
                            />
                        </label>
                        {file && <Button variant='text' onClick={submitImage}>Upload</Button>}
                    </div>
                    <div className='flex items-center'>
                        <img className='h-10 mr-4' src={live} alt='live' />
                        <p className='font-Merriweather font-medium text-md text-gray-700 no-underline tracking-normal leading-none'>Live</p>
                    </div>
                    <div className='flex items-center'>
                        <img className='h-10 mr-4' src={smile} alt='smile' />
                        <p className='font-Merriweather font-medium text-md text-gray-700 no-underline tracking-normal leading-none'>Feeling</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col py-4 w-full'>
                {state.error ? (
                    <div className='flex justify-center items-center'>
                        <Alert color="red">
                            Something went wrong, refresh and try again...
                        </Alert>
                    </div>
                ) : (
                    <div>
                        {state.posts.length > 0 && 
                            state.posts.map((post, index) => (
                                <PostCard key={index}
                                    logo={post.logo}
                                    id={post?.documentId}
                                    uid={post?.uid}
                                    name={post.name}
                                    email={post.email}
                                    image={post.image}
                                    text={post.text}
                                    timestamp={new Date(post?.timestamp?.toDate()).toUTCString()}
                                />
                            ))}
                    </div>
                )}
            </div>
            <div ref={scrollRef}></div>
        </div>
    );
};

export default Main;
