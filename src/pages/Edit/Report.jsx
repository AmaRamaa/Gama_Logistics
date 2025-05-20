import { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// LocationMarker for selecting location on the map
function LocationMarker({ setForm, setMapCenter }) {
    useMapEvents({
        click(e) {
            setForm(prev => ({
                ...prev,
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6),
            }));
            setMapCenter([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

const Report = () => {
    const [reports, setReports] = useState([]);
    const [editingReport, setEditingReport] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [form, setForm] = useState({});
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

    const exportToCSV = () => {
        const headers = [
            'ID',
            'Type',
            'Driver Name',
            'Car',
            'Location',
            'Gas',
            'Created At'
        ];

        const rows = reports.map(report => {
            let parsedData = {};
            try {
                parsedData = report.data && typeof report.data === 'string'
                    ? JSON.parse(report.data)
                    : (report.data || {});
            } catch { parsedData = {}; }
            return [
                report.id,
                report.type || '',
                parsedData.driverName || '',
                parsedData.car || '',
                parsedData.location || '',
                parsedData.gas || '',
                report.created_at || ''
            ];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'reports.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const fetchReports = async () => {
        const { data, error } = await supabase.from('Reports').select('*');
        if (!error) setReports(data || []);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleEdit = (report) => {
        let parsedData = {};
        try {
            parsedData = report.data && typeof report.data === 'string'
                ? JSON.parse(report.data)
                : (report.data || {});
        } catch {
            parsedData = {};
        }
        setEditingReport(report);
        setForm({
            type: report.type || '',
            driverName: parsedData.driverName || '',
            car: parsedData.car || '',
            gas: parsedData.gas || '',
            location: parsedData.location || '',
        });
        // If location is in "lat,lng" format, set map center
        if (parsedData.location && typeof parsedData.location === 'string' && parsedData.location.includes(',')) {
            const [lat, lng] = parsedData.location.split(',').map(Number);
            if (!isNaN(lat) && !isNaN(lng)) setMapCenter([lat, lng]);
        }
        setShowOverlay(true);
    };

    const handleDelete = async (reportId) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            await supabase.from('Reports').delete().eq('id', reportId);
            fetchReports();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const { type, ...dataFields } = form;
        await supabase
            .from('Reports')
            .update({
                type,
                data: JSON.stringify(dataFields),
            })
            .eq('id', editingReport.id);
        setShowOverlay(false);
        setEditingReport(null);
        fetchReports();
    };

    const handleOverlayClose = () => {
        setShowOverlay(false);
        setEditingReport(null);
    };

    // Move map to marker when editing
    function MoveMapToMarker({ lat, lng }) {
        const map = useMapEvents({});
        useEffect(() => {
            if (lat && lng) {
                map.setView([lat, lng]);
            }
        }, [lat, lng, map]);
        return null;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Edit Reports Page</h2>
            <button className="btn btn-outline-success mb-3" onClick={exportToCSV}>
                Export as CSV
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Driver Name</th>
                            <th>Car</th>
                            <th>Location</th>
                            <th>Gas</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => {
                            let parsedData = {};
                            try {
                                parsedData = report.data && typeof report.data === 'string'
                                    ? JSON.parse(report.data)
                                    : (report.data || {});
                            } catch { parsedData = {}; }
                            return (
                                <tr key={report.id}>
                                    <td>{report.id}</td>
                                    <td>{report.type}</td>
                                    <td>{parsedData.driverName || ''}</td>
                                    <td>{parsedData.car || ''}</td>
                                    <td>{parsedData.location || ''}</td>
                                    <td>{parsedData.gas ? parsedData.gas + ' L' : ''}</td>
                                    <td>{report.created_at}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEdit(report)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(report.id)}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showOverlay && editingReport && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div style={{ background: '#fff', padding: 30, borderRadius: 8, minWidth: 350, position: 'relative', maxWidth: 500 }}>
                        <button
                            style={{ position: 'absolute', top: 10, right: 10, border: 'none', background: 'transparent', fontSize: 20 }}
                            onClick={handleOverlayClose}
                        >
                            &times;
                        </button>
                        <h4>Edit Report</h4>
                        <div className="form-group">
                            <label>Type</label>
                            <input className="form-control" name="type" value={form.type} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Driver Name</label>
                            <input className="form-control" name="driverName" value={form.driverName || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Car</label>
                            <input className="form-control" name="car" value={form.car || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Gas</label>
                            <input className="form-control" name="gas" value={form.gas || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Location (Lat, Lng)</label>
                            <div className="mb-2" style={{ width: '100%', height: 250 }}>
                                <MapContainer
                                    center={mapCenter}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker
                                        setForm={(cb) => setForm(prev => {
                                            const updated = typeof cb === 'function' ? cb(prev) : cb;
                                            // Save location as "lat,lng" string
                                            if (updated.latitude && updated.longitude) {
                                                return {
                                                    ...updated,
                                                    location: `${updated.latitude},${updated.longitude}`
                                                };
                                            }
                                            return updated;
                                        })}
                                        setMapCenter={setMapCenter}
                                    />
                                    <MoveMapToMarker
                                        lat={form.location && form.location.includes(',') ? parseFloat(form.location.split(',')[0]) : null}
                                        lng={form.location && form.location.includes(',') ? parseFloat(form.location.split(',')[1]) : null}
                                    />
                                    {form.location && form.location.includes(',') && (
                                        <Marker position={form.location.split(',').map(Number)}>
                                            <Popup>
                                                Report Location<br />
                                                Lat: {form.location.split(',')[0]}<br />
                                                Lng: {form.location.split(',')[1]}
                                            </Popup>
                                        </Marker>
                                    )}
                                </MapContainer>
                            </div>
                            <input
                                type="text"
                                className="form-control mt-2"
                                name="location"
                                value={form.location || ''}
                                readOnly
                                placeholder="Location (lat,lng)"
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                                <button className="btn btn-secondary mr-2" onClick={handleOverlayClose}>
                                    Cancel
                                </button>
                                <button className="btn btn-success" onClick={handleSave}>
                                    Save
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;