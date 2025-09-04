
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";
import { Menu, X, DoorOpen } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "../component/Slider";

function Safe() {

  const navigate = useNavigate();
  const [isMenu, setIsmenu] = useState(false);
  const api = 'https://filestore-server.onrender.com/api/file/safe';

  const [isSlider, setIsSlider] = useState(false);

  const [mainIndex, setMainIndex] = useState(0);
  const [content, setContent] = useState([]);
  const [contentType, setContentType] = useState("");

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);


  useEffect(() => {
    const getData = async () => {
      await axios.get(api).then(res => {
        console.log("raw data- ", res.data.data);

        const images = res.data.data?.flatMap(data => data?.content?.filter(item => item.contentType === "image"));
        setImages(images);

        const videos = res.data.data?.flatMap(data => data?.content?.filter(item => item.contentType === "video"));
        setVideo(videos);

      })
    }
    getData();
  }, [])


  return (
    <div className="w-full h-full flex justify-between items-center relative">
      <div className={`${isMenu ? "w-full" : "w-1/12"} fixed z-50 sm:static top-0 left-0 h-full sm:w-3/12 bg-purple-700`}>
        <Toaster />
        <div className={`"w-full h-full bg-emerald-600`}>
          <div className="flex justify-end items-start p-1 text-emerald-400 sm:hidden"
            onClick={() => { setIsmenu(isMenu ? false : true); }}
          >{isMenu ? <X /> : <Menu />}</div>
          <div className={`w-full ${isMenu ? "" : "hidden"} sm:block px-2`}>
            <motion.button
              className='px-2 py-1 text-center  w-[48%] sm:w-full ring-1 ring-emerald-400 rounded-md text-emerald-200 bg-emerald-600 hover:bg-emerald-800 mt-6 mb-3 shadow-md'
              onClick={() => { navigate("/") }}
            >Exit <DoorOpen className="inline-block ml-2" size={20} /></motion.button>
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
          <Slider currentIndex={mainIndex} content={content} contentType={contentType} isSafe={true} />
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

export default Safe;
