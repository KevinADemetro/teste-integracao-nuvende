import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/app/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { clientId, clientSecret, token } = await req.json();

    if (token) {
      const user = await authService.validateToken(token);
      return NextResponse.json({ valid: true, user }, { status: 200 });
    }

    const data = await authService.login(clientId, clientSecret);

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
