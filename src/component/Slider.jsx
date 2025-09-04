import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast"
import { ChevronLeft, ChevronRight, Trash, DownloadCloud, Lock, LockOpen } from 'lucide-react';
import axios from 'axios';

const Slider = ({ content, currentIndex, contentType = "image", isSafe = false }) => {

  const api = 'https://filestore-server.onrender.com/api/file/';
  const [_index, setIndex] = useState(currentIndex);
  const dateTime = new Date();
  const date = dateTime.toDateString().split(" ").join("-") + "-" + dateTime.getHours() + dateTime.getMinutes() + dateTime.getSeconds();
  console.log(content);
  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex])

  async function handleDownload(fileUrl) {
    try {
      // Fetch the file as a blob
      const response = await axios.get(fileUrl, { responseType: "blob" });
      // Create a temporary download link
      const extchunk = fileUrl?.split(".") || [];
      const extname = extchunk[extchunk?.length - 1];
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = date + "." + extname || "download"; // fallback filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  async function deleteFile(id, publicId, resource_type) {
    axios.post(`https://filestore-server.onrender.com/api/file/delete`, { id, publicId, resource_type, isSafe }).then(res => {
      toast.success(res.data.message);
    })
  }

  async function handelSafeFolder(id) {
    axios.post(api + "safe", { id }).then(res => {
      toast.success(res.data.message);
      setIndex(prev => prev + 1);
    })
  }

  async function handelUnSafeFolder(id) {
    axios.post(api + "unsafe", { id }).then(res => {
      toast.success(res.data.message);
      setIndex(prev => prev + 1);
    })
  }

  return (
    <div className='w-full h-full flex justify-between items-center relative px-4'>
      <Toaster />
      <div className='relative z-10 p-1 text-white border rounded-full cursor-pointer'
        onClick={() => {
          if (_index > 0) {
            setIndex(prev => prev - 1);
          }
        }}
      >
        <ChevronLeft />
      </div>
      <div className='w-full h-full absolute left-0 top-0'>
        <header className='w-full flex justify-center gap-7 my-3 text-white absolute left-1 top-0 z-20'>
          <Trash
            className='cursor-pointer'
            onClick={() => {
              deleteFile(content[_index]?._id, content[_index]?.publicId, content[_index]?.resource_type);
            }}
          />

          <DownloadCloud
            className='cursor-pointer'
            onClick={() => { handleDownload(content[_index]?.file) }}
          />

          {
            isSafe ? <LockOpen
              className='cursor-pointer'
              onClick={() => { handelUnSafeFolder(content[_index]?._id) }}
            /> :
              <Lock
                className='cursor-pointer'
                onClick={() => { handelSafeFolder(content[_index]?._id) }}
              />
          }
          <h1 className='px-1 rounded-full bg-purple-600 text-white'>{_index + 1 + "/" + content.length}</h1>
        </header>
        <div className='w-full h-full flex justify-center items-center'>
          {contentType === "image" ? <img
            src={content[_index]?.file}
            className='w-full h-[70%]'
          /> : <video
            src={content[_index]?.file}
            autoPlay
            controls
            loop
            playsInline
            className='w-full h-[70%] object-fill'
          />}
        </div>
      </div>
      <div
        className='relative z-10 p-1 text-white border rounded-full cursor-pointer'
        onClick={() => {
          if (_index < content.length - 1) {
            setIndex(prev => prev + 1);
          }
        }}
      >
        <ChevronRight />
      </div>
    </div>
  )

}

export default Slider;