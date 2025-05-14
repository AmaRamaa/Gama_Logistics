import React, { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';

const Daily = () => {
    const [drivers, setDrivers] = useState([]);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: driversData, error: driversError } = await supabase.from('Drivers').select('*');
                if (driversError) throw driversError;
                setDrivers(driversData);

                const { data: usersData, error: usersError } = await supabase.from('Users').select('*');
                if (usersError) throw usersError;
                setUsers(usersData);

                const { data: reportsData, error: reportsError } = await supabase.from('Reports').select('*');
                if (reportsError) throw reportsError;
                setReports(reportsData);

                const { data: notificationsData, error: notificationsError } = await supabase.from('Notifications').select('*');
                if (notificationsError) throw notificationsError;
                setNotifications(notificationsData);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Daily Report Form</h1>
            <form onSubmit={console.log('Form changed')}>
                <div className="form-group">
                    <label htmlFor="driverName">Driver Name</label>
                    <input type="text" id="driverName" className="form-control" placeholder="Enter driver's name" />
                </div>
                <div className="form-group">
                    <label htmlFor="car">Car</label>
                    <input type="text" id="car" className="form-control" placeholder="Enter car details" />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" className="form-control" placeholder="Enter current location" />
                </div>
                <div className="form-group">
                    <label htmlFor="gas">Gas Used</label>
                    <input type="number" id="gas" className="form-control" placeholder="Enter gas used (in liters)" />
                </div>
                <button type="submit" className="btn btn-primary">Submit Report</button>
            </form>

            <h2>Fetched Data</h2>
            <div>
                <h3>Drivers</h3>
                <ul>
                    {drivers.map(driver => (
                        <li key={driver.id}>{driver.user_id} - {driver.status}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} - {user.role}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Reports</h3>
                <ul>
                    {reports.map(report => (
                        <li key={report.id}>{report.type} - {JSON.stringify(report.data)}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Notifications</h3>
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id}>{notification.message} - {notification.status}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Daily;