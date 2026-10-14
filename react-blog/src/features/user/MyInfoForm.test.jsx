import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DummyProvider } from "../../shared/dummy/DummyProvider";
import { users } from "../../shared/dummy/db";
import MyInfoForm from "./MyInfoForm";

describe("MyInfoForm", () => {
  it("로그인한 사용자의 이메일을 폼에 미리 채운다", () => {
    render(
      <DummyProvider initialUser={users[0]}>
        <MemoryRouter>
          <MyInfoForm />
        </MemoryRouter>
      </DummyProvider>
    );
    expect(screen.getByDisplayValue("ssar@nate.com")).toBeInTheDocument();
  });
});
