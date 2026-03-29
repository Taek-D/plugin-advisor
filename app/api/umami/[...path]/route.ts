import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://cloud.umami.is";
const PREFIX = "/api/umami";

function buildUpstreamUrl(req: NextRequest): string {
  const { pathname, search } = req.nextUrl;
  const strippedPath = pathname.startsWith(PREFIX)
    ? pathname.slice(PREFIX.length)
    : pathname;
  return `${UPSTREAM}${strippedPath}${search}`;
}

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || req.headers.get("x-real-ip")
    || "";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const upstreamUrl = buildUpstreamUrl(req);
  const clientIp = getClientIp(req);
  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      host: "cloud.umami.is",
      ...(clientIp && { "x-forwarded-for": clientIp }),
    },
  });
  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const upstreamUrl = buildUpstreamUrl(req);
  const clientIp = getClientIp(req);
  const body = await req.text();
  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      host: "cloud.umami.is",
      ...(clientIp && { "x-forwarded-for": clientIp }),
    },
    body,
  });
  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: upstream.headers,
  });
}
