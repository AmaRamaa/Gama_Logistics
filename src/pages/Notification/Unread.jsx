import React, { useEffect, useState } from "react";
import { supabase } from "../../supaBase/supaBase";

const SystemNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data: notifications, error } = await supabase
                    .from("Notifications") // Replace "your_actual_table_name" with the correct table name
                    .select("*")
                    .eq("status", "unread");

                if (error) {
                    throw error;
                }

                setNotifications(notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from("Notifications")
                .update({ status: "read" })
                .eq("id", id);

            if (error) {
                throw error;
            }

            setNotifications((prevNotifications) =>
                prevNotifications.filter((notification) => notification.id !== id)
            );
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", padding: "16px" }}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "16px",
                        width: "300px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3
                        style={{
                            margin: "0 0 10px 0",
                            whiteSpace: "warp",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            display: "block",
                        }}
                        title={notification.message}
                    >
                        {notification.message}
                    </h3>
                    <p
                        style={{
                            margin: "0 0 8px 0",
                            color: "#555",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                            display: "block",
                        }}
                        title={notification.status}
                    >
                        <strong>Status:</strong> {notification.status}
                    </p>
                    <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                            marginTop: "8px",
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Mark as Read
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SystemNotifications;