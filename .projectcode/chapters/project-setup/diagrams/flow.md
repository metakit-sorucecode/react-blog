# project-setup 흐름

```mermaid
flowchart LR
  A[npm run dev] --> B[index.html]
  B --> C[main.jsx]
  C --> D[index.css 불러오기]
  C --> E[App 그리기]
  E --> F[**Hello World**]
```
