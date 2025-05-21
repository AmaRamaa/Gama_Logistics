import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            // Fetch invoices for user_id = 4
            const { data, error } = await supabase
                .from('Invoices')
                .select('*')

            if (!error) setInvoices(data || []);
            setLoading(false);
        };

        fetchInvoices();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Invoice History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : invoices.length === 0 ? (
                <p>No invoice history available yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Invoice #</th>
                            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
                            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Customer</th>
                            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Amount</th>
                            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => {
                            // If your table stores invoice details in a JSON 'data' column, parse it
                            let data = {};
                            try {
                                data = inv.data ? (typeof inv.data === 'string' ? JSON.parse(inv.data) : inv.data) : {};
                            } catch (e) {
                                data = {};
                            }
                            return (
                                <tr key={inv.id}>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>{inv.id}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>{inv.created_at?.slice(0, 10)}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        {inv.customer_name || data.customer_name || '-'}
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        {inv.amount ?? data.amount ?? '-'}
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        {inv.status || data.status || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvoiceHistory;