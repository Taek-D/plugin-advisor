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

export async function GET(req: NextRequest): Promise<NextResponse> {
  const upstreamUrl = buildUpstreamUrl(req);
  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      host: "cloud.umami.is",
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
  const body = await req.text();
  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      ...Object.fromEntries(req.headers.entries()),
      host: "cloud.umami.is",
    },
    body,
  });
  const responseBody = await upstream.arrayBuffer();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: upstream.headers,
  });
}
