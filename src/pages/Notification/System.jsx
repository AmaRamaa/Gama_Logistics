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
                    .eq("status", "system");

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
                    <h3 style={{ margin: "0 0 8px 0" }}>{notification.message}</h3>
                    <p style={{ margin: "0 0 8px 0", color: "#555" }}>
                        <strong>Status:</strong> {notification.status}
                    </p>
                    <p style={{ margin: "0", color: "#888" }}>
                        <strong>Created At:</strong> {new Date(notification.created_at).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default SystemNotifications;