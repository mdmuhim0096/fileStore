
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";
import { Menu, X, LogOut, RotateCcw, UploadCloud, File, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../component/Slider";

function Home() {

    const navigate = useNavigate();
    const [isMenu, setIsmenu] = useState(false);
    const api = 'https://filestore-server.onrender.com/api/file/';
    const [isUploading, setIsUploading] = useState(false);
    const [isSafe, setIsSafe] = useState(false);
    const [files, setFiles] = useState([]);

    const [password, setPassword] = useState(null);
    const [cpassword, setCPassword] = useState(null);
    const [safeKey, setSafeKy] = useState(null);
    const [isSlider, setIsSlider] = useState(false);

    const [mainIndex, setMainIndex] = useState(0);
    const [content, setContent] = useState([]);
    const [contentType, setContentType] = useState("");

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState([]);


    useEffect(() => {
        const getData = async () => {
            await axios.get(api).then(res => {

                const images = res.data?.flatMap(data => data?.content?.filter(item => item.contentType === "image"));
                setImages(images);

                const videos = res.data?.flatMap(data => data?.content?.filter(item => item.contentType === "video"));
                setVideo(videos);

            })
        }
        getData();
    }, [isUploading, isSlider])


    function handelLogut() {
        localStorage.setItem("login", false);
        toast.success("logout");
        setTimeout(() => { navigate("/login") }, 600)
    }

    function handelRsetPassword() {
        localStorage.clear();
        toast.success("reset mode");
        setTimeout(() => { navigate("/create-password") }, 600)
    }

    function uploadHandler(file) {
        const extchunk = file?.name.split(".") || [];
        const extname = extchunk[extchunk?.length - 1];

        const resourceType = extname == "svg" || extname == "png" || extname == "jpg" || extname == "jpeg" || extname == "avif" || extname == "webp" ? "image" :
            extname == "mp4" || extname == "fiv" || extname == "mkv" || extname == "mov" || extname == "" ? "video" : "auto";

        const formData = new FormData();
        formData.append("files", file); // must be a single File
        formData.append("resourceType", resourceType)
        setIsUploading(true)
        axios.post("https://filestore-server.onrender.com/api/file/uploads", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                setIsUploading(false);
                while (files.length > 0) {
                    files.pop();
                }
            })
            .catch(err => {
                console.error("Upload error:", err);
                toast.error("Upload failed");
            });
    }

    function removeFile(index) {
        setFiles(prev => prev?.filter((_, i) => i !== index));
    }

    function uploadFile() {
        files.forEach(file => { uploadHandler(file) });
    }

    function empyFild() {
        setCPassword("");
        setPassword("");
        setSafeKy("");
    }

    function setupPassword(password) {

        localStorage.setItem("isFirst", false);
        localStorage.setItem("safekey", password);
        toast.success("created");
        empyFild()
        setTimeout(() => { navigate("/") }, 600)
    }

    function handelPassword() {
        if (password && cpassword && password === cpassword) {
            setupPassword(password);
            empyFild()
        } else {
            toast.error("worng password");
            empyFild()
        }
    }

    function handelSafeFile() {
        const preSafeKey = localStorage.getItem("safekey");
        if (safeKey === preSafeKey && preSafeKey) {
            navigate("/safe")
        } else {
            toast.error("worng key");
        }
    }

    const isFirstInSafeFolder = localStorage.getItem("isFirst") ? false : true;

    return (
        <div className="w-full h-full flex justify-between items-center relative">
            <div className={`${isMenu ? "w-full" : "w-1/12"} fixed z-50 sm:static top-0 left-0 h-full sm:w-3/12 bg-purple-700`}>
                <Toaster />
                <div className={`"w-full h-full bg-emerald-600`}>
                    <div className="flex justify-end items-start p-1 text-emerald-400 sm:hidden"
                        onClick={() => {
                            setIsmenu(isMenu ? false : true);
                            setIsSafe(false);
                            while (files.length > 0) {
                                files.pop();
                            }
                        }}
                    >{isMenu ? <X /> : <Menu />}</div>
                    <div className={`w-full ${isMenu ? "" : "hidden"} sm:block px-2`}>

                        <div className="flex justify-center flex-wrap gap-2 sm:flex-col">
                            <motion.button
                                className='px-2 py-1 text-center  w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                onClick={() => { handelLogut() }}
                            >Logout <LogOut className="inline-block ml-2" size={20} /></motion.button>
                            <motion.button
                                className='px-2 py-1 text-center  w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                onClick={() => { handelRsetPassword() }}
                            >Rest Pin<RotateCcw className="inline-block ml-2" size={20} /></motion.button>

                            <motion.button
                                className='px-2 py-1 text-center w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md relative'
                                onClick={() => { setIsSafe(false) }}
                            >
                                Select file
                                <UploadCloud className="inline-block ml-2" size={20} />
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                        const selectedFiles = Array.from(e.target.files);
                                        setFiles((prev) => [...prev, ...selectedFiles]);
                                    }}
                                    className="absolute top-0 left-0 w-full opacity-0"
                                />

                            </motion.button>

                            <motion.button
                                className='px-2 py-1 text-center  w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                onClick={() => {
                                    setIsSafe(isSafe ? false : true);
                                    while (files.length > 0) {
                                        files.pop();
                                    }
                                }}
                            >Safe file<File className="inline-block ml-2" size={20} /></motion.button>

                            <div className={`w-full h-auto max-h-[62vh] sm:h-[45vh] overflow-y-auto overflow-x-hidden flex flex-col justify-center items-center ${files.length >= 1 ? "" : "hidden"}  bg-emerald-700 rounded-md`}>

                                <h1 className="text-emerald-300 ">{isUploading ? files.length + " Uploading..." : ""}</h1>
                                <div className="w-full h-full flex flex-wrap rounded-t-xl overflow-x-hidden overflow-y-auto gap-2 p-2">

                                    {files.map((file, index) => {
                                        const url = URL.createObjectURL(file);
                                        return (
                                            <div key={index} className="w-[22.5%] h-16 sm:w-[31%] md:w-[47%] sm:h-20 shadow-lg bg-emerald-800 relative">
                                                {file.type.startsWith("image/") && (
                                                    <img src={url} className="w-full h-full object-fill rounded-md " />
                                                )}
                                                {file.type.startsWith("video/") && (
                                                    <video src={url} width="150" className="w-full h-full object-fill rounded-md " autoPlay muted />
                                                )}
                                                {file.type.startsWith("audio/") && (
                                                    <audio src={url} className="w-full h-full" />
                                                )}

                                                {!file.type.startsWith("image/") &&
                                                    !file.type.startsWith("video/") &&
                                                    !file.type.startsWith("audio/") && (
                                                        <p>📄 {file.name}</p>
                                                    )}
                                                <X
                                                    onClick={() => { removeFile(index) }}
                                                    className="absolute top-0 left-0 text-orange-500 cursor-pointer text-sm"
                                                />
                                            </div>
                                        );
                                    })}

                                </div>
                                <motion.button
                                    className='px-2 my-2 text-center w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 shadow-md relative'
                                    onClick={() => { uploadFile(); }}
                                >
                                    Upload
                                    <UploadCloud className="inline-block ml-2" size={20} />
                                </motion.button>
                            </div>

                            <div className={`w-full h-[60vh] sm:h-[45vh] bg-emerald-700 rounded-md overflow-y-auto overflow-x-hidden ${isSafe ? "" : "hidden"}`}>
                                {isFirstInSafeFolder ? <div className="px-3">
                                    <h3 className="flex items-center gap-3 capitalize justify-center my-7 text-emerald-300"><span>set lock</span> <Lock size={16} className="inline-block" /></h3>
                                    <div className='w-full h-auto flex items-center ring-1 ring-emerald-400 rounded-md p-1 gap-2 text-white my-4 shadow-md'>
                                        <Lock className='text-emerald-400' />
                                        <input
                                            type="password"
                                            placeholder='Password'
                                            className='focus:outline-none bg-transparent placeholder:text-emerald-400 w-full'
                                            value={password || ""}
                                            onChange={(e) => { setPassword(e.target.value) }}
                                        />
                                    </div>
                                    <div className='w-full h-auto flex items-center ring-1 ring-emerald-400 rounded-md p-1 gap-2 text-white my-4 shadow-md'>
                                        <Lock className='text-emerald-400' />
                                        <input
                                            type="password"
                                            placeholder='Confirm Password'
                                            className='focus:outline-none bg-transparent placeholder:text-emerald-400 w-full'
                                            value={cpassword || ""}
                                            onChange={(e) => { setCPassword(e.target.value) }}
                                        />
                                    </div>
                                    <motion.button
                                        className='px-2 py-1 text-center w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                        onClick={() => { handelPassword() }}
                                    >Set password</motion.button>
                                </div> :
                                    <div className="flex flex-col justify-center items-center px-4 pt-7">
                                        <h1 className="my-2 text-emerald-300 capitalize">write code to access file</h1>
                                        <div className='w-full h-auto flex items-center ring-1 ring-emerald-400 rounded-md p-1 gap-2 text-white mt-5 shadow-md'>
                                            <Lock className='text-emerald-400' />
                                            <input
                                                type="password"
                                                placeholder='password'
                                                className='focus:outline-none bg-transparent placeholder:text-emerald-400 w-full'
                                                value={safeKey || ""}
                                                onChange={(e) => { setSafeKy(e.target.value) }}
                                            />
                                        </div>
                                        <motion.button
                                            className='px-2 py-1 text-center w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                            onClick={() => { handelSafeFile() }}
                                        >unlock</motion.button>
                                        <motion.button
                                            className='px-2 py-1 text-center w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
                                            onClick={() => { setIsSafe(false) }}
                                        >cancle</motion.button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 h-screen ml-6 sm:m-0 pl-[3.7%] sm:px-3 relative">
                <div className={`w-full h-full fixed sm:absolute top-0 left-0 z-50 bg-cyan-950 ${isSlider ? "" : "hidden"}`}>
                    <div
                        className="absolute top-[3%] left-[2%] text-white z-40 cursor-pointer"
                        onClick={() => { setIsSlider(false) }}
                    >
                        <X />
                    </div>
                    <Slider currentIndex={mainIndex} content={content} contentType={contentType} />
                </div>
                <div>
                    <div className="w-full h-screen overflow-y-auto overflow-x-hidden flex flex-wrap gap-1 pb-11">
                        <h4 className={`w-full flex justify-between text-sm sticky top-0 px-2 pb-1 left-0 z-10 bg-emerald-500 text-emerald-300 rounded-md ${isMenu ? "hidden" : ""}`}>
                            <span>images</span>
                            <span>{images.length}</span>
                        </h4>
                        {images.map((data, index) => (
                            <motion.div
                                key={index}
                                className="w-[23%] h-[12%] md:w-[19%] md:h-[15%] lg:h-[20%] lg:w-[16%] flex justify-center items-center"
                                initial={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.1, delay: 0.01 * index }}
                                whileInView={{ opacity: 1, x: 0 }}
                                onClick={() => {
                                    setIsSlider(true);
                                    setMainIndex(index);
                                    setContent(images);
                                    setContentType("image")
                                }}
                            >
                                <img
                                    src={data.file}
                                    className='w-full h-full rounded-md bg-black/50'
                                />
                            </motion.div>
                        ))}
                        <h4 className={`w-full flex items-center justify-between text-sm sticky top-0 px-2 pb-1 left-0 z-10 bg-emerald-500 text-emerald-300 rounded-md ${isMenu ? "hidden" : ""}`}>
                            <span>Video</span>
                            <span>{video.length}</span>
                        </h4>
                        {video.map((data, index) => (
                            <motion.div
                                key={index}
                                className="w-[23%] h-[12%] md:w-[19%] md:h-[15%] lg:h-[20%] lg:w-[16%] bg-emerald-400 rounded-md flex justify-center items-center"
                                initial={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.1, delay: 0.01 * index }}
                                whileInView={{ opacity: 1, x: 0 }}
                                onClick={() => {
                                    setIsSlider(true);
                                    setMainIndex(index);
                                    setContent(video);
                                    setContentType("video")
                                }}
                            >
                                <video src={data.file} playsInline muted></video>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home
