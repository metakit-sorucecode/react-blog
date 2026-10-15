import { useForm } from "react-hook-form";
import http from "../api/http";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";
import Input from "../components/Input";

export default function JoinForm() {
  // 폼 값을 react-hook-form에 맡긴다
  // 입력칸마다 state와 onChange를 만들지 않아도 된다
  // errors에는 검사 규칙에 걸린 칸의 문구가 들어간다
  // mode "onChange"는 가입하기를 누르기 전에도 칠 때마다 검사한다
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();

  // data는 handleSubmit이 모아 준 폼 값이다. { username, password, email }
  async function onSubmit(data) {
    try {
      await http.post("/join", data);
      alert("회원가입 완료");
      navigate("/login-form");
    } catch {
      // 실패 알림은 인터셉터가 토스트로 띄웠다. 여기서는 이동만 막는다
      // catch가 없으면 받아 줄 곳이 없는 에러가 콘솔에 Uncaught로 남는다
    }
  }

  // handleSubmit은 새로고침을 막고 폼 값을 모아 onSubmit에 넘긴다
  // 검사 규칙에 걸리면 onSubmit을 부르지 않고 그 칸으로 커서를 옮긴다
  return (
    <FormCard title="회원가입" onSubmit={handleSubmit(onSubmit)}>
      {/* register("이름")은 name, onChange, onBlur, ref를 돌려준다. 펼쳐서 입력칸에 붙인다 */}
      {/* Input은 받은 props를 input에 펼치므로 ref도 input까지 간다 */}
      <Input placeholder="아이디" {...register("username")} />
      {/* register의 두 번째 인자로 검사 규칙을 준다. minLength는 빈 값은 검사하지 않는다 */}
      <Input
        type="password"
        placeholder="비밀번호"
        {...register("password", {
          minLength: { value: 4, message: "비밀번호는 4자 이상이어야 합니다" },
        })}
      />
      {errors.password && (
        <p className="text-error text-sm">{errors.password.message}</p>
      )}
      <Input placeholder="이메일" {...register("email")} />
      <button className="btn">가입하기</button>
    </FormCard>
  );
}
