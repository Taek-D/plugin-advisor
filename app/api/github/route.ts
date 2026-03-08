import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const match = url?.trim().match(/github\.com\/([^/]+)\/([^/\s?#]+)/i);

    if (!match) {
      return NextResponse.json(
        { error: "올바른 GitHub URL이 아니에요." },
        { status: 400 }
      );
    }

    const [, owner, rawRepo] = match;
    const repo = rawRepo.replace(/\.git$/i, "");
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.raw+json",
      "User-Agent": "plugin-advisor",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers,
          signal: AbortSignal.timeout(5000),
        }
      );

      if (res.ok) {
        const text = await res.text();
        if (text.trim()) {
          return NextResponse.json({ content: text });
        }
      }
    } catch {
      // Fall through to the shared error response below.
    }

    return NextResponse.json(
      { error: "README를 불러올 수 없어요. 텍스트 탭에 직접 붙여넣기를 써주세요." },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { error: "요청을 처리할 수 없어요." },
      { status: 500 }
    );
  }
}
