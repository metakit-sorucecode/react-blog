import axios from "axios";
import { toast } from "sonner";

const http = axios.create({ baseURL: "http://localhost:8080" });

http.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = jwt;
  }
  return config;
});

// 응답을 받은 뒤 화면 코드보다 먼저 거친다
// 성공은 그대로 돌려주고, 실패만 여기서 알린다
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      // 응답이 없으면 서버에 닿지 못한 것이다. msg도 없으니 정해 둔 글을 띄운다
      // 조회는 한 번 더 묻기 때문에 이 줄이 두 번 불린다
      // 같은 id의 토스트는 새로 쌓이지 않고 그 자리를 바꿔서 하나만 보인다
      toast("서버에 연결할 수 없습니다", { id: "network" });
    } else if (error.config.method !== "get") {
      // 조회(get)가 아니면 쓰기 실패다. 서버가 보낸 이유(msg)를 토스트로 띄운다
      // 조회 실패는 화면이 isError로 안내하니 띄우지 않는다
      toast(error.response.data.msg);
    }
    // 에러를 그대로 넘긴다. 그래야 요청을 부른 쪽도 실패한 줄 안다
    return Promise.reject(error);
  },
);

export default http;
