# layout 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/src/pages/Home.jsx | 새로 | 홈 화면 |
| react-blog/src/components/Layout.jsx | 새로 | 바깥 여백 안에 헤더, 구분선, 화면 자리를 둔다 |
| react-blog/src/components/Header.jsx | 새로 | 메뉴 5개 |
| react-blog/src/App.jsx | 고침 | Hello World 대신 라우터를 만든다 |
| react-blog/src/index.css | 고침 | 지금 메뉴 강조 한 줄 |

- pages와 components로 나누는 이유: 3장에서 화면이 7개로 늘고 4장에서 컴포넌트가 생긴다
- Header를 Layout에서 나누는 이유: 8장에서 로그인 상태에 따라 메뉴가 바뀐다
- main.jsx는 그대로 둔다. 라우트는 App.jsx 한 곳에만 더한다

## 코드 계획
App.jsx
- createBrowserRouter로 라우터를 만든다
- 루트 / 의 element는 Layout이고 children에 홈을 index로 둔다
- App은 RouterProvider를 돌려준다

Layout.jsx
- div 하나에 max-w-3xl mx-auto p-8로 바깥 여백을 준다
- Header, hr, Outlet 순서로 둔다
- hr에는 mb-8을 준다

Header.jsx
- ul에 menu menu-horizontal을 주고 li마다 NavLink를 둔다
- 주소는 /, /login-form, /join-form, /save-form, /user-info다
- 홈 NavLink에는 end를 붙인다. 다른 주소에서 홈이 함께 강조되지 않게 한다
- NavLink의 className은 쓰지 않는다

index.css
- NavLink가 지금 주소의 링크에 붙이는 active 클래스를 DaisyUI menu-active 모양으로 그린다
- isActive를 다루지 않으려고 CSS 한 줄로 맡긴다

Home.jsx
- h1 하나로 홈을 보인다

## 핵심 코드
const router = createBrowserRouter([
  { path: "/", element: <Layout />, children: [{ index: true, element: <Home /> }] },
]);

<div className="max-w-3xl mx-auto p-8">
  <Header />
  <hr className="mb-8" />
  <Outlet />
</div>

<NavLink to="/" end>홈</NavLink>

.menu .active {
  @apply menu-active;
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx, Layout.jsx, Header.jsx, Home.jsx |
| S2 | Layout.jsx |
| S3 | Header.jsx |
| S4 | Header.jsx |
| S5 | Header.jsx, index.css |

## 라이브러리
- 추가 없음. react-router-dom은 contract에 있다

## 다른 장 파일
- project-setup: App.jsx, index.css
- project-setup 테스트 S1, S2, S3은 tdd에서 지금 동작에 맞게 고친다
