import { NextRequest, NextResponse } from "next/server";

import { deleteUserAccount } from "@/server/services/user.service";

import { authGetUser } from "../auth-middleware";

export async function DELETE(_request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await authGetUser();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.uid;

    // Delete the user account and all associated data
    await deleteUserAccount(userId);

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
