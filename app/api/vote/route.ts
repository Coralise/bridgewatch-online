import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { updateVote, VoteType } from "@/app/data/SupabaseHandler"; // Adjust path to your file

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. You must be logged in to vote." },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const body = await request.json();
        const { buildId, voteType } = body;

        if (buildId === undefined || voteType === undefined) {
            return NextResponse.json(
                { error: "Missing required fields: buildId and voteType are required." },
                { status: 400 }
            );
        }

        if (![VoteType.NEUTRAL, VoteType.PLUS, VoteType.MINUS].includes(voteType)) {
            return NextResponse.json(
                { error: "Invalid voteType value. Must be 0, 1, or -1." },
                { status: 400 }
            );
        }

        const success = await updateVote(userId, Number(buildId), voteType as VoteType);

        if (!success) {
            return NextResponse.json(
                { error: "Failed to sync vote to database." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error("Vote API Route Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}