# Notice Board API (cURL Examples)

## 📌 게시판 (NoticeBoard)

### GET (게시글 조회: 페이지네이션 - 무한 스크롤 방식)

```bash
curl -sG 'http://localhost:3000/notice-board/get' \
  --data-urlencode 'classType=CLASS_0' \
  --data-urlencode 'limit=10' | jq

curl -sG 'http://localhost:3000/notice-board/get' \
  --data-urlencode 'classType=CLASS_0' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'cursor=2025-08-13T22:03:09.043Z' | jq
```

### POST (게시글 작성)

```bash
curl -s -X POST 'http://localhost:3000/notice-board/post' \
  -H 'Content-Type: application/json' \
  -d '{
    "classType": "CLASS_0",
    "authorId": "944a64bd-249b-48df-907e-7029703c7c8al",
    "title": "안녕하세요",
    "content": "반갑습니다."
  }' | jq
```

### PATCH (게시글 수정)

```bash
curl -s -X PATCH "http://localhost:3000/notice-board/patch/944a64bd-249b-48df-907e-7029703c7c8a" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "87788395-37a5-448a-8813-f43fbd2c9f1e",
    "title": "수정된 제목입니다.",
    "content": "수정된 내용입니다."
  }' | jq
```

### DELETE (게시글 삭제)

```bash
curl -s -X DELETE "http://localhost:3000/notice-board/delete/944a64bd-249b-48df-907e-7029703c7c8a" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "87788395-37a5-448a-8813-f43fbd2c9f1e"
  }' | jq
```

### POST (댓글 작성)

```bash
curl -s -X POST "http://localhost:3000/comment/post" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "eb59f203-46b3-47e5-b854-d1eb4e94b252",
    "postId": "bb9387bf-435f-468d-930c-7cfadff25495",
    "content": "첫 댓글입니다."
  }' | jq

curl -s -X POST "http://localhost:3000/comment/post" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "ba3584b6-cca4-42ad-b2d2-ae8ac3e3a64f",
    "postId": "b62c1c80-3849-4bc5-85e2-bd43d6bdcabd",
    "parentId": "9987872a-0c8f-4ea9-8002-ce0a2afe8191",
    "content": "대댓글입니다."
  }' | jq

```

### PATCH (댓글 수정)

```bash
curl -s -X PATCH "http://localhost:3000/comment/patch/0fb72731-9cc3-4bab-802e-a993b1253385" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "ba3584b6-cca4-42ad-b2d2-ae8ac3e3a64f",
    "content": "수정된 댓글입니다."
  }' | jq
```

### DELETE (댓글 삭제)

```bash
curl -s -X DELETE "http://localhost:3000/comment/delete/0be14cc5-52dc-49e0-8736-ae8252f87af1" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "3570a3e1-795a-4c5c-85a8-17634f9783a3"
  }' | jq
```
