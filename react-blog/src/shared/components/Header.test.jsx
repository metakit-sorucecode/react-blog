import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DummyProvider } from "../dummy/DummyProvider";
import Header from "./Header";

function renderHeader() {
  return render(
    <DummyProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </DummyProvider>
  );
}

describe("Header (로그아웃 상태)", () => {
  it("로그인/회원가입 링크가 보인다", () => {
    renderHeader();
    expect(screen.getByText("로그인")).toBeInTheDocument();
    expect(screen.getByText("회원가입")).toBeInTheDocument();
  });

  it("네비 링크는 밝은 글자색(text-neutral-content) 클래스를 가진다", () => {
    renderHeader();
    expect(screen.getByText("로그인").className).toContain("text-neutral-content");
    expect(screen.getByText("회원가입").className).toContain("text-neutral-content");
  });
});
