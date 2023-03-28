import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { authContext } from "../context/authContext"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

function Profile() {
    const { tokenDetails, logout } = useContext(authContext)
    const headers = {
        token: `Bearer ${tokenDetails.accessToken}`
    }
    const navigate = useNavigate()
    const [allMyPosts, setAllMyPosts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editModalShow, setEditModalShow] = useState(false)
    const [cat, setCat] = useState(["Tech"])
    const [currentEditPost, setCurrentEditPost] = useState({})
    const [createPostDetails, setCreatePostDetails] = useState({
        title: "",
        desc: "",
        email: tokenDetails.email,
        photo: "",
        categories: cat
    })
    const [editPostData, setEditPost] = useState({
        title: "",
        desc: "",
        email: tokenDetails.email,
        photo: "",
        categories: cat
    })
    
    console.log(editPostData);

    function editPostHandle(e) {
        setEditPost({
            ...editPostData,
            [e.target.name]: e.target.value
        })
    }

    async function getAllMyPosts() {
        if (tokenDetails && tokenDetails.email) {
            const res = await axios.get(`https://1to21.com/api/posts?email=${tokenDetails.email}`)
            setAllMyPosts(res.data);
        }
    }

    async function createMyPost() {
        const res = await axios.post(`https://1to21.com/api/posts`, createPostDetails, {
            headers: headers
        })
        if (res.data.success) {
            setShowModal(false)
            getAllMyPosts()
            toast.success('Post Successfully Created !', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    useEffect(() => {
        getAllMyPosts()
        setCreatePostDetails({
            ...createPostDetails,
            email: tokenDetails.email
        })
    }, [tokenDetails])

    function handleSubmitPost(e) {
        e.preventDefault()
        createMyPost()
    }

    async function handleSubmitEditPost() {
        const res = await axios.put(`https://1to21.com/api/posts/${id}`, editPostData, {
            headers: headers
        })
        if (res.data.success) {
            setEditModalShow(false)
            getAllMyPosts()
            toast.success('Post Successfully Edited !', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    function handlePostDetails(e) {
        setCreatePostDetails({
            ...createPostDetails,
            [e.target.name]: e.target.value
        })
    }

    async function handleDelete(id) {
        const res = await axios.delete(`https://1to21.com/api/posts/${id}`, {
            headers: {
                token: `Bearer ${tokenDetails.accessToken}`
            },
            data: {
                email: tokenDetails.email
            }
        })
        if (res.data.success) {
            getAllMyPosts()
            toast.success('Post Successfully Deleted !', {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    async function handleEdit(id) {
        const res = await axios.get(`https://1to21.com/api/posts/${id}`)
        setEditModalShow(true)
        setCurrentEditPost(res.data)
    }

    function handleLogout() {
        logout()
    }

    useEffect(() => {
        setEditPost({
            ...editPostData,
            title: currentEditPost.title,
            desc: currentEditPost.desc,
            photo: currentEditPost.photo,
            email: tokenDetails.email
        });
    }, [currentEditPost])

    return (
        <>
            <div className="flex mt-24 p-8">
                <div>
                    <div style={{ maxHeight: '200px', minWidth: '300px' }} className="max-w-sm p-6 pr-16 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                            My Profile
                        </h5>
                        <h5 className="mb-2 text-medium font-semibold tracking-tight text-gray-900 dark:text-white">
                            {tokenDetails.name}
                        </h5>
                        <h5 className="mb-2 text-medium font-semibold tracking-tight text-gray-900 dark:text-white">
                            {tokenDetails.email}
                        </h5>
                        <button
                            onClick={handleLogout}
                            className="mt-5 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Logout
                        </button>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-8 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Create Post
                    </button>
                </div>

                <div className="p-6">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        My Posts
                    </h5>
                    <div className="flex flex-col items-center mt-8">
                        <div style={{ display: 'grid', gridTemplateColumns: '350px 350px 350px', gap: '20px' }}>
                            {allMyPosts.map((post) => (
                                <div key={post._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <Link to={`/post/${post._id}`}>
                                        <img style={{ height: '250px' }} className="rounded-t-lg" src={post.photo} alt="img" />
                                    </Link>
                                    <div className="p-5">
                                        <a href="#">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                {post.title}
                                            </h5>
                                        </a>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                            {post.desc.slice(0, 50)}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleEdit(post._id)}
                                            className="ml-5 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mb-6">
                                    <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                                    <input name="title" onChange={handlePostDetails} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="Description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <textarea name="desc" onChange={handlePostDetails} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Post Details..."></textarea>
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image Link</label>
                                    <input name="photo" onChange={handlePostDetails} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    onClick={handleSubmitPost}
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
                                    Create Post
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            {editModalShow && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="mb-6">
                                    <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Post Title</label>
                                    <input name="title" value={editPostData.title} onChange={editPostHandle} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="Description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <textarea name="desc" value={editPostData.desc} onChange={editPostHandle} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Post Details..."></textarea>
                                </div>
                                <div className="mt-6">
                                    <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image Link</label>
                                    <input value={editPostData.photo} name="photo" onChange={editPostHandle} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    onClick={() => handleSubmitEditPost(editPostData._id)}
                                    type="button"
                                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default Profile