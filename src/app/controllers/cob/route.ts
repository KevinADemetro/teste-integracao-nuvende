import { NextRequest, NextResponse } from "next/server";
import { cobService } from "@/app/services/cobService";

export async function POST(req: NextRequest) {
  try {
    const { txid, accountId, token, cobData } = await req.json();

    if (!txid || !accountId || !token || !cobData) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const data = await cobService.createCob(txid, token, accountId, cobData);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
