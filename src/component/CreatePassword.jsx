import { useState } from 'react'
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

const CreatePassword = () => {
    const [password, setPassword] = useState(null);
    const [cpassword, setCPassword] = useState(null);

    function empyFild() {
        setCPassword("")
        setPassword("")
    }

    function setupPassword(password) {
        localStorage.setItem("login", true);
        localStorage.setItem("password", password);
        toast.success("created");
        empyFild()
        setTimeout(() => { location.reload() }, 600)
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

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <Toaster />
            <div className='w-full h-auto sm:w-5/12 p-6 bg-emerald-700 shadow-lg rounded-md'>
                <motion.h2
                    className='flex justify-center my-3 gap-3'
                >
                    <span className='text-emerald-500 text-xl'>Create lock</span>
                    <Lock className='text-emerald-500' />
                </motion.h2>
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
            </div>
        </div>
    )
}

export default CreatePassword