import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
    </QueryClientProvider>
  </StrictMode>,
);
