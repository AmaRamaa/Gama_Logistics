import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supaBase/supaBase";
import "bootstrap/dist/css/bootstrap.min.css";

const InvoicePreview = ({
    invoice,
    user,
    parcels,
    amount,
    showAllParcelInfo,
    onParcelPriceChange,
    forDownload = false,
    refForPrint
}) => {
    const today = new Date().toLocaleDateString();
    let total = 0;
    return (
        <div
            ref={refForPrint}
            style={{
                background: "#fff",
                padding: forDownload ? 24 : 40,
                minHeight: 700,
                fontFamily: "Arial, Helvetica, sans-serif",
                color: "#222",
                width: forDownload ? 700 : 600,
                margin: "0 auto",
                border: "1px solid #eee",
                boxShadow: forDownload ? "none" : "0 2px 16px #eee"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontWeight: 700, letterSpacing: 1, color: "#0d6efd" }}>Gama Logistics</h2>
                <div style={{ fontSize: 14, color: "#888" }}>Date: {today}</div>
            </div>
            <hr style={{ margin: "18px 0 24px 0", borderTop: "2px solid #0d6efd" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Invoice</div>
                    <div style={{ fontSize: 15 }}>
                        <div><b>Invoice ID:</b> {invoice?.id || "—"}</div>
                        <div><b>User:</b> {user?.name || "—"}</div>
                        <div><b>Amount:</b> ${amount || "—"}</div>
                    </div>
                </div>
                <div style={{ textAlign: "right", fontSize: 15 }}>
                    <div><b>Status:</b> <span style={{ color: "#198754" }}>Issued</span></div>
                </div>
            </div>
            <div style={{ marginTop: 18, fontSize: 15 }}>
                <div style={{ marginBottom: 10, fontWeight: 600 }}>Parcels:</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #0d6efd", background: "#f8f9fa" }}>
                            <th align="left" style={{ padding: "6px 10px" }}>ID</th>
                            <th align="left" style={{ padding: "6px 10px" }}>Recipient</th>
                            {showAllParcelInfo && (
                                <>
                                    <th align="left" style={{ padding: "6px 10px" }}>Route ID</th>
                                    <th align="left" style={{ padding: "6px 10px" }}>Weight</th>
                                    <th align="left" style={{ padding: "6px 10px" }}>Dimension</th>
                                    <th align="left" style={{ padding: "6px 10px" }}>Status</th>
                                    <th align="left" style={{ padding: "6px 10px" }}>Recipient Address</th>
                                </>
                            )}
                            <th align="left" style={{ padding: "6px 10px" }}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.length === 0 && (
                            <tr>
                                <td colSpan={showAllParcelInfo ? 8 : 3} style={{ padding: "10px", color: "#888" }}>No parcels selected</td>
                            </tr>
                        )}
                        {parcels.map((p, idx) => {
                            const price = p.price || 0;
                            total += price;
                            return (
                                <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "6px 10px" }}>{p.id}</td>
                                    <td style={{ padding: "6px 10px" }}>{p.recipient_name}</td>
                                    {showAllParcelInfo && (
                                        <>
                                            <td style={{ padding: "6px 10px" }}>{p.route_id}</td>
                                            <td style={{ padding: "6px 10px" }}>{p.weight}</td>
                                            <td style={{ padding: "6px 10px" }}>{p.dimension}</td>
                                            <td style={{ padding: "6px 10px" }}>{p.status}</td>
                                            <td style={{ padding: "6px 10px" }}>{p.recipient_address}</td>
                                        </>
                                    )}
                                    <td style={{ padding: "6px 10px" }}>
                                        {showAllParcelInfo && onParcelPriceChange && !forDownload ? (
                                            <input
                                                type="number"
                                                value={price}
                                                min="0"
                                                step="0.01"
                                                style={{ width: 70 }}
                                                onChange={e => onParcelPriceChange(p.id, parseFloat(e.target.value) || 0)}
                                            />
                                        ) : (
                                            `$${price.toFixed(2)}`
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={{
                    marginTop: 30,
                    textAlign: "right",
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#0d6efd"
                }}>
                    Total: ${total.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

const Invoice = () => {
    const [users, setUsers] = useState([]);
    const [parcels, setParcels] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedParcels, setSelectedParcels] = useState([]);
    const [amount, setAmount] = useState("");
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAllParcelInfo, setShowAllParcelInfo] = useState(false);

    const printRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: usersData } = await supabase.from("Users").select("*");
            const { data: parcelsData } = await supabase.from("Parcels").select("*");
            setUsers(usersData || []);
            setParcels(parcelsData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Helper to get selected parcels with price
    const getSelectedParcels = () => {
        return parcels
            .filter(p => selectedParcels.some(sp => sp.id === p.id))
            .map(p => {
                const found = selectedParcels.find(sp => sp.id === p.id);
                return { ...p, price: found?.price ?? p.price ?? 0 };
            });
    };

    const handleParcelCheckbox = (id) => {
        setSelectedParcels(prev => {
            if (prev.some(p => p.id === id)) {
                return prev.filter(p => p.id !== id);
            } else {
                const parcel = parcels.find(p => p.id === id);
                return [...prev, { id, price: parcel?.price ?? 0 }];
            }
        });
    };

    const handleParcelPriceChange = (id, price) => {
        setSelectedParcels(prev =>
            prev.map(p => p.id === id ? { ...p, price } : p)
        );
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        if (!selectedUser || selectedParcels.length === 0 || !amount) return;

        // 1. Insert into Finance table (existing)
        const { data: financeData, error: financeError } = await supabase.from("Finance").insert([
            {
                user_id: selectedUser,
                amount: parseFloat(amount),
                type: "invoice",
            },
        ]).select().single();

        if (financeError) {
            alert("Error creating invoice");
            return;
        }

        // 2. Insert into Invoices table (NEW)
        const invoicePayload = {
            created_at: new Date().toISOString(),
            data: JSON.stringify({
                user_id: selectedUser,
                amount: parseFloat(amount),
                parcels: getSelectedParcels(),
                finance_id: financeData.id,
            }),
        };

        const { data: invoiceDataDb, error: invoiceError } = await supabase.from("Invoices").insert([invoicePayload]).select().single();

        if (invoiceError) {
            alert("Error saving invoice details");
            return;
        }

        setInvoiceData({
            invoice: invoiceDataDb,
            user: users.find(u => u.id === selectedUser),
            parcels: getSelectedParcels(),
        });
    };


    // Download as PDF/PNG using browser print
    const handleDownload = () => {
        const printContents = printRef.current.innerHTML;
        const win = window.open("", "_blank");
        win.document.write(`
            <html>
                <head>
                    <title>Invoice</title>
                    <style>
                        body { background: #fff; margin: 0; padding: 0; }
                        @media print {
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>${printContents}</body>
            </html>
        `);
        win.document.close();
        setTimeout(() => {
            win.print();
            win.close();
        }, 500);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container py-5">
            <div className="row">
                {/* Form */}
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Create Invoice</h2>
                            <form onSubmit={handleCreateInvoice}>
                                <div className="mb-3">
                                    <label className="form-label">User:</label>
                                    <select
                                        className="form-select"
                                        value={selectedUser}
                                        onChange={e => setSelectedUser(e.target.value)}
                                        required
                                    >
                                        <option value="">Select user</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Parcels:</label>
                                    <div className="mb-2">
                                        <input
                                            type="checkbox"
                                            id="showAllParcelInfo"
                                            checked={showAllParcelInfo}
                                            onChange={e => setShowAllParcelInfo(e.target.checked)}
                                            style={{ marginRight: 8 }}
                                        />
                                        <label htmlFor="showAllParcelInfo" style={{ cursor: "pointer" }}>
                                            Show all parcel info & edit price
                                        </label>
                                    </div>
                                    <div>
                                        {parcels.map(p => (
                                            <div key={p.id} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`parcel-${p.id}`}
                                                    value={p.id}
                                                    checked={selectedParcels.some(sp => sp.id === p.id)}
                                                    onChange={() => handleParcelCheckbox(p.id)}
                                                    style={{ cursor: "pointer", width: 18, height: 18 }}
                                                />
                                                <label
                                                    className="form-check-label ms-2"
                                                    htmlFor={`parcel-${p.id}`}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontWeight: selectedParcels.some(sp => sp.id === p.id) ? "bold" : "normal",
                                                        color: selectedParcels.some(sp => sp.id === p.id) ? "#198754" : "#212529"
                                                    }}
                                                >
                                                    <span style={{ fontSize: 15 }}>
                                                        <span className="badge bg-secondary me-2">{p.id}</span>
                                                        {p.recipient_name}
                                                    </span>
                                                </label>
                                                {showAllParcelInfo && selectedParcels.some(sp => sp.id === p.id) && (
                                                    <input
                                                        type="number"
                                                        value={selectedParcels.find(sp => sp.id === p.id)?.price ?? p.price ?? 0}
                                                        min="0"
                                                        step="0.01"
                                                        style={{ marginLeft: 16, width: 90 }}
                                                        onChange={e => handleParcelPriceChange(p.id, parseFloat(e.target.value) || 0)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Amount:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Create Invoice</button>
                            </form>
                            {invoiceData && (
                                <div className="mt-5">
                                    <h4 className="mb-3">Invoice Created</h4>
                                    <div className="mb-2">
                                        <strong>Invoice ID:</strong> {invoiceData.invoice.id}
                                    </div>
                                    <div className="mb-2">
                                        <strong>User:</strong> {invoiceData.user?.name}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Amount:</strong> ${invoiceData.invoice.amount}
                                    </div>
                                    <h5 className="mt-3">Parcels</h5>
                                    <ul className="list-group mb-3">
                                        {invoiceData.parcels.map(p => (
                                            <li className="list-group-item" key={p.id}>
                                                {p.id} - {p.recipient_name} - ${p.price}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className="btn btn-outline-success"
                                        onClick={handleDownload}
                                    >
                                        Download Invoice
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Live Preview */}
                <div className="col-md-7 d-flex align-items-center">
                    <div style={{ width: "100%" }}>
                        <InvoicePreview
                            refForPrint={printRef}
                            invoice={{ id: invoiceData?.invoice?.id || "—" }}
                            user={users.find(u => u.id === selectedUser)}
                            parcels={getSelectedParcels()}
                            amount={amount}
                            showAllParcelInfo={showAllParcelInfo}
                            onParcelPriceChange={showAllParcelInfo ? handleParcelPriceChange : undefined}
                        />
                    </div>
                </div>
                {/* Hidden printable invoice for download */}
                <div style={{ display: "none" }}>
                    <div ref={printRef}>
                        <InvoicePreview
                            forDownload
                            invoice={invoiceData?.invoice}
                            user={invoiceData?.user}
                            parcels={invoiceData?.parcels || []}
                            amount={invoiceData?.invoice?.amount}
                            showAllParcelInfo={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
