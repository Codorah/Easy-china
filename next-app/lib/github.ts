// ── GitHub commit helper — SERVER ONLY ──────────────────────────────────────
// Never import this in a Client Component. The GITHUB_TOKEN env var is
// intentionally NOT prefixed with NEXT_PUBLIC_ so it stays out of the bundle.

const REPO  = process.env.GITHUB_REPO   ?? "blackbusinesslady/easychina";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN  = process.env.GITHUB_TOKEN;      // server-only

/** Upsert a file in the GitHub repo (create or update via the Contents API). */
export async function ghCommit(
  filepath: string,
  data: unknown,
  message = `chore: update ${filepath} via admin panel`,
): Promise<boolean> {
  if (!TOKEN) {
    console.error("[github] GITHUB_TOKEN is not set — commit skipped");
    return false;
  }

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
  const apiUrl  = `https://api.github.com/repos/${REPO}/contents/${filepath}`;
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept:        "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // GET the current SHA (required for updates; absent on create)
  let sha: string | undefined;
  try {
    const get = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (get.ok) {
      const json = await get.json() as { sha: string };
      sha = json.sha;
    }
  } catch {
    // File doesn't exist yet — that's fine
  }

  const body = JSON.stringify({ message, content, branch: BRANCH, ...(sha ? { sha } : {}) });

  const put = await fetch(apiUrl, { method: "PUT", headers, body });
  if (!put.ok) {
    const err = await put.text();
    console.error(`[github] PUT ${filepath} failed:`, err);
    return false;
  }
  return true;
}
