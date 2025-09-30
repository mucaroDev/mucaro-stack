import { db, user } from "@workspace/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const [foundUser] = await db.select().from(user).where(eq(user.id, id));

		if (!foundUser) {
			return NextResponse.json(
				{
					success: false,
					error: "User not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			user: foundUser,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
