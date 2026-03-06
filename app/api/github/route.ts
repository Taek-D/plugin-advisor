import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    const match = url?.match(/github\.com\/([^/]+)\/([^/\s?#]+)/);

    if (!match) {
      return NextResponse.json(
        { error: "올바른 GitHub URL이 아니에요" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;
    const branches = ["main", "master"];

    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      try {
        const res = await fetch(rawUrl, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const text = await res.text();
          return NextResponse.json({ content: text });
        }
      } catch {
        continue;
      }
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
