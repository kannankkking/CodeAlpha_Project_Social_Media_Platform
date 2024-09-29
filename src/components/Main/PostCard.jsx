import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Avatar } from '@material-tailwind/react';
import avatar from "../../assets/images/nexus.png";
import like from "../../assets/images/like.jpg";
import comment from "../../assets/images/comment.png";
import remove from "../../assets/images/remove.png";
import { AuthContext } from '../AppContext/AppContext';
import { PostsReducer, postActions, postsStates } from '../AppContext/PostReducer';
import { doc, setDoc,updateDoc, collection, serverTimestamp, query, orderBy, onSnapshot, where, arrayUnion, getDocs, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebase';
import addFriend from "../../assets/images/addfriend.jpg";
import CommentSection from './CommentSection'; // Ensure you import your CommentSection component

const PostCard = ({ uid, id, logo, name, email, text, image, timestamp }) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const likesCollection = collection(db, "posts", id, "likes");
  const singlePostDocument = doc(db, 'posts', id);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const addUser = async () => {
    try {
      const q = query(collection(db, "users"), where('uid', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return; // No user found
      const dataRef = querySnapshot.docs[0].ref;
      await updateDoc(dataRef, {
        friends: arrayUnion({ id: uid, image: logo, name })
      });
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const q = query(likesCollection, where('id', '==', user?.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const likeDocId = querySnapshot.docs[0].id;
        await deleteDoc(doc(likesCollection, likeDocId));
      } else {
        await setDoc(doc(likesCollection, user?.uid), { id: user?.uid });
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You can't delete others' posts...");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(likesCollection, (snapshot) => {
      dispatch({
        type: ADD_LIKE,
        likes: snapshot.docs.map((doc) => doc.data())
      });
    }, (err) => {
      dispatch({ type: HANDLE_ERROR });
      alert(err.message);
      console.log(err.message);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [likesCollection, ADD_LIKE, HANDLE_ERROR]);

  return (
    <div className='mb-4'>
      <div className='flex flex-col py-4 bg-white rounded-tl-3xl'>
        <div className='flex items-center pb-4 ml-2'>
          <Avatar size='sm' variant='circular' src={user?.logo || avatar} alt='User Avatar' />
          <div className='flex flex-col'>
            <p className='ml-4 py-2 font-Merriweather font-medium text-sm text-gray-700'>
              {email}
            </p>
            <p className='ml-4 py-2 font-Merriweather font-medium text-sm text-gray-700'>
              Published: {formattedTimestamp}
            </p>
          </div>
          {user?.uid !== uid && (
            <div onClick={addUser} className='w-full flex justify-end cursor-pointer mr-10'>
              <img className='hover:bg-blue-100 rounded-xl p-2 w-14 h-14' src={addFriend} alt='Add Friend' />
            </div>
          )}
        </div>
        <div>
          <p className='ml-4 pb-4 font-Merriweather font-medium text-sm text-gray-700'>{text}</p>
          {image && <img className='h-[500px] w-full object-cover' src={image} alt='Post Image' />}
        </div>
        <div className='flex justify-around items-center pt-4'>
          <button className='flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={handleLike}>
            <img className='h-8 mr-4' src={like} alt='Like' />
            {state.likes?.length > 0 && state.likes.length}
          </button>
          <div className='flex justify-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={handleOpen}>
            <div className='flex items-center'>
              <img className='h-7 w-5' src={comment} alt='Comment' />
              <p className='font-Merriweather font-medium text-md text-gray-700'>Comments</p>
            </div>
          </div>
          <div className='flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={deletePost}>
            <img className='h-8 mr-4' src={remove} alt='Delete' />
            <p className='font-Merriweather font-medium text-md text-gray-700'>Delete</p>
          </div>
        </div>
      </div>
      {open && <CommentSection postId={id} />}
    </div>
  );
};

export default PostCard;
