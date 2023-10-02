
import io from 'socket.io-client';
import "./Chat.css";
import { useState, useEffect } from 'react';

const socket = io('http://localhost:4000');


const Chat = () => 
{
    const [allMessages, setAllMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        socket.on('receive_message', (message) => {
            setAllMessages((prevMessages) => [...prevMessages, message]);

        });
        
        return () => {
            socket.off('receive_message');
        };
    }, [])

    useEffect(() => {
        console.log(allMessages);
    }, [allMessages])


    const sendMessage = () => {
        console.log(allMessages);
        if (newMessage.trim()) {
            setAllMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('send_message', newMessage);
            setNewMessage('');
        }
    }

    return (
        <div className = "chatContainer">

            <div className = "chatBox">
                {allMessages.map((msg, index) => (
                    <div key = {index}>{msg}</div>
                ))}
            </div>

            <input
                className = "message-input"
                placeholder = "send message"
                onChange = {(e) => setNewMessage(e.target.value)}
                value = {newMessage}
            
            
            />
            <button onClick = {sendMessage}>Send Message</button>
        </div>
    )

}


export default Chat