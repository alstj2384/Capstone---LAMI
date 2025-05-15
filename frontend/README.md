### pull request

본인 브랜치에 올리고 request로 머지 요청을 보내야 함. 

본인 브랜치와 메인을 합치고 싶을때 요청 네비게이션 바의 **Merge requests에서** 

리퀘스트 요청 → 병합 요청 수락 (작동 되는 코드만 올려야 함) 

main → 개발 서버로 자동으로 코드 업로드 : 개발 서버에 반영 

### merge

- [ ]  Delete source branch when merge request is accepted.

체크 박스 해제 해야함. 아니면 기존 브랜치의 코드가 삭제 될 수 있음 

```bash
request 작성 형식 

prefix : 수정되기 전입니다 
fixed : 수정이 되었습니다요 
```

## ✅ 커밋 메시지 형식

### 📎 커밋 메시지 타

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `style`: 코드 스타일 변경 (포매팅, 들여쓰기 등)
- `docs`: 문서 수정 (README 등)
- `chore`: 빌드, 패키지 업데이트 등

### 📎 커밋 메시지 예시

```bash
git commit -m "feat: 회원가입 API 추가"
git commit -m "fix: 로그인 시 JWT 토큰 검증 오류 해결"
git commit -m "docs: README 업데이트"
```