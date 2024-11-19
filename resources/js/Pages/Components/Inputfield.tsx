import React, { useState, useRef, useEffect } from 'react';

const Inputfield = () => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div>
            <div className=''>
                <textarea
                    ref={textareaRef}
                    id="message"
                    value={message}
                    onChange={handleChange}
                    className="flex text-center p-2 w-full scrollbar-hidden text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your prompts here..."
                    style={{
                        resize: 'none',
                        width: '50%',
                        position: 'fixed',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '80px',
                        maxHeight: '200px',
                        overflowY: 'scroll',
                    }}
                ></textarea>
            </div>
        </div>
    );
};

export default Inputfield;
