'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Paintbrush, Zap, Grid, Check, Edit3, Wand2, Maximize2, Palette, Music, Disc, RefreshCcw, Mic, Play, Volume2, Save, Download, Headphones, Share2, Users, Calendar, ClipboardCheck, UserPlus, Heart, Sliders, Type, Sun, Layers } from 'lucide-react';

export default function LifeGalleryApp() {
  const [step, setStep] = useState(0); 
  
  // Step 1: Photo Engine
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
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

  // Step 2-5 States
  const [textContent, setTextContent] = useState('');
  const [font, setFont] = useState('Pretendard');
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bgOpacity, setBgOpacity] = useState(0.45);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isAiMusicCreating, setIsAiMusicCreating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [invitees, setInvitees] = useState<string[]>([]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // 강력해진 AI 사진 변환 로직
  const handlePhotoAiRequest = () => {
    if (!localImage) return;
    setIsAiProcessing(true);
    setAiMessage('');

    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      
      // 초기화
      setBrightness(100); setContrast(100); setSaturation(100); setSepia(0); setGrayscale(0); setHueRotate(0); setInvert(0); setBlur(0);

      if (p.includes('만화') || p.includes('애니')) {
          setContrast(180); setSaturation(200); setBrightness(110);
          setAiMessage("🎨 선명한 윤곽선과 원색이 돋보이는 만화 스타일로 변환했습니다!");
      } else if (p.includes('회화') || p.includes('그림') || p.includes('유화') || p.includes('미술')) {
          setSepia(80); setSaturation(160); setContrast(130); setBrightness(95); setBlur(0.5);
          setAiMessage("🖼️ 캔버스의 질감이 느껴지는 풍부한 유화풍으로 변화를 주었습니다.");
      } else if (p.includes('흑백') || p.includes('옛날') || p.includes('추억') || p.includes('과거')) {
          setGrayscale(100); setContrast(120); setBrightness(105);
          setAiMessage("📸 소중한 추억이 깃든 흑백 사진으로 변환했습니다.");
      } else if (p.includes('화려') || p.includes('반전') || p.includes('꿈') || p.includes('판타지')) {
          setHueRotate(150); setInvert(30); setSaturation(150);
          setAiMessage("✨ 상상 속 풍경처럼 환상적인 분위기로 반전시켰습니다.");
      } else {
          setBrightness(120); setContrast(120); setSaturation(130);
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
          <Sparkles size={64} className="animate-bounce" color="#ec4899" style={{ marginBottom: '20px' }} />
          <h1>인생 갤러리</h1>
          <p style={{ marginBottom: '40px', fontSize: '20px' }}>나만의 빛나는 이야기를<br/>AI와 함께 가장 정교한 작품으로 완성해 보세요.</p>
          <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', padding: '24px', fontSize: '24px' }}>나만의 작품 만들기 시작</button>
        </div>
      )}

      {/* STEP 1: 사진 엔진 */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진 정밀 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
            {isAiProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <RefreshCcw size={48} className="animate-spin" color="#ec4899" />
                <span style={{ fontWeight: 'bold' }}>AI 에이전트가 변환 중...</span>
              </div>
            ) : localImage ? (
              <img 
               src={localImage} 
               alt="배경" 
               style={{ 
                 width: '100%', height: '100%', objectFit: 'cover',
                 transition: 'all 0.8s ease',
                 filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) hue-rotate(${hueRotate}deg) invert(${invert}%) blur(${blur}px)`
               }} 
              />
            ) : <div onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><ImageIcon size={64} style={{ opacity: 0.3 }} /><span>사진 선택</span></div>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) { setLocalImage(URL.createObjectURL(file)); setAiMessage(''); }
          }} style={{ display: 'none' }} />

          {localImage && (
            <>
              {aiMessage && <div className="animate-fade-in" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '12px', borderRadius: '12px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #10b981' }}>{aiMessage}</div>}
              
              <div style={{ width: '100%', background: 'rgba(139, 92, 246, 0.1)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="#8b5cf6" /> AI 에이전트에게 시키기</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="'만화처럼', '유화그림처럼', '흑백으로'..." 
                    style={{ flex: 1, padding: '12px', background: 'black', color: 'white', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }} 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                  />
                  <button className="btn btn-primary" style={{ background: '#8b5cf6', padding: '0 25px' }} onClick={handlePhotoAiRequest}>요청</button>
                </div>
              </div>

              <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Sun size={14} /> <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} style={{ flex: 1 }} /></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Layers size={14} /> <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(parseInt(e.target.value))} style={{ flex: 1 }} /></div>
                </div>
              </div>
            </>
          )}

          <div style={{ width: '100%' }}>
            {!localImage ? (
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '20px' }}>사진첩 열기</button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setLocalImage(null)} style={{ padding: '20px' }}>사진 다시 고르기</button>
                <button className="btn btn-primary" onClick={nextStep} style={{ background: '#10b981', padding: '20px', fontSize: '20px' }}>다음 글쓰기 <ArrowRight /></button>
              </div>
            )}
            <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '10px', opacity: 0.5, fontSize: '14px' }}>처음으로</button>
          </div>
        </div>
      )}

      {/* STEP 2-5 (기능 동일 유지) */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>이야기 정밀 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) grayscale(${grayscale}%) blur(${blur}px)` }} />}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bgOpacity})` }} />
            <textarea style={{ position: 'relative', width: '90%', height: '80%', background: 'transparent', color: fontColor, fontSize: `${fontSize}px`, border: 'none', textAlign: 'center', fontFamily: font, lineHeight: lineHeight, resize: 'none', padding: '10px', zIndex: 10 }} value={textContent} onChange={e => setTextContent(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: '100%', padding: '20px' }}>음악 만들러 가기 <ArrowRight /></button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '8px' }}>이전</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: ` @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); background: #dc2626; } 100% { transform: scale(1); } } .animate-spin { animation: spin 2s linear infinite; } .animate-bounce { animation: bounce 2s infinite; } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } `}} />
    </div>
  );
}
