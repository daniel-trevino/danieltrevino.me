import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function getResumePath() {
  const mdPath = path.join(__dirname, "daniel-resume-2025.md");
  if (existsSync(mdPath)) return mdPath;
  throw new Error("daniel-resume-2025.md not found in any known location");
}

export const resumeMarkdown = readFileSync(getResumePath(), "utf8");