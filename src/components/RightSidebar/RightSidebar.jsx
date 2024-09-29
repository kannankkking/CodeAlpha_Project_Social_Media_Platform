import React, { useState, useContext } from 'react';
import waterslide from "../../assets/images/waterslide.jpg";
import { AuthContext } from '../AppContext/AppContext';
import { Link } from 'react-router-dom';
import { Avatar } from '@material-tailwind/react';
import avatar from "../../assets/images/nexus.png";
import remove from "../../assets/images/remove.png";
import { collection, doc, query, where, updateDoc, getDocs } from "firebase/firestore"; // Ensure you're importing correctly
import { arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const RightSidebar = () => {
    const [input, setInput] = useState("");
    const { user, userData } = useContext(AuthContext);
    const friendList = userData?.friends || []; // Default to an empty array if undefined

    const searchFriends = (data) => {
        return data.filter((item) => 
            item.name.toLowerCase().includes(input.toLowerCase())
        );
    };

    const removeFriend = async (id, name, image) => {
        try {
            const q = query(collection(db, 'users'), where("uid", "==", user?.uid));
            const getDoc = await getDocs(q);

            if (getDoc.empty) {
                console.error("No user document found.");
                return;
            }

            const userDocumentId = getDoc.docs[0].id;

            await updateDoc(doc(db, 'users', userDocumentId), {
                friends: arrayRemove({ id, name, image })
            });
        } catch (error) {
            console.error("Error removing friend: ", error);
        }
    };

    return (
        <div className='flex flex-col h-screen w-80 right-0  bg-white shadow-lg border-1 rounded-l-xl'>
            <div className='flex flex-col items-center relative pt-10'>
                <img className='h-32 w-44 rounded-md' src={waterslide} alt='Waterslide in nature' />
            </div>
            <p className='font-Merriweather font-normal text-sm text-gray-700 max-w-fit no-underline tracking-normal leading-tight py-2 mx-2'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat explicabo ducimus voluptatum cum ex excepturi quo magni neque sit nisi.
            </p>
            <div className='mx-2'>
                <p className='font-Merriweather font-medium text-sm text-gray-700 no-underline tracking-normal leading-none'>
                    Friends:
                </p>
                <input 
                    className='border-0 outline-none mt-4' 
                    type='text' 
                    placeholder='Search friends' 
                    onChange={(e) => setInput(e.target.value)} 
                />
                {friendList.length > 0 ? (
                    searchFriends(friendList).map((friend) => (
                        <div className='flex items-center justify-between hover:bg-gray-100 duration-300 ease-out' key={friend.id}>
                            <Link to={`/profile/${friend.id}`}>
                                <div className='flex items-center my-2 cursor-pointer'>
                                    <Avatar size='sm' variant='circular' src={friend.image || avatar} alt={`${friend.name}'s avatar`} />
                                    <p className='ml-4 font-Merriweather font-medium text-sm text-gray-700 no-underline tracking-normal leading-none'>
                                        {friend.name}
                                    </p>
                                </div>
                            </Link>
                            <div className='mr-4'>
                                <img 
                                    onClick={() => removeFriend(friend.id, friend.name, friend.image)}  
                                    className='cursor-pointer w-10 h-10' 
                                    src={remove} 
                                    alt='Remove friend' 
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='ml-10 font-Merriweather font-medium text-sm text-gray-700 no-underline tracking-normal leading-none'>
                        Add Friends to check their profiles
                    </p>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;
