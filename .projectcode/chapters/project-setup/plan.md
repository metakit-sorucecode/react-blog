# project-setup 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| react-blog/ | 새로 | react-blog-modern-start 복사본. dist, GUIDE.md, README.md는 빼고 복사한다 |
| react-blog/node_modules | 새로 | start에서 복사한다. 커밋하지 않는다 |
| react-blog/src/app, features, shared, test | 지움 | 옛 코드와 예제 데이터 |
| react-blog/src/main.jsx | 고침 | App 하나만 그린다 |
| react-blog/src/App.jsx | 새로 | Hello World를 보인다 |
| react-blog/src/index.css | 그대로 | Tailwind와 DaisyUI 두 줄 |
| react-blog/vite.config.js | 고침 | test 설정을 뺀다 |
| react-blog/package.json | 고침 | scripts에 format 한 줄만 더한다 |
| package.json | 새로 | 루트 테스트 실행기. Playwright만 둔다 |
| playwright.config.js | 새로 | 서버와 프론트를 함께 띄운다 |
| .gitignore | 고침 | Playwright 결과 폴더를 뺀다 |

- 루트 package.json을 따로 두는 이유: 학생 프로젝트의 의존성을 바꾸지 않으려고

## 코드 계획
main.jsx
- index.css를 불러온다
- StrictMode 안에 App을 그린다

App.jsx
- h1 하나로 Hello World를 보인다
- 클래스는 text-3xl, font-bold만 쓴다
- 흰 바탕과 검정 글자는 index.html의 data-theme light가 맡는다

vite.config.js
- plugins와 server 포트 5173은 그대로 둔다
- test 블록을 지운다. 지운 setup 파일을 가리키기 때문이다

react-blog/package.json
- scripts에 "format": "prettier --write src"를 더한다
- 이름, dependencies, devDependencies는 그대로 둔다
- prettier 설정 파일은 두지 않는다. 기본값이 큰따옴표와 세미콜론이다

루트 package.json
- type은 module이다
- scripts의 test는 playwright test다
- devDependencies는 @playwright/test 하나다

playwright.config.js
- testDir은 tests다
- baseURL은 http://localhost:5173이다
- 브라우저는 chromium 하나다
- webServer 두 개를 띄운다
- server-node는 db.json을 지운 뒤 npm start로 8080을 띄운다
- react-blog는 npm run dev로 5173을 띄운다
- 이미 떠 있는 서버는 다시 쓴다

.gitignore
- test-results/, playwright-report/를 더한다

## 핵심 코드
export default function App() {
  return <h1 className="text-3xl font-bold">Hello World</h1>;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | react-blog/, main.jsx, App.jsx |
| S2 | App.jsx, index.css |
| S3 | react-blog/src |
| S4 | react-blog/ (지운 폴더와 파일) |
| S5 | react-blog/package.json |
| S6 | package.json, playwright.config.js, .gitignore |

## 라이브러리
- 루트에 @playwright/test를 더한다. contract.md에 있다
- react-blog의 라이브러리는 바꾸지 않는다

## 다른 장 파일
- 없음
