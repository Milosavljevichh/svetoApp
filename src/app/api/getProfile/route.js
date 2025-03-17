import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    try {
        const response = await axios.get("https://api.sandbox.transferwise.tech/v1/profiles", {
            headers: {
                Authorization: `Bearer ${process.env.WISE_API_KEY}`,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Wise API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to fetch profile ID" }, { status: 500 });
    }
}
