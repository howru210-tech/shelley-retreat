'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Paintbrush, Zap, Grid, Check, Edit3, Wand2, Maximize2, Palette, Music, Disc, RefreshCcw, Mic, Play, Volume2, Save, Download, Headphones, Share2, Users, Calendar, ClipboardCheck, UserPlus, Heart, Sliders, Type, Sun, Layers, RotateCcw } from 'lucide-react';

export default function LifeGalleryApp() {
  const [step, setStep] = useState(0); 
  
  // Step 1: Photo Engine
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // 필터 상태 (훨씬 더 강력하게 조정)
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [blur, setBlur] = useState(0);
  const [aiMessage, setAiMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Writing Engine
  const [textContent, setTextContent] = useState('');
  const [font, setFont] = useState('Pretendard');
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bgOpacity, setBgOpacity] = useState(0.45);

  // Step 3: Music Engine
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isAiMusicCreating, setIsAiMusicCreating] = useState(false);

  // Step 4: Voice Engine
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  // Step 5: Stage Manager
  const [invitees, setInvitees] = useState<string[]>([]);
  const [checklist, setChecklist] = useState({ schedule: false, stage: false, vendor: false, outfit: false });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // AI 사진 처방 시스템 (눈에 확 띄게 강화)
  const applyAiStyle = (style: string, promptText: string) => {
    setAiPrompt(promptText);
    setIsAiProcessing(true);
    setAiMessage('');

    setTimeout(() => {
      setBrightness(100); setContrast(100); setSaturation(100); setSepia(0); setGrayscale(0); setHueRotate(0); setInvert(0); setBlur(0);
      switch(style) {
        case 'cartoon':
          setContrast(220); setSaturation(250); setBrightness(115);
          setAiMessage("🎨 AI가 사진을 선명한 만화 풍으로 변신시켰습니다!");
          break;
        case 'painting':
          setSepia(100); setSaturation(180); setContrast(150); setBrightness(90); setBlur(1);
          setAiMessage("🖼️ AI가 예술적 감성을 담아 유화 느낌을 더했습니다.");
          break;
        case 'vintage':
          setGrayscale(100); setContrast(140); setBrightness(110);
          setAiMessage("📸 세월의 깊이가 느껴지는 명품 흑백 사진으로 바꿨습니다.");
          break;
        case 'dreamy':
          setHueRotate(180); setSaturation(160); setInvert(10);
          setAiMessage("✨ 환상적인 꿈속의 한 장면처럼 신비로움을 더했습니다.");
          break;
        default:
          setBrightness(120); setContrast(120); setSaturation(140);
          setAiMessage("🌟 사진을 훨씬 더 선명하고 생동감 있게 보정했습니다.");
      }
      setIsAiProcessing(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in container">
      {step > 0 && <div className="step-indicator">{[1,2,3,4,5].map(s => <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />)}</div>}

      {/* 랜딩 (Step 0) */}
      {step === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <Sparkles size={80} className="animate-bounce" color="#ec4899" style={{ marginBottom: '20px' }} />
          <h1>인생 갤러리</h1>
          <p style={{ marginBottom: '40px', fontSize: '22px' }}>나의 소중한 빛나는 이야기<br/>AI와 함께 예술 작품으로 만들어 보세요.</p>
          <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', padding: '26px', fontSize: '26px' }}>나만의 작품 만들기 시작</button>
        </div>
      )}

      {/* STEP 1: 사진 엔진 */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>추억의 사진 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative', border: '2px dashed rgba(255,255,255,0.2)' }}>
            {isAiProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <RefreshCcw size={64} className="animate-spin" color="#ec4899" />
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>AI가 당신의 사진을 예술로 만드는 중...</span>
              </div>
            ) : localImage ? (
              <img 
               src={localImage} 
               alt="배경" 
               style={{ 
                 width: '100%', height: '100%', objectFit: 'cover',
                 transition: 'all 1s ease',
                 filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) blur(${blur}px)`
               }} 
              />
            ) : <div onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}><ImageIcon size={80} style={{ opacity: 0.2, marginBottom: '20px' }} /><span style={{ fontSize: '18px' }}>터치하여 사진을 선택하세요</span></div>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) { setLocalImage(URL.createObjectURL(file)); setAiMessage(''); }
          }} style={{ display: 'none' }} />

          {localImage && (
            <>
              {aiMessage && <div className="animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '16px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #10b981', fontSize: '18px' }}>{aiMessage}</div>}
              
              <div style={{ width: '100%', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={20} color="#8b5cf6" /> AI 추천 스타일</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ background: 'rgba(139, 92, 246, 0.1)' }} onClick={() => applyAiStyle('cartoon', '만화처럼 변신')}>만화 속 주인공</button>
                  <button className="btn btn-secondary" style={{ background: 'rgba(139, 92, 246, 0.1)' }} onClick={() => applyAiStyle('painting', '유화그림처럼')}>명화 같은 유화</button>
                  <button className="btn btn-secondary" style={{ background: 'rgba(139, 92, 246, 0.1)' }} onClick={() => applyAiStyle('vintage', '옛날 흑백사진')}>품격 있는 흑백</button>
                  <button className="btn btn-secondary" style={{ background: 'rgba(139, 92, 246, 0.1)' }} onClick={() => applyAiStyle('dreamy', '환상적인 분위기')}>신비로운 꿈속</button>
                </div>
              </div>

              <div style={{ width: '100%', background: 'rgba(139, 92, 246, 0.08)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="예: '더 화사하게', '색감을 진하게'..." style={{ flex: 1, padding: '16px', background: 'black', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                  <button className="btn btn-primary" style={{ background: '#8b5cf6', padding: '0 30px' }} onClick={() => applyAiStyle('custom', aiPrompt)}>요청</button>
                </div>
              </div>
            </>
          )}

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!localImage ? <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ padding: '24px', fontSize: '24px' }}><Camera /> 사진 선택하기</button> : (
              <>
                <button className="btn btn-primary" onClick={nextStep} style={{ background: '#10b981', padding: '26px', fontSize: '26px' }}>다음: 글쓰기 <ArrowRight /></button>
                <button className="btn btn-secondary" onClick={() => { setLocalImage(null); setAiMessage(''); }} style={{ padding: '20px' }}>사진 다시 고르기</button>
              </>
            )}
            <button className="btn btn-secondary" onClick={prevStep} style={{ opacity: 0.4, fontSize: '13px' }}>첫 페이지로</button>
          </div>
        </div>
      )}

      {/* STEP 2: 글쓰기 엔진 */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진에 이야기 담기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)` }} />}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bgOpacity})` }} />
            <textarea style={{ position: 'relative', width: '90%', height: '80%', background: 'transparent', color: fontColor, fontSize: `${fontSize}px`, border: 'none', textAlign: 'center', fontFamily: font, lineHeight: lineHeight, resize: 'none', padding: '20px', zIndex: 10 }} value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="이날의 소중한 기억을 한 문장으로 적어보세요..." />
          </div>
          <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}><span>글자 크기</span> <input type="range" min="20" max="60" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} style={{ width: '100%' }} /></div>
              <div style={{ flex: 1 }}><span>배경 선명도</span> <input type="range" min="0.1" max="0.9" step="0.1" value={bgOpacity} onChange={e => setBgOpacity(parseFloat(e.target.value))} style={{ width: '100%', direction: 'rtl' }} /></div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', fontSize: '24px' }}>다음: 음악 선택</button>
            <button className="btn btn-secondary" onClick={prevStep} style={{ padding: '20px' }}>이전 (사진 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 3: 음악 엔진 */}
      {step === 3 && (
        <div className="glass-panel animate-fade-in">
          <h1>배경 음악 넣기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '16/9', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAiMusicCreating ? <RefreshCcw size={64} className="animate-spin" color="#ec4899" /> : selectedMusic ? <div style={{ textAlign: 'center' }}><Music size={60} color="#10b981" /> <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginTop: '15px' }}>{selectedMusic}</div></div> : <Disc size={60} style={{ opacity: 0.2 }} />}
          </div>
          <button className="btn btn-primary" style={{ background: '#8b5cf6', width: '100%', padding: '24px', fontSize: '22px' }} onClick={() => { setIsAiMusicCreating(true); setTimeout(() => { setSelectedMusic("🎻 AI 맞춤 전용 선율"); setIsAiMusicCreating(false); }, 1500); }}>AI에게 작곡 부탁하기</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', fontSize: '24px' }}>다음: 목소리 녹음</button>
            <button className="btn btn-secondary" onClick={prevStep} style={{ padding: '20px' }}>이전 (글 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 4: 목소리 엔진 (빠진 부분 복구!) */}
      {step === 4 && (
        <div className="glass-panel animate-fade-in">
          <h1>목소리로 낭송하기</h1>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '30px', width: '100%', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px' }}>
              <button className="btn" style={{ background: isRecording ? '#dc2626' : '#ef4444', width: '100px', height: '100px', borderRadius: '50%', boxShadow: isRecording ? '0 0 20px #ef4444' : 'none' }} onClick={() => { setIsRecording(!isRecording); if (isRecording) setRecordedVoiceUrl('m'); }}>
                {isRecording ? <div style={{ width: '30px', height: '30px', background: 'white', margin: 'auto' }} /> : <Mic size={48} color="white" />}
              </button>
              {recordedVoiceUrl && <button className="btn" style={{ background: '#3b82f6', width: '100px', height: '100px', borderRadius: '50%' }} onClick={() => setIsPlaying(!isPlaying)}><Play size={48} color="white" fill="white" /></button>}
            </div>
            <div style={{ fontSize: '18px', opacity: 0.8 }}>{isRecording ? "목소리를 녹음하고 있습니다..." : recordedVoiceUrl ? "녹음이 완료되었습니다. 들어보세요." : "빨간 단추를 눌러 녹음을 하세요."}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button className="btn btn-primary" style={{ background: '#8b5cf6', padding: '24px', fontSize: '20px' }} onClick={() => { setIsTransforming(true); setTimeout(() => { setIsTransforming(false); alert('AI가 목소리를 예술적으로 정화했습니다!'); }, 1500); }}>AI 목소리 변환 (더 아름답게)</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', padding: '26px', fontSize: '26px' }}>최종 발표 준비</button>
            <button className="btn btn-secondary" onClick={prevStep} style={{ padding: '20px' }}>이전 (음악 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 5: 스테이지 매니저 (빠진 부분 복구!) */}
      {step === 5 && (
        <div className="glass-panel animate-fade-in">
          <h1>나만의 무대 매니저</h1>
          <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '18px' }}>축하합니다! 작품이 준비되었습니다.<br/>이제 화려한 데뷔만 남았어요.</p>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '24px', marginBottom: '30px', width: '100%' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}><ClipboardCheck color="#10b981" /> 무대 데뷔 체크리스트</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['일정 계획', '무대 준비', '의상/메이크업', '초대 손님'].map(item => (
                <button key={item} className="btn" style={{ background: 'rgba(255,255,255,0.1)', justifyContent: 'flex-start', fontSize: '15px' }}><Check size={16} /> {item}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{ padding: '30px', fontSize: '28px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', width: '100%' }} onClick={() => { alert('당신의 화려한 시작을 응원합니다! ✨'); setStep(0); }}>
            최종 무대 시작하기! <Heart fill="currentColor" size={32} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '15px' }}>이전 (목소리 수정)</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: ` @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); background: #dc2626; } 100% { transform: scale(1); } } .animate-spin { animation: spin 2s linear infinite; } .animate-bounce { animation: bounce 2s infinite; } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } `}} />
    </div>
  );
}
