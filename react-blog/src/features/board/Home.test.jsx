import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DummyProvider } from "../../shared/dummy/DummyProvider";
import Home from "./Home";

function renderHome() {
  return render(
    <DummyProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </DummyProvider>
  );
}

describe("Home", () => {
  it("더미 게시글 제목을 최신순으로 렌더한다", () => {
    renderHome();
    expect(screen.getByText("배포 준비하기")).toBeInTheDocument();
    expect(screen.getByText("Context 로 상태 공유")).toBeInTheDocument();
  });

  it("다음 버튼을 누르면 다음 페이지가 보인다", async () => {
    renderHome();
    await userEvent.click(screen.getByText("다음"));
    expect(screen.getByText("폼 입력 다루기")).toBeInTheDocument();
    expect(screen.queryByText("배포 준비하기")).not.toBeInTheDocument();
  });
});
