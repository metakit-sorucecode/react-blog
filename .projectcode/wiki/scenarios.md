# 시나리오별 구조도

## 앱 띄우기와 메뉴 이동

```mermaid
flowchart LR
  A[index.html] --> B[main.jsx]
  B --> C[App 라우터]
  C --> D[Layout]
  D --> E[Header 메뉴]
  D --> F[Outlet 자리]
  E --> G[SaveForm]
  E --> H[LoginForm]
  E --> I[JoinForm]
  E --> J[UserInfo]
  F --> K[Home]
```

만든 장: project-setup, layout, screens
맡는 파일
- react-blog/index.html
- react-blog/src/main.jsx
- react-blog/src/App.jsx
- react-blog/src/components/Layout.jsx
- react-blog/src/components/Header.jsx
- react-blog/src/pages/Home.jsx
- react-blog/src/pages/SaveForm.jsx
- react-blog/src/pages/LoginForm.jsx
- react-blog/src/pages/JoinForm.jsx
- react-blog/src/pages/UserInfo.jsx
- react-blog/src/index.css

## 글 보기에서 수정 화면까지

```mermaid
flowchart LR
  A[Home] --> B[Detail]
  B --> C[UpdateForm]
```

만든 장: screens
맡는 파일
- react-blog/src/pages/Home.jsx
- react-blog/src/pages/Detail.jsx
- react-blog/src/pages/UpdateForm.jsx
- react-blog/src/App.jsx

화면은 예시 글자로만 그렸다. 서버와 주고받는 시나리오(회원가입, 로그인, 글쓰기)는 아직 만든 장이 없다.
