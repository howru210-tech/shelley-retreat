'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LifeGalleryApp() {
  const [step, setStep] = useState(0); 
  
  // Step 1 State (이미지 업로드)
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 State
  const [textContent, setTextContent] = useState('');
  const [font, setFont] = useState('Pretendard');
  const [voiceTone, setVoiceTone] = useState<string | null>(null);

  // Step 3 State
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);

  // Step 4 State
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // STEP 1: 사진 업로드 및 Supabase 저장
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // 1. 화면에 바로 보일 수 있도록 로컬 미리보기 생성
      const localUrl = URL.createObjectURL(file);
      setLocalImage(localUrl);
      
      // 2. Supabase Storage (images 버킷)에 실제 업로드
      setIsUploading(true);
      
      // 확장자가 한글이거나 없는 경우를 대비하여, 안전하게 파일 타입(MIME)에서 확장자를 강제 추출합니다.
      const mimeType = file.type || 'image/jpeg';
      const fileExt = mimeType.split('/')[1] || 'jpg'; // 'image/png' -> 'png'
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // (중요) 한글 파일명 헤더 에러 방지: 안전하게 추출된 영문 이름으로 새 백업 파일을 만듭니다.
      const safeFile = new File([file], fileName, { type: file.type });

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, safeFile);

      if (uploadError) {
        console.error('업로드 실패:', uploadError);
        alert(`사진 업로드 실패: ${uploadError.message}\n(${uploadError.name})`);
        setLocalImage(null);
      } else {
        // 3. 업로드 성공 시 Public URL 가져와서 상태에 저장 (나중에 DB 저장 시 사용)
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        setUploadedImageUrl(data.publicUrl);
      }
      
      setIsUploading(false);
    }
  };

  return (
    <div className="animate-fade-in container">
      {step > 0 && (
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`} />
        </div>
      )}

      {/* 랜딩 페이지 (Step 0) */}
      {step === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Sparkles size={64} color="#ec4899" />
          </div>
          <h1>인생 갤러리</h1>
          <p style={{ marginBottom: '40px' }}>
            사진만 고르시면 나머지는 AI가 알아서 해드립니다.<br/><br/>
            당신의 빛나는 인생 이야기를<br/>아름다운 작품으로 만들어보세요.
          </p>
          <button className="btn btn-primary" onClick={nextStep}>
            <Sparkles size={24} /> 시작하기
          </button>
        </div>
      )}

      {/* STEP 1: 사진 업로드 */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>추억의 사진 고르기</h1>
          <p style={{ textAlign: 'center', marginBottom: '30px' }}>
            앨범에서 가장 마음에 드는<br/>사진 1장을 선택해 주세요.
          </p>

          <div 
            className={`montage-item ${!localImage ? 'empty' : ''}`} 
            style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer' }}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '20px' }}>사진을 안전하게 보관 중입니다...</span>
              </div>
            ) : localImage ? (
              <img src={localImage} alt="선택된 사진" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <ImageIcon size={48} />
                <span>여기를 눌러 사진 선택</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />

          {!localImage ? (
             <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
               <Camera size={24} /> 내 사진첩 열기
             </button>
          ) : !isUploading && (
             <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
               <ImageIcon size={24} /> 🔄 다른 사진 고르기
             </button>
          )}

          {uploadedImageUrl && (
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              이 사진으로 할게요! (다음) <ArrowRight size={24} />
            </button>
          )}

          <button className="btn btn-secondary" onClick={() => { setLocalImage(null); setUploadedImageUrl(null); setStep(0); }}>
            <ArrowLeft size={24} /> 처음으로 돌아가기
          </button>
        </div>
      )}

      {/* STEP 2: 텍스트 입력 및 화면 구성 */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진에 이야기 더하기</h1>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            이 사진을 보면 어떤 생각이 드시나요?<br/>떠오르는 이야기를 편하게 적어보세요.
          </p>

          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />}
            {/* 시인성 확보를 위한 반투명 배경 무지개 그라데이션 오버레이 */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
            
            <textarea
              style={{
                position: 'relative',
                width: '90%',
                height: '80%',
                background: 'transparent',
                color: 'white',
                fontSize: '28px',
                border: '2px dashed rgba(255,255,255,0.4)',
                borderRadius: '16px',
                textAlign: 'center',
                fontFamily: font,
                resize: 'none',
                padding: '20px',
                zIndex: 10
              }}
              placeholder="여기를 눌러 글을 쓰세요..."
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
            />
          </div>
          
          <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>글씨체 변경</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <button className={`btn ${font === 'Pretendard' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '16px', fontSize: '20px', flex: 1 }} onClick={() => setFont('Pretendard')}>
              기본(또박또박)
            </button>
            <button className={`btn ${font === 'Nanum Myeongjo' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '16px', fontSize: '20px', fontFamily: "'Nanum Myeongjo', serif", flex: 1 }} onClick={() => setFont('Nanum Myeongjo')}>
              감성(우아하게)
            </button>
          </div>

          <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            다 썼습니다! (다음) <ArrowRight size={24} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={24} /> 사진 다시 고르기
          </button>
        </div>
      )}

      {/* STEP 3: 음악 선택 */}
      {step === 3 && (
        <div className="glass-panel animate-fade-in">
          <h1>배경 음악 고르기</h1>
          <p style={{ textAlign: 'center', marginBottom: '30px' }}>
            작품에 어울리는 분위기의 음악을<br/>아래에서 하나 골라주세요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            {[
              { id: 'piano', name: '🎹 부드러운 피아노' },
              { id: 'nature', name: '🌿 평화로운 자연의 소리' },
              { id: 'acoustic', name: '🎸 경쾌한 어쿠스틱 기타' }
            ].map(music => (
              <button 
                key={music.id}
                className={`btn ${selectedMusic === music.name ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ padding: '24px', fontSize: '22px' }}
                onClick={() => setSelectedMusic(music.name)}
              >
                {music.name}
              </button>
            ))}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={nextStep} 
            disabled={!selectedMusic}
            style={{ background: selectedMusic ? 'linear-gradient(135deg, #10b981, #059669)' : 'gray' }}
          >
            이 음악이 좋네요! (다음) <ArrowRight size={24} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={24} /> 글 다시 쓰기
          </button>
        </div>
      )}

      {/* STEP 4: 발표(감상) 및 저장 */}
      {step === 4 && (
        <div className="glass-panel animate-fade-in">
          <h1>나의 인생 갤러리 작품</h1>
          <p style={{ textAlign: 'center', marginBottom: '20px' }}>
            완성된 작품입니다. 목소리로 낭송해 볼까요?
          </p>

          {/* 완성된 작품 프리뷰 */}
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{ 
              position: 'relative', 
              zIndex: 10, 
              color: 'white', 
              fontFamily: font, 
              fontSize: '28px', 
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              {textContent || '[작성된 글이 없습니다]'}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
            {isRecording ? (
               <button className="btn" style={{ background: '#ef4444', color: 'white', animation: 'pulse 1s infinite' }} onClick={() => { setIsRecording(false); setHasRecorded(true); setRecordedVoiceUrl('mock_voice_url'); }}>
                 🛑 지금 녹음 중입니다... (누르면 정지)
               </button>
            ) : hasRecorded ? (
               <button className="btn btn-secondary" onClick={() => { setIsRecording(true); setHasRecorded(false); }}>
                 🔄 목소리 다시 녹음하기
               </button>
            ) : (
               <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={() => setIsRecording(true)}>
                 🔴 내 목소리로 낭송 녹음하기
               </button>
            )}
            {selectedMusic && <div style={{ marginTop: '10px', fontSize: '18px', color: '#10b981' }}>♪ 배경음악: {selectedMusic}</div>}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ padding: '24px', fontSize: '24px', background: 'linear-gradient(45deg, #8b5cf6, #ec4899)' }} 
            disabled={isSaving} 
            onClick={async () => {
             setIsSaving(true);
             const { error } = await supabase.from('works').insert([{
                 image_url: uploadedImageUrl,
                 content_text: textContent,
                 bgm_url: selectedMusic,
                 voice_record_url: recordedVoiceUrl // 임시
             }]);
             setIsSaving(false);
             
             if (error) {
                 console.error("저장 에러:", error);
                 alert("작품 저장에 실패했습니다.");
             } else {
                 alert("나의 인생 갤러리에 아름답게 전시되었습니다! 🎉");
                 setStep(0); // 완료 후 처음으로 돌아가기
             }
          }}>
            <Sparkles size={28} /> {isSaving ? '전시관에 등록하는 중...' : '작품 완성하고 저장하기!'}
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={24} /> 음악 다시 고르기
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); background: #dc2626; }
          100% { transform: scale(1); }
        }
      `}} />
    </div>
  );
}
