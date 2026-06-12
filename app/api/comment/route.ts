import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import { addComment, getLastCommentTimestamp } from "@/app/data/SupabaseHandler";

export async function POST(request: Request) {
    try {
        // 1. Fetch the secure server-side session
        const session = await auth();

        // 2. Reject the request if the user is not logged in
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. You must be logged in to comment." },
                { status: 401 }
            );
        }

        // 3. Extract the verified Discord ID from the session token
        const authorId = session.user.id; 

        if (!authorId) {
            return NextResponse.json(
                { error: "Unauthorized. User ID not found in session token." },
                { status: 401 }
            );
        }

        const lastCommentTimeStr = await getLastCommentTimestamp(authorId);
        
        if (lastCommentTimeStr) {
            const lastCommentTime = new Date(lastCommentTimeStr).getTime();
            const currentTime = Date.now();
            
            const cooldownDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
            const timePassed = currentTime - lastCommentTime;

            if (timePassed < cooldownDuration) {
                const secondsRemaining = Math.ceil((cooldownDuration - timePassed) / 1000);
                const minutesRemaining = Math.floor(secondsRemaining / 60);
                const displaySeconds = secondsRemaining % 60;

                return NextResponse.json(
                    { 
                        error: `You are commenting too fast. Please wait ${minutesRemaining}m ${displaySeconds}s before posting again.`,
                        secondsRemaining 
                    },
                    { status: 429 } // 429 Too Many Requests
                );
            }
        }
        // =========================================================

        // 4. Parse the remaining fields from the request body
        const body = await request.json();
        const { buildId, comment } = body;

        // 5. Basic input validation
        if (!buildId || !comment || comment.trim() === "") {
            return NextResponse.json(
                { error: "Missing required fields: buildId and comment are required." },
                { status: 400 }
            );
        }

        // 6. Execute the secure database insertion using the session's verified ID
        const success = await addComment(Number(buildId), authorId, comment);

        if (!success) {
            return NextResponse.json(
                { error: "Database operation failed." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (err) {
        console.error("API Route Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}