# 셸리 이벤트 (Shelley Retreat) 앱 기획안

## 1. 프로젝트 개요
'셸리 이벤트'는 시니어 사용자를 위한 예술 및 심리 치유(포토테라피) 목적의 웹/모바일 앱입니다. 사용자가 직접 찍은 사진에 글을 쓰고, 배경 음악을 곁들여 자신의 목소리로 낭송하고 녹음할 수 있는 기능을 제공합니다.

## 2. 디자인 및 UX/UI 가이드라인
*   **시니어 맞춤형 접근성**: 
    *   글씨 크기를 큼직하게 (최소 18px 이상 기본 사용).
    *   명확하고 큰 버튼 (최소 터치 영역 48x48px 이상 보장).
    *   높은 명도 대비를 사용하여 가독성 강화.
*   **선형적 플로우 (Linear Flow)**:
    *   복잡한 내비게이션 없이 화면 아래의 '다음 단계' 버튼을 통해 순차적으로 경험을 진행.
    *   현재 단계를 쉽게 인지할 수 있는 프로그래스 바(Progress Bar) 제공.

## 3. 핵심 플로우 (4단계)
*   **[Step 1] 사진 업로드**: 기기 카메라를 실행하거나 갤러리에서 사진을 불러옵니다.
*   **[Step 2] 텍스트 작성**: 업로드된 사진 위에 오버레이로 글(시, 편지 등)을 작성합니다. 글씨 가독성을 위해 사진 배경을 살짝 어둡게 (dim처리) 합니다.
*   **[Step 3] 음악 선택**: 
    *   기본 테마 버튼: [피아노], [자연의 소리], [어쿠스틱 기타]
    *   직접 업로드: [나만의 음악 불러오기(MP3)]
    *   AI 작곡 링크 제공: Suno, Udio, Soundraw를 통해 외부에서 음악 생성 유도.
*   **[Step 4] 감상 및 녹음**: 화면에 꽉 찬 사진+글을 감상하며 배경음악이 잔잔하게 흐릅니다. [낭송 녹음 시작] 버튼으로 목소리를 녹음하고, 완료 시 모든 정보를 Supabase에 저장합니다.

## 4. 기술 스택
*   **Frontend**: Next.js (App Router), React, TypeScript, Vanilla CSS (시각적 일관성 제어)
*   **Backend / BaaS**: Supabase (PostgreSQL, Storage)
*   **Media**: Web Audio API, MediaRecorder API (오디오 재생 및 녹음)

## 5. Supabase 데이터베이스 스키마 및 스토리지 설정
### 데이터베이스 테이블 (Database Tables)
#### `works` (작품 테이블)
*   `id`: UUID (Primary Key)
*   `user_id`: UUID (Foreign Key - auth.users, optional / 익명 사용 가능 시 nullable)
*   `image_url`: Text (업로드된 사진 URL)
*   `content_text`: Text (작성한 글 내용)
*   `bgm_url`: Text (업로드 또는 선택한 배경음악 URL)
*   `voice_record_url`: Text (녹음된 낭송 파일 URL)
*   `created_at`: Timestamp (생성일)

### 스토리지 버킷 (Storage Buckets)
*   `images`: 사용자가 업로드한 사진 파일 저장 (`public` 권한)
*   `bgm`: 사용자가 업로드한 자체 MP3 파일 저장 (`public` 권한)
*   `records`: 사용자가 최종 녹음한 목소리 파일 저장 (`public` 권한)

## 6. 보안 규칙 (RLS - Row Level Security)
초기에는 오픈 사용을 위해 테이블 및 스토리지 모두 읽기/쓰기 권한을 허용 (public policy)하거나, 사용자 인증을 적용할 경우 로그인한 사용자만 본인의 데이터에 접근하도록 RLS를 활성화해야 합니다.


