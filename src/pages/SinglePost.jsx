import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function SinglePost() {
    const { id } = useParams()
    const [singlePost, setSinglePost] = useState()
    const [allPosts, setAllPosts] = useState([])
    const navigate = useNavigate()

    async function getSinglePost() {
        const res = await axios.get(`https://1to21.com/api/posts/${id}`)
        setSinglePost(res.data);
    }

    async function getAllPosts() {
        const res = await axios.get("https://1to21.com/api/posts")
        setAllPosts(res.data);
    }

    useEffect(() => {
        getAllPosts()
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        getSinglePost()
    }, [id])

    function handlePageChange(id) {
        navigate(`/post/${id}`)
        window.scrollTo(0, 0);
    }

    return (
        <div>
            <div className="mt-16 bg-gray-50">
                <div className='p-8'>
                    <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <Link to={"/"}>
                            Go Back
                        </Link>
                    </button>
                </div>
                <div className=" px-10 py-6 mx-auto">
                    <div className="max-w-6xl px-10 py-6 mx-auto bg-gray-50">
                        <div className="block">
                            {singlePost && singlePost.photo ? <img
                                className="object-cover w-full shadow-sm h-full"
                                src={singlePost.photo}
                            /> : ""}
                        </div>
                        <div className="flex items-center justify-start mt-4 mb-4">
                            {singlePost && singlePost.categories.length > 0 && singlePost.categories.map((data, index) => (
                                <a key={index} className="px-2 py-1 font-bold bg-blue-700 text-white rounded-lg hover:bg-gray-500 mr-4">{data}</a>
                            ))}
                        </div>
                        <div className="mt-2">
                            <a
                                className="sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-black-500">
                                {singlePost && singlePost.title ? singlePost.title : ''}
                            </a>
                            <div className="font-light text-gray-600">
                                <h1 className="mt-5 font-bold text-gray-700">
                                    Post By {singlePost && singlePost.email ? singlePost.email : ''}
                                </h1>
                            </div>
                        </div>
                        <div className="max-w-8xl px-10  mx-auto text-2xl text-gray-700 mt-4 rounded bg-gray-100">
                            <div>
                                {singlePost && singlePost.desc.s}
                                <p className="mt-2 p-8">
                                    {singlePost && singlePost.desc ? singlePost.desc : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 flex flex-col items-center mt-16">
                        <h2 className="mb-16 text-2xl mt-4 text-gray-500 font-bold text-center">Related Posts</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '350px 350px 350px', gap: '20px' }}>
                            {allPosts.slice(0, 3).map((post) => (
                                <div key={post._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className='cursor-pointer' onClick={() => handlePageChange(post._id)} >
                                        <img style={{ height: '250px', width: '100%', overflow: 'hidden' }}
                                            className="rounded-t-lg" src={post.photo} alt="img" />
                                    </div>
                                    <div className="p-5">
                                        <a>
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                {post.title}
                                            </h5>
                                        </a>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                            {post.desc.slice(0, 50)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SinglePost