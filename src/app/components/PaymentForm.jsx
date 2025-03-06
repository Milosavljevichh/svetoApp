import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
    const [details, setDetails] = useState({
        targetAccount: "",
        currency: "EUR",
        amount: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await axios.post("/api/createTransfer", {
                targetAccount: details.targetAccount,
                amount: details.amount,
                targetCurrency: details.currency,
                sourceCurrency: details.currency,
            }); 

            const data = await res.data;

            if (!data || data.error) throw new Error(data.error || "Payment failed");

            alert("Payment created! Transaction ID: " + data.id);
        } catch (err) {
            setError(err.message);
            console.error("Payment failed", err.response?.data || err);
            alert("Payment failed");
        } finally {     
            setLoading(false);
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <input type="text" name="targetAccount" placeholder="Recipient Account ID" onChange={handleChange} required />
            <input type="number" name="amount" placeholder="Amount" onChange={handleChange} required />
            <select name="currency" onChange={handleChange}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
            </select>
            <button type="submit" disabled={loading}>{loading ? "Processing..." : "Pay"}</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </>
    );
};

export default PaymentForm;
