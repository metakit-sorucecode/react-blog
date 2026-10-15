import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";

// 서버에서 받은 데이터를 키별로 담아 두는 캐시 저장소를 만든다
// 앱 전체에서 하나만 만들고, 아래 Provider로 모든 화면에 나눠 준다
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 받은 데이터를 1분 동안 fresh로 본다 (staleTime)
      // 기본값 0이면 받자마자 stale이라 화면에 들어올 때마다 다시 받는다
      // 1분으로 두면 화면을 오갈 때 방금 받은 데이터를 요청 없이 캐시로 바로 그린다
      staleTime: 60 * 1000,
      // 탭이 다시 보일 때 다시 받는 옵션(refetchOnWindowFocus)은 기본값 true를 그대로 쓴다
      // 지금 화면에 떠 있는 useQuery의 키 중 stale인 것만 다시 받는다
      // staleTime이 1분이라 받은 지 1분 안에는 탭을 오가도 요청이 가지 않는다

      // 조회가 실패했을 때 다시 물을지 정한다 (retry)
      // 기본값은 3번 다시 묻기라서, 없는 글(404)도 몇 초 동안 다시 물은 뒤에야 실패가 된다
      // failureCount는 이미 다시 물은 횟수다. 첫 실패 때 0이다
      retry: (failureCount, error) => {
        // 응답이 400대면 다시 물어도 결과가 같다. 바로 실패로 둔다
        if (error.response && error.response.status < 500) {
          return false;
        }
        // 500이나 연결 실패는 잠깐 뒤에 될 수도 있다. 한 번만 다시 묻는다
        return failureCount < 1;
      },
      // 쓰기(useMutation)의 retry 기본값은 다시 묻지 않기라서 그대로 둔다
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 안쪽 화면들이 useQuery, useMutation, useQueryClient로 이 캐시를 쓰게 한다 */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 오른쪽 아래에 캐시를 들여다보는 버튼을 띄운다. 키마다 stale, inactive 같은 상태가 보인다 */}
      {/* 개발 모드(npm run dev)에서만 보이고 빌드한 앱에는 나오지 않는다 */}
      <ReactQueryDevtools />
      {/* toast()로 띄운 알림이 나오는 자리다. 오른쪽 아래는 Devtools 버튼 자리라 위 오른쪽에 둔다 */}
      {/* 검정 바탕, 흰 글자, 테두리 없이 글 길이만큼만 넓게 그린다 */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "black",
            color: "white",
            border: "none",
            padding: "8px 16px",
            width: "fit-content",
            right: 0,
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
);
