import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { updateIgn } from "@/app/data/SupabaseHandler";

export async function POST(request: Request) {
    
    try {

        const session = await auth();
    
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. You must be logged in to change IGN." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { newIgn } = body;

        const success = await updateIgn(session.user.id, newIgn);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to update IGN to database." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error("IGN Update API Route Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}