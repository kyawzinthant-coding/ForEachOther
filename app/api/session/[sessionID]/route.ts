import { verifyIdToken } from "@/lib/firebaseadmin";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { sessionID: string } }
) {
  try {
    const { sessionID } = params;

    if (!sessionID) {
      return NextResponse.json(
        { valid: false, message: "No auth token found" },
        { status: 401 }
      );
    }

    const decodedToken = await verifyIdToken(sessionID);

    const { uid, email } = decodedToken;

    return NextResponse.json({ valid: true, uid, email });
  } catch (error) {
    console.error("Error verifying token:", error);

    return NextResponse.json(
      { valid: false, message: "Error verifying token", error: error },
      { status: 500 }
    );
  }
}
