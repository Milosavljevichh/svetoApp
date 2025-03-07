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
        // Create a quote request to get the quote from Wise
        const quoteResponse = await axios.post(
            "https://api.sandbox.transferwise.tech/v1/quotes", // Wise sandbox endpoint
            {
                source: sourceCurrency,
                target: targetCurrency,
                sourceAmount: amount,
                rateType: "FIXED",
                type: "BALANCE_PAYOUT",
                profile:process.env.WISE_RECIPIENT_ID
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WISE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Check if quote was received successfully
        const quoteId = quoteResponse.data.id;
        console.log("Quote created:", quoteId);
        const quote = quoteResponse.data;
        if (!quote) {
            return NextResponse.json({ error: "Failed to get quote" }, { status: 500 });
        }
        console.log(quote)
        return NextResponse.json({ quote });
    } catch (error) {
        console.error("Wise API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to create quote", details: error.response?.data || error.message }, { status: 500 });
    }
}
