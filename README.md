# Notice Board API (cURL Examples)

### 📌 GET (게시글 조회: 페이지네이션 - 무한 스크롤 방식)

```bash
curl -sG 'http://localhost:3000/notice-board/get' \
  --data-urlencode 'boardType=반' \
  --data-urlencode 'classType=전체' \
  --data-urlencode 'contentType=전체' \
  --data-urlencode 'limit=10' | jq

curl -sG 'http://localhost:3000/notice-board/get' \
  --data-urlencode 'boardType=반' \
  --data-urlencode 'classType=CLASS_0' \
  --data-urlencode 'contentType=전체' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'cursor=2025-08-13T22:03:09.043Z' | jq

curl -sG 'http://localhost:3000/notice-board/get' \
  --data-urlencode 'boardType=반' \
  --data-urlencode 'classType=전체' \
  --data-urlencode 'contentType=전체' \
  --data-urlencode 'limit=10' \
  --data-urlencode 'targetId=bb9387bf-435f-468d-930c-7cfadff25495' | jq
```

요청 쿼리 구조

```json
{
  "boardType": "string (required)",
  "classType": "string (required)",
  "contentType": "string (required)",
  "limit": "number (required)",
  "cursor": "string (optional, ISO datetime)",
  "targetId": "string (optional, post id)"
}
```

응답 구조

```json
{
  "posts": [
    {
      "id": "string",
      "boardType": "string",
      "classType": "string",
      "contentType": "string",
      "author": {
        "id": "string",
        "nickname": "string"
      },
      "title": "string",
      "content": "string",
      "comments": [
        {
          "id": "string",
          "author": {
            "id": "string",
            "nickname": "string"
          },
          "content": "string",
          "parent": "string | null",
          "children": [
            {
              "id": "string",
              "author": {
                "id": "string",
                "nickname": "string"
              },
              "content": "string",
              "parent": "string",
              "children": null,
              "createdAt": "datetime",
              "updatedAt": "datetime"
            }
          ],
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ],
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "hasMore": true
}
```

### 📌 POST (게시글 작성)

```bash
curl -s -X POST 'http://localhost:3000/notice-board/post' \
  -H 'Content-Type: application/json' \
  -d '{
    "boardType": "반",
    "classType": "CLASS_0",
    "contentType": "전체",
    "authorNickname": "byunggil",
    "title": "안녕하세요",
    "content": "반갑습니다."
  }' | jq
```

요청 바디 구조

```json
{
  "boardType": "string",
  "classType": "string",
  "contentType": "string",
  "authorNickname": "string",
  "title": "string",
  "content": "string"
}
```

응답 구조

```json
{
  "id": "string",
  "boardType": "string",
  "classType": "string",
  "contentType": "string",
  "author": {
    "id": "string",
    "nickname": "string"
  },
  "title": "string",
  "content": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 📌 PATCH (게시글 수정)

```bash
curl -s -X PATCH "http://localhost:3000/notice-board/patch/944a64bd-249b-48df-907e-7029703c7c8a" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "byunggil",
    "title": "수정된 제목입니다.",
    "content": "수정된 내용입니다."
  }' | jq
```

요청 바디 구조

```json
{
  "authorNickname": "string",
  "title": "string (optional)",
  "content": "string (optional)"
}
```

응답 구조

```json
{
  "success": true,
  "updatedPost": {
    "id": "string",
    "boardType": "string",
    "classType": "string",
    "contentType": "string",
    "author": {
      "id": "string",
      "nickname": "string"
    },
    "title": "string",
    "content": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

수정 충돌/오류 시 응답 구조

```json
{
  "success": false,
  "latestPost": {
    "id": "string",
    "boardType": "string",
    "classType": "string",
    "contentType": "string",
    "author": {
      "id": "string",
      "nickname": "string"
    },
    "title": "string",
    "content": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "error": "수정 중 오류가 발생했습니다."
}
```

### 📌 DELETE (게시글 삭제)

```bash
curl -s -X DELETE "http://localhost:3000/notice-board/delete/944a64bd-249b-48df-907e-7029703c7c8a" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "byunggil"
  }' | jq
```

요청 바디 구조

```json
{
  "authorNickname": "string"
}
```

응답 구조

```json
{
  "success": true,
  "message": "해당 게시글을 삭제했습니다."
}
```

### 📌 POST (댓글 작성)

```bash
curl -s -X POST "http://localhost:3000/comment/post" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "qudrlf72",
    "postId": "bb9387bf-435f-468d-930c-7cfadff25495",
    "content": "첫 댓글입니다."
  }' | jq

curl -s -X POST "http://localhost:3000/comment/post" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "qudrlf72",
    "postId": "b62c1c80-3849-4bc5-85e2-bd43d6bdcabd",
    "parentId": "9987872a-0c8f-4ea9-8002-ce0a2afe8191",
    "content": "대댓글입니다."
  }' | jq
```

요청 바디 구조

```json
{
  "authorNickname": "string",
  "postId": "string",
  "parentId": "string (optional)",
  "content": "string"
}
```

응답 구조

```json
{
  "id": "string",
  "author": {
    "id": "string",
    "nickname": "string"
  },
  "content": "string",
  "parent": "string | null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 📌 PATCH (댓글 수정)

```bash
curl -s -X PATCH "http://localhost:3000/comment/patch/0fb72731-9cc3-4bab-802e-a993b1253385" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "qudrlf72",
    "content": "수정된 댓글입니다."
  }' | jq
```

요청 바디 구조

```json
{
  "authorNickname": "string",
  "content": "string (optional)"
}
```

응답 구조

```json
{
  "success": true,
  "updatedComment": {
    "id": "string",
    "author": {
      "id": "string",
      "nickname": "string"
    },
    "content": "string",
    "parent": "string | null",
    "children": [
      {
        "id": "string",
        "author": {
          "id": "string",
          "nickname": "string"
        },
        "content": "string",
        "parent": "string",
        "children": null,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

수정 충돌/오류 시 응답 구조

```json
{
  "success": true,
  "latestComment": {
    "id": "string",
    "author": {
      "id": "string",
      "nickname": "string"
    },
    "content": "string",
    "parent": "string | null",
    "children": [],
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "error": "수정 중 오류가 발생했습니다."
}
```

### 📌 DELETE (댓글 삭제)

```bash
curl -s -X DELETE "http://localhost:3000/comment/delete/0be14cc5-52dc-49e0-8736-ae8252f87af1" \
  -H "Content-Type: application/json" \
  -d '{
    "authorNickname": "qudrlf72"
  }' | jq
```

요청 바디 구조

```json
{
  "authorNickname": "string"
}
```

응답 구조

```json
{
  "success": true,
  "message": "해당 댓글을 삭제했습니다."
}
```
