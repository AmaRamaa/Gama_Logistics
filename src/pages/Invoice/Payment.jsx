import { useState } from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// FiscalCoupon component
const FiscalCoupon = ({ form }) => {
    const today = new Date().toLocaleDateString();
    return (
        <div
            style={{
                background: "#fff",
                padding: 24,
                minWidth: 350,
                maxWidth: 400,
                margin: "0 auto",
                border: "1px solid #eee",
                fontFamily: "monospace",
                color: "#222",
                boxShadow: "0 2px 16px #eee"
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0, color: "#0d6efd" }}>Gama Logistics</h4>
                <div style={{ fontSize: 13, color: "#888" }}>Fiscal Coupon</div>
            </div>
            <hr />
            <div style={{ fontSize: 15, marginBottom: 8 }}>
                <b>Date:</b> {today}
            </div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>
                <b>Invoice Number:</b> {form.invoiceNumber}
            </div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>
                <b>Amount:</b> ${parseFloat(form.amount).toFixed(2)}
            </div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>
                <b>Payment Method:</b> {form.paymentMethod}
            </div>
            <div style={{ fontSize: 15, marginBottom: 8 }}>
                <b>Payment Date:</b> {form.date}
            </div>
            {form.notes && (
                <div style={{ fontSize: 15, marginBottom: 8 }}>
                    <b>Notes:</b> {form.notes}
                </div>
            )}
            <hr />
            <div style={{ textAlign: "center", fontSize: 13, color: "#888" }}>
                Thank you for your payment!
            </div>
        </div>
    );
};

const Payment = () => {
    const [form, setForm] = useState({
        invoiceNumber: '',
        amount: '',
        paymentMethod: 'Credit Card',
        date: '',
        notes: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would typically send the form data to your backend
    };


    const handleDownloadPDF = async () => {
            const element = document.getElementById("fiscal-coupon");
            if (!element) return;
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4"
            });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            // Calculate the ratio to fit the image within the page
            const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
            const imgScaledWidth = imgWidth * ratio;
            const imgScaledHeight = imgHeight * ratio;
            const x = (pageWidth - imgScaledWidth) / 2;
            const y = (pageHeight - imgScaledHeight) / 2;
            pdf.addImage(imgData, "PNG", x, y, imgScaledWidth, imgScaledHeight);
            pdf.save(`fiscal-coupon-${form.invoiceNumber || "invoice"}.pdf`);
        };
    return (
        <div className="card p-4 shadow-sm">
            <h3 className="mb-3">Payment Invoice</h3>
            {submitted ? (
                <>
                    <div id="fiscal-coupon">
                        <FiscalCoupon form={form} />
                    </div>
                    <button
                        className="btn btn-success mt-3"
                        onClick={handleDownloadPDF}
                        type="button"
                    >
                        Download as PDF
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Invoice Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="invoiceNumber"
                            value={form.invoiceNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Amount</label>
                        <input
                            type="number"
                            className="form-control"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Payment Method</label>
                        <select
                            className="form-select"
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                        >
                            <option>Credit Card</option>
                            <option>Bank Transfer</option>
                            <option>Cash</option>
                            <option>PayPal</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea
                            className="form-control"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit Payment
                    </button>
                </form>
            )}
        </div>
    );
};

export default Payment;