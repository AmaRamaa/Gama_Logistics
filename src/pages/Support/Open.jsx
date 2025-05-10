import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../supaBase/supaBase';

const fetchMessages = async () => {
    const { data, error } = await supabase
        .from('Support Tickets')
        .select('*')
        .orderBy('created_at', { ascending: true });

    if (error) throw new Error('Error fetching messages');
    return data.map(ticket => ({
        id: ticket.id,
        sender: ticket.user_id === 1 ? 'User' : 'Support',
        text: ticket.description,
    }));
};

const TicketSystem = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        const fetchMessagesData = async () => {
            try {
                const data = await fetchMessages();
                setMessages(data);
            } catch (err) {
                setError(err);
            }
        };

        fetchMessagesData();
    }, []);

    // const sendMessageMutation = useMutation(
    //     async (newMessage) => {
    //         const { error } = await supabase
    //             .from('Support Tickets')
    //             .insert([newMessage]);

    //         if (error) throw new Error('Error sending message');
    //     },
    //     {
    //         onSuccess: async () => {
    //             try {
    //                 const data = await fetchMessages();
    //                 setMessages(data); // Refetch messages after sending
    //             } catch (err) {
    //                 setError(err);
    //             }
    //         },
    //     }
    // );

    const handleSend = () => {
        if (input.trim()) {
            sendMessageMutation.mutate({
                user_id: 1,
                subject: 'New Ticket',
                description: input,
                status: 'open',
            });
            setInput('');
        }
    };

    const handleReply = () => {
        sendMessageMutation.mutate({
            user_id: 2,
            subject: 'Reply',
            description: 'We are looking into your issue.',
            status: 'open',
        });
    };

    return (
        <div>
            <h1>Ticket System</h1>
            {error && <div style={{ color: 'red' }}>{error.message}</div>}
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ margin: '5px 0' }}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message"
                    style={{ width: '80%', padding: '5px' }}
                />
                <button onClick={handleSend} style={{ padding: '5px 10px', marginLeft: '5px' }}>
                    Send
                </button>
                <button onClick={handleReply} style={{ padding: '5px 10px', marginLeft: '5px' }}>
                    Reply
                </button>
            </div>
        </div>
    );
};

export default TicketSystem;
