import { test, expect } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const blog = path.join(root, "react-blog");
const src = path.join(blog, "src");

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [path.relative(src, full)];
  });
}

// 색 글자(oklch 등)를 캔버스에 칠해 rgb 밝기로 바꾼다
async function brightness(page, selector, property) {
  return page.evaluate(
    ({ selector, property }) => {
      const color = getComputedStyle(document.querySelector(selector))[property];
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return (r + g + b) / 3;
    },
    { selector, property }
  );
}

test("S1 react-blog 개발 서버를 띄우면 Hello World가 보인다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello World" })).toBeVisible();
});

test("S2 Hello World는 흰 바탕에 큰 굵은 검정 글자로 보인다", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { name: "Hello World" });
  await expect(heading).toBeVisible();

  const style = await heading.evaluate((el) => {
    const s = getComputedStyle(el);
    return { size: parseFloat(s.fontSize), weight: Number(s.fontWeight) };
  });
  expect(style.size).toBeGreaterThan(24);
  expect(style.weight).toBeGreaterThanOrEqual(700);

  expect(await brightness(page, "html", "backgroundColor")).toBeGreaterThan(240);
  expect(await brightness(page, "h1", "color")).toBeLessThan(80);
});

test("S3 소스 폴더에는 코드 파일 두 개와 스타일 파일 하나만 있고 코드 파일은 모두 .jsx다", () => {
  const files = listFiles(src).sort();
  expect(files).toEqual(["App.jsx", "index.css", "main.jsx"]);
});

test("S4 옛 코드, 예제 데이터, 빌드 결과, 옛 안내 문서가 남아 있지 않다", () => {
  const leftovers = [
    "dist",
    "GUIDE.md",
    "README.md",
    "src/app",
    "src/features",
    "src/shared",
    "src/test",
  ].filter((name) => existsSync(path.join(blog, name)));
  expect(leftovers).toEqual([]);
});

test("S5 포맷 명령 하나로 코드 모양을 맞춘다", () => {
  execSync("npm run format", { cwd: blog, stdio: "pipe" });
  execSync("npx prettier --check src", { cwd: blog, stdio: "pipe" });
});

test("S6 루트 테스트 명령이 서버와 프론트를 함께 띄운다", async ({ page, request }) => {
  const res = await request.get("http://localhost:8080/");
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(Array.isArray(json.body.boards)).toBeTruthy();

  const front = await page.goto("/");
  expect(front.ok()).toBeTruthy();
});
