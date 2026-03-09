import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "세팅 지원 서비스는 아직 준비 중이에요." },
    { status: 503 }
  );
}
