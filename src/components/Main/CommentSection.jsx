import { Avatar } from '@material-tailwind/react';
import React, { useContext, useEffect, useRef, useReducer } from 'react';
import avatar from "../../assets/images/nexus.png";
import { AuthContext } from '../AppContext/AppContext';
import { addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { PostsReducer, postActions, postsStates } from '../AppContext/PostReducer';
import { serverTimestamp } from 'firebase/firestore';

const Comment = ({ postId }) => {
    const comment = useRef("");
    const { user, userData } = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostsReducer, postsStates);
    const { ADD_COMMENT, HANDLE_ERROR } = postActions;

    const addComment = async (e) => {
        e.preventDefault();
        if (comment.current.value !== "") {
            try {
                const commentRef = collection(db, 'posts', postId, "comments");
                await addDoc(commentRef, {
                    comment: comment.current.value,
                    image: user?.photoURL || avatar,
                    name: user?.displayName?.split(' ')[0] || 
                         userData?.name?.charAt(0)?.toUpperCase() + userData?.name?.slice(1),
                    timestamp: serverTimestamp(), // Use serverTimestamp for Firestore
                });
                comment.current.value = ""; // Clear the input field
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const collectionOfComments = collection(db, `posts/${postId}/comments`);
                const q = query(collectionOfComments, orderBy('timestamp', 'desc'));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    dispatch({ type: ADD_COMMENT, comments });
                });
                return () => unsubscribe(); // Cleanup on unmount
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        };
        getComments(); // Call the function
    }, [postId, ADD_COMMENT, HANDLE_ERROR]);

    return (
        <div className='flex flex-col bg-white w-full py-2 rounded-b-3xl'>
            <div className='flex items-center'>
                <div className='mx-2'>
                    <Avatar src={user?.photoURL || avatar} />
                </div>
                <div className='w-full pr-2'>
                    <form className='flex items-center w-full' onSubmit={addComment}>
                        <input 
                            name='comment' 
                            className='w-full rounded-2xl outline-none border-0 p-2 bg-gray-100'
                            placeholder='Write a comment...' 
                            ref={comment} 
                        />
                        <button className='hidden' type='submit'></button>
                    </form>
                </div>
            </div>
            {state.comments?.map((comment) => (
                <div key={comment.id} className="flex items-center">
                    <Avatar src={comment.image} />
                    <div>
                        <p className="font-bold">{comment.name}</p>
                        <p>{comment.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Comment;
