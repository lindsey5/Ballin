import { IconButton } from "@mui/material";
import { useState, useRef, useEffect } from "react"
import { postData } from "../services/api";

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const bottomRef = useRef(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([ { from: 'bot', content: 'Hi, Welcome to Ballin how can I help?' } ] );

    const submitMessage = async (e) => {
        e.preventDefault()
        setMessage('');
        if(message){
            setLoading(true)
            setMessages(prev => [...prev, { from: 'user', content: message }])
            const response = await postData(`/api/agent/chat`, { message: message });
            if(response.success){
                setMessages(prev => [...prev, { from: 'bot', content: response.response }])
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        if (bottomRef.current && messages.length > 0) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages]);


    return (
        <div className="fixed right-5 bottom-5">
            <button className="cursor-pointer hover:opacity-75 shadow-lg p-3 bg-white border border-gray-300 rounded-full" onClick={() => setOpen(!open)}>
                <img className="w-8 h-8 md:w-10 md:h-10" src="/speech-bubble.png" alt="" />
            </button>
            {open && <form className="bg-white absolute z-99 flex flex-col animate-fade-in-scale border border-gray-300 rounded-xl w-[90vw] h-[70vh] sm:w-[400px] bottom-[calc(100%+10px)] right-1 sm:bottom-[calc(100%+20px)] sm:right-3" onSubmit={submitMessage}>
                <div className="rounded-t-xl py-5 px-3 border-b-2 border-b-gray-300">
                    <img className="w-30 md:h-15" src="/logo.png"/>
                </div>
                <div className="bg-white p-3 flex-grow overflow-y-auto">
                    {messages.map((message, index) => (
                        <div  
                            ref={index === messages.length -1 ? bottomRef : undefined}  
                            className={`my-3 flex ${message.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                        >
                            <div className="flex gap-2 text-sm">
                                {message.from === 'bot' && <img className="min-w-12 min-h-12 w-12 h-12 rounded-full" src="/ali.png"/>}
                                <div
                                    className={`whitespace-pre-line py-3 px-5 rounded-lg bg-gray-100 border border-gray-300 ${
                                        message.from === 'bot'
                                        ? 'border-l-5 border-l-purple-500'
                                        : 'border-r-5 border-r-purple-500'
                                    }`}
                                >
                                {message.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="flex gap-2 text-sm">
                                <img className="w-12 h-12 rounded-full" src="/ali.png"/>
                                <div className="border-l-5 border-l-purple-500 whitespace-pre-line py-3 px-5 rounded-lg bg-gray-100 border border-gray-300">
                                Typing...
                                </div>
                            </div>}
                </div>
                <div className="flex gap-3 px-2 py-5 border-t border-gray-300 rounded-b-xl">
                    <input 
                        placeholder="Type Message..."
                        className="text-sm md:text-md flex-1 rounded-lg border border-gray-400 px-3 py-1"
                        type="text"
                        onChange={(e) => setMessage(e.target.value)} 
                        value={message}
                    />
                    <IconButton type="submit">
                        <img className="w-6 h-6" src="/send.png" alt="send"/>
                    </IconButton>
                </div>
            </form>}

        </div>
    )
}

export default Chatbot