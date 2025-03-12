import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    console.log("WISE_API_KEY:", process.env.WISE_API_KEY ? "Loaded" : "Not Loaded");

    try {
        const { sourceCurrency, targetCurrency, amount } = await req.json();

        // Validate input
        if (!sourceCurrency || !targetCurrency || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Step 1: Create a Quote
        const quoteResponse = await axios.post(
            `https://api.sandbox.transferwise.tech/v3/profiles/${process.env.WISE_RECIPIENT_ID}/quotes`,
            {
                sourceCurrency,
                targetCurrency,
                sourceAmount: amount,
                rateType: "FIXED",
                preferredPayIn: "CARD", // Set to "CARD" so users can pay via credit/debit card
                profile: process.env.WISE_RECIPIENT_ID,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const quoteId = quoteResponse.data.id;
        console.log("Quote created:", quoteId);
        console.log("Quote data:", quoteResponse.data);

        // Step 2: Create a Recipient
        const recipientResponse = await axios.post(
            `https://api.sandbox.transferwise.tech/v1/accounts`,
            {
                accountHolderName: "Milos Milosavljevic",
                currency: "EUR",
                type: "iban",
                profile: process.env.WISE_RECIPIENT_ID,
                details: {
                    legalType: "PRIVATE",
                    firstName: "Milos",
                    lastName: "Milosavljevic",
                    IBAN: "BE79967040785533", // Replace with actual IBAN
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const recipientId = recipientResponse.data.id;
        console.log("Recipient created:", recipientId);

        // Step 3: Create a Transfer
        const transferResponse = await axios.post(
            `https://api.sandbox.transferwise.tech/v1/transfers`,
            {
                targetAccount: recipientId,
                quoteUuid: quoteId,
                customerTransactionId: crypto.randomUUID(), // Generates a unique transaction ID
                details: {
                    reference: "Donation",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const transferId = transferResponse.data.id;
        console.log("Transfer created:", transferId);

        return NextResponse.json({ quoteId, recipientId, transferId });
    } catch (error) {
        console.error("Wise API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
}
 