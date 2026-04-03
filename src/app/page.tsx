'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Paintbrush, Zap, Grid, Check, Edit3, Wand2, Maximize2, Palette, Music, Disc, RefreshCcw, Mic, Play, Volume2, Save, Download, Headphones, Share2, Users, Calendar, ClipboardCheck, UserPlus, Heart, Sliders, Type, Sun, Layers, RotateCcw } from 'lucide-react';

export default function LifeGalleryApp() {
  const [step, setStep] = useState(0); 
  
  // Step 1: Photo Engine
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessage, setAiMessage] = useState('');

  // 필터 상태
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [blur, setBlur] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Writing Engine
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(28);
  const [bgOpacity, setBgOpacity] = useState(0.45);

  // Step 3: Music Engine
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isAiMusicCreating, setIsAiMusicCreating] = useState(false);

  // Step 4: Voice Engine
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Step 5: Stage Manager
  const [checklist, setChecklist] = useState({ schedule: false, stage: false, vendor: false, outfit: false });

  // 단계 이동 함수 (더욱 명시적으로 수정)
  const goToStep = (targetStep: number) => {
    setStep(targetStep);
    window.scrollTo(0, 0); // 화면 최상단으로 이동
  };

  const applyAiStyle = (style: string, promptText: string) => {
    setAiPrompt(promptText);
    setIsAiProcessing(true);
    setAiMessage('');
    setTimeout(() => {
      setBrightness(100); setContrast(100); setSaturation(100); setSepia(0); setGrayscale(0); setHueRotate(0); setInvert(0); setBlur(0);
      switch(style) {
        case 'cartoon': setContrast(220); setSaturation(250); setBrightness(115); setAiMessage("🎨 AI 만화 스타일로 변신!"); break;
        case 'painting': setSepia(100); setSaturation(180); setContrast(150); setBrightness(90); setBlur(1); setAiMessage("🖼️ AI 정통 유화 스타일로 변신!"); break;
        case 'vintage': setGrayscale(100); setContrast(140); setBrightness(110); setAiMessage("📸 고귀한 흑백 명품 사진으로 변신!"); break;
        case 'dreamy': setHueRotate(180); setSaturation(160); setInvert(10); setAiMessage("✨ 신비로운 꿈속 분위기로 변신!"); break;
        default: setBrightness(120); setContrast(120); setSaturation(140); setAiMessage("🌟 사진 보정이 완료되었습니다!");
      }
      setIsAiProcessing(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in container">
      {step > 0 && <div className="step-indicator">{[1,2,3,4,5].map(s => <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />)}</div>}

      {/* STEP 0: Landing (Start) */}
      {step === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <Sparkles size={80} className="animate-bounce" color="#ec4899" style={{ marginBottom: '20px' }} />
          <h1>인생 갤러리</h1>
          <p style={{ marginBottom: '40px', fontSize: '22px' }}>빛나는 당신의 이야기<br/>AI와 함께 예술로 피어납니다.</p>
          <button className="btn btn-primary" onClick={() => goToStep(1)} style={{ width: '100%', padding: '26px', fontSize: '26px' }}>나만의 작품 만들기 시작</button>
        </div>
      )}

      {/* STEP 1: Photo Engine (Photo Edit) */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>추억의 사진 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative', border: '2px dashed rgba(255,255,255,0.2)' }}>
            {isAiProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}><RefreshCcw size={64} className="animate-spin" color="#ec4899" /><span style={{ fontSize: '20px', fontWeight: 'bold' }}>AI가 작업 중...</span></div>
            ) : localImage ? (
              <img src={localImage} alt="배경" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 1s ease', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) blur(${blur}px)` }} />
            ) : (
              <div onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}><ImageIcon size={80} style={{ opacity: 0.2, marginBottom: '20px' }} /><span style={{ fontSize: '18px' }}>사진첩에서 사진을 선택하세요</span></div>
            )}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) { setLocalImage(URL.createObjectURL(file)); setAiMessage(''); } }} style={{ display: 'none' }} />

          {localImage && (
            <>
              {aiMessage && <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '16px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #10b981', fontSize: '18px' }}>{aiMessage}</div>}
              <div style={{ width: '100%', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={20} color="#8b5cf6" /> AI 추천 스타일</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => applyAiStyle('cartoon', '만화')}>만화 속 주인공</button>
                  <button className="btn btn-secondary" onClick={() => applyAiStyle('painting', '유화')}>명화 같은 유화</button>
                  <button className="btn btn-secondary" onClick={() => applyAiStyle('vintage', '흑백')}>품격 있는 흑백</button>
                  <button className="btn btn-secondary" onClick={() => applyAiStyle('dreamy', '꿈속')}>신비로운 꿈속</button>
                </div>
              </div>
            </>
          )}

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!localImage ? (
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ padding: '24px', fontSize: '24px' }}><Camera /> 사진 선택하기</button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => goToStep(2)} style={{ background: '#10b981', padding: '26px', fontSize: '26px', fontWeight: 'bold' }}>다음: 글쓰기 <ArrowRight /></button>
                <button className="btn btn-secondary" onClick={() => { setLocalImage(null); setAiMessage(''); }} style={{ padding: '20px' }}>사진 다시 고르기</button>
              </>
            )}
            <button className="btn btn-secondary" onClick={() => goToStep(0)} style={{ opacity: 0.4, fontSize: '13px' }}>첫 페이지로</button>
          </div>
        </div>
      )}

      {/* STEP 2: Writing Engine */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진에 이야기 담기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)` }} />}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bgOpacity})` }} />
            <textarea style={{ position: 'relative', width: '90%', height: '80%', background: 'transparent', color: 'white', fontSize: `${fontSize}px`, border: 'none', textAlign: 'center', lineHeight: 1.5, resize: 'none', padding: '20px', zIndex: 10 }} value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="기억에 남는 문장을 적어보세요..." />
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => goToStep(3)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', fontSize: '24px' }}>다음: 음악 선택 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={() => goToStep(1)} style={{ padding: '20px' }}>이전 (사진 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 3: Music Engine */}
      {step === 3 && (
        <div className="glass-panel animate-fade-in">
          <h1>배경 음악 넣기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '16/9', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAiMusicCreating ? <RefreshCcw size={64} className="animate-spin" color="#ec4899" /> : selectedMusic ? <div style={{ textAlign: 'center' }}><Music size={60} color="#10b981" /> <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#10b981', marginTop: '15px' }}>{selectedMusic}</div></div> : <Disc size={60} style={{ opacity: 0.2 }} />}
          </div>
          <button className="btn btn-primary" style={{ background: '#8b5cf6', width: '100%', padding: '24px', fontSize: '22px' }} onClick={() => { setIsAiMusicCreating(true); setTimeout(() => { setSelectedMusic("🎻 AI 웰빙 선율"); setIsAiMusicCreating(false); }, 1500); }}>AI 작곡 의뢰</button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={() => goToStep(4)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '24px', fontSize: '24px' }}>다음: 목소리 녹음 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={() => goToStep(2)} style={{ padding: '20px' }}>이전 (글 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 4: Voice Engine */}
      {step === 4 && (
        <div className="glass-panel animate-fade-in">
          <h1>목소리로 낭송하기</h1>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '30px', width: '100%', textAlign: 'center', marginBottom: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px' }}>
                <button className="btn" style={{ background: isRecording ? '#dc2626' : '#ef4444', width: '100px', height: '100px', borderRadius: '50%' }} onClick={() => { setIsRecording(!isRecording); if (isRecording) setRecordedVoiceUrl('v'); }}>
                   {isRecording ? <div style={{ width: '30px', height: '30px', background: 'white', margin: 'auto' }} /> : <Mic size={48} color="white" />}
                </button>
                {recordedVoiceUrl && <button className="btn" style={{ background: '#3b82f6', width: '100px', height: '100px', borderRadius: '50%' }} onClick={() => setIsPlaying(!isPlaying)}><Play size={48} color="white" fill="white" /></button>}
             </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <button className="btn btn-primary" onClick={() => goToStep(5)} style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', padding: '26px', fontSize: '26px' }}>최종 무대 준비 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={() => goToStep(3)} style={{ padding: '20px' }}>이전 (음악 수정)</button>
          </div>
        </div>
      )}

      {/* STEP 5: Stage Manager */}
      {step === 5 && (
        <div className="glass-panel animate-fade-in text-center">
          <h1>나만의 무대 매니저</h1>
          <p style={{ marginBottom: '30px' }}>당신의 작품이 빛날 시간입니다.</p>
          <button className="btn btn-primary" style={{ padding: '30px', fontSize: '28px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', width: '100%' }} onClick={() => { alert('빛나는 데뷔 무대를 시작합니다! ✨'); goToStep(0); }}>
            무대 시작하기! <Heart fill="currentColor" size={32} />
          </button>
          <button className="btn btn-secondary" onClick={() => goToStep(4)} style={{ width: '100%', marginTop: '15px', padding: '20px' }}>이전 (목소리 수정)</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: ` @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); background: #dc2626; } 100% { transform: scale(1); } } .animate-spin { animation: spin 2s linear infinite; } .animate-bounce { animation: bounce 2s infinite; } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } `}} />
    </div>
  );
}
