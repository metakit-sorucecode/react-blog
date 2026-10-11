import { useState } from "react";
import axios from "axios";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("http://localhost:8080/join", {
      username,
      password,
      email,
    });
  }

  return (
    <FormCard title="회원가입" onSubmit={handleSubmit}>
      <Input
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
