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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Writing Engine
  const [writingMode, setWritingMode] = useState<'manual' | 'ai' | null>(null);
  const [textContent, setTextContent] = useState('');
  const [font, setFont] = useState('Pretendard');
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [bgOpacity, setBgOpacity] = useState(0.45);
  const [isAiWriting, setIsAiWriting] = useState(false);

  // Step 3: Music Engine
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isAiMusicCreating, setIsAiMusicCreating] = useState(false);
  const [musicTempo, setMusicTempo] = useState(100);
  const [musicVolume, setMusicVolume] = useState(80);

  // Step 4: Voice Engine
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Step 5: Stage Manager
  const [invitees, setInvitees] = useState<string[]>([]);
  const [checklist, setChecklist] = useState({ schedule: false, stage: false, vendor: false, outfit: false });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handlePhotoAiRequest = () => {
    if (!localImage) return;
    setIsAiProcessing(true);
    // AI 에이전트 시뮬레이션: 1.5초 후 효과 적용
    setTimeout(() => {
      setBrightness(110); setContrast(120); setSaturation(115);
      setIsAiProcessing(false);
      alert("AI 에이전트가 사진을 더 아름답게 보정했습니다!");
    }, 1500);
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

      {/* STEP 1: 사진 엔진 (통합 요청 UI) */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진 정밀 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
            {isAiProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <RefreshCcw size={48} className="animate-spin" color="#ec4899" />
                <span style={{ fontWeight: 'bold' }}>AI 에이전트가 작업 중입니다...</span>
              </div>
            ) : localImage ? (
              <img 
               src={localImage} 
               alt="배경" 
               style={{ 
                 width: '100%', height: '100%', objectFit: 'cover',
                 filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
               }} 
              />
            ) : <div onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><ImageIcon size={64} style={{ opacity: 0.3 }} /><span>사진 선택</span></div>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) { setLocalImage(URL.createObjectURL(file)); }
          }} style={{ display: 'none' }} />

          {localImage && (
            <>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px' }}><Sliders size={18} /> 정밀 보정 도구</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Sun size={16} /> <input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} style={{ flex: 1 }} /><span>밝기</span></div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><Layers size={16} /> <input type="range" min="50" max="150" value={contrast} onChange={e => setContrast(parseInt(e.target.value))} style={{ flex: 1 }} /><span>대비</span></div>
                </div>
              </div>

              {/* 통합된 AI 요청 UI */}
              <div style={{ width: '100%', background: 'rgba(139, 92, 246, 0.1)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="#8b5cf6" /> AI 에이전트 요청</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="더 고치고 싶은 점을 적어주세요..." 
                    style={{ flex: 1, padding: '12px', background: 'black', color: 'white', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)' }} 
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ background: '#8b5cf6', padding: '0 25px' }} 
                    onClick={handlePhotoAiRequest}
                  >
                    요청
                  </button>
                </div>
              </div>
            </>
          )}

          <div style={{ width: '100%' }}>
            {!localImage ? (
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '20px' }}>사진첩 열기</button>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={prevStep} style={{ padding: '20px' }}>이전</button>
                <button className="btn btn-primary" onClick={nextStep} style={{ background: '#10b981', padding: '20px', fontSize: '20px' }}>다음 글쓰기 <ArrowRight /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: 글쓰기 엔진 */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>이야기 정밀 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }} />}
            <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${bgOpacity})` }} />
            <textarea style={{ position: 'relative', width: '90%', height: '80%', background: 'transparent', color: fontColor, fontSize: `${fontSize}px`, border: 'none', textAlign: 'center', fontFamily: font, lineHeight: lineHeight, resize: 'none', padding: '10px', zIndex: 10 }} value={textContent} onChange={e => setTextContent(e.target.value)} />
          </div>

          <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>크기</span><input type="range" min="20" max="60" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} style={{ flex: 1 }} /></div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><span>투명</span><input type="range" min="0" max="0.9" step="0.05" value={bgOpacity} onChange={e => setBgOpacity(parseFloat(e.target.value))} style={{ flex: 1 }} /></div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: '100%', padding: '20px' }}>음악 만들러 가기 <ArrowRight /></button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '8px' }}>이전</button>
        </div>
      )}

      {/* STEP 3: 음악 엔진 */}
      {step === 3 && (
        <div className="glass-panel animate-fade-in">
          <h1>음악 정밀 다듬기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '16/9', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Music size={50} color={selectedMusic ? "#10b981" : "#666"} className={isAiMusicCreating ? "animate-spin" : ""} />
              <div style={{ marginTop: '10px', fontWeight: 'bold' }}>{selectedMusic || "음악을 선택하거나 만들어주세요"}</div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ background: '#8b5cf6', width: '100%', padding: '20px' }} onClick={() => { setIsAiMusicCreating(true); setTimeout(() => { setSelectedMusic("🎻 AI 맞춤 전용 선율"); setIsAiMusicCreating(false); }, 1500); }}>AI 작곡 요청</button>
          <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: '100%', padding: '22px', marginTop: '10px' }}>다음 목소리</button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '10px' }}>이전</button>
        </div>
      )}

      {/* STEP 4: 목소리 엔진 */}
      {step === 4 && (
        <div className="glass-panel animate-fade-in">
          <h1>목소리 정밀 다듬기</h1>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '24px', width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
              <button className="btn" style={{ background: isRecording ? '#dc2626' : '#ef4444', width: '70px', height: '70px', borderRadius: '50%' }} onClick={() => { setIsRecording(!isRecording); if (isRecording) setRecordedVoiceUrl('m'); }}>
                {isRecording ? <div style={{ width: '15px', height: '15px', background: 'white', margin: 'auto' }} /> : <Mic color="white" />}
              </button>
              {recordedVoiceUrl && <button className="btn" style={{ background: '#3b82f6', width: '70px', height: '70px', borderRadius: '50%' }} onClick={() => setIsPlaying(!isPlaying)}><Play color="white" fill="white" /></button>}
            </div>
          </div>
          <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', width: '100%', padding: '24px' }}>발표 마무리 <ArrowRight /></button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '10px' }}>이전</button>
        </div>
      )}

      {/* STEP 5: 스테이지 매니저 */}
      {step === 5 && (
        <div className="glass-panel animate-fade-in">
          <h1>나의 무대 매니저</h1>
          <button className="btn btn-primary" style={{ padding: '24px', fontSize: '24px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', width: '100%' }} onClick={() => { alert('축하합니다! 무대가 완벽하게 준비되었습니다.'); setStep(0); }}>
            최종 무대 시작하기! <Heart fill="currentColor" />
          </button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', marginTop: '10px' }}>이전</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: ` @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); background: #dc2626; } 100% { transform: scale(1); } } .animate-spin { animation: spin 2s linear infinite; } .animate-bounce { animation: bounce 2s infinite; } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } `}} />
    </div>
  );
}
