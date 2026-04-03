'use client';

import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Paintbrush, Zap, Grid, Check, Edit3, Wand2, Maximize2, Palette, Music, Disc, RefreshCcw, Mic, Play, Volume2, Save, Download, Headphones, Share2, Users, Calendar, ClipboardCheck, UserPlus, Heart, MessageCircle } from 'lucide-react';

export default function LifeGalleryApp() {
  const [step, setStep] = useState(0); 
  
  // Step 1: Photo
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<'painting' | 'clarity' | 'collage' | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Writing
  const [writingMode, setWritingMode] = useState<'manual' | 'ai' | null>(null);
  const [textContent, setTextContent] = useState('');
  const [font, setFont] = useState('Pretendard');
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [isAiWriting, setIsAiWriting] = useState(false);

  // Step 3: Music
  const [musicMode, setMusicMode] = useState<'selection' | 'ai' | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isAiMusicCreating, setIsAiMusicCreating] = useState(false);

  // Step 4: Voice
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [selectedVoiceTone, setSelectedVoiceTone] = useState<'poetry' | 'grand' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Step 5: Stage Manager
  const [invitees, setInvitees] = useState<string[]>([]);
  const [checklist, setChecklist] = useState({ schedule: false, stage: false, vendor: false, outfit: false });
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  // AI & Utility functions
  const handleAiWriting = () => { setIsAiWriting(true); setWritingMode('ai'); setTimeout(() => { setTextContent("가장 눈부셨던 그날의 우리를 기록합니다."); setIsAiWriting(false); }, 1000); };
  const handleAiMusic = () => { setIsAiMusicCreating(true); setMusicMode('ai'); setTimeout(() => { setSelectedMusic("🎻 AI 감성 선율"); setIsAiMusicCreating(false); }, 1500); };
  const addInvitee = (name: string) => { if (name && !invitees.includes(name)) setInvitees([...invitees, name]); };
  const toggleCheck = (item: keyof typeof checklist) => setChecklist({ ...checklist, [item]: !checklist[item] });

  return (
    <div className="animate-fade-in container">
      {step > 0 && <div className="step-indicator">{[1,2,3,4,5].map(s => <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />)}</div>}

      {/* 랜딩 (Step 0) */}
      {step === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <Sparkles size={64} className="animate-bounce" color="#ec4899" style={{ marginBottom: '20px' }} />
          <h1>인생 갤러리</h1>
          <p style={{ marginBottom: '40px', fontSize: '20px', lineHeight: '1.6' }}>사랑하는 당신의 빛나는 이야기를<br/>세상에서 가장 아름답게 만들어 보세요.</p>
          <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', padding: '24px', fontSize: '24px' }}><Sparkles size={28} /> 지금 바로 시작하기</button>
        </div>
      )}

      {/* STEP 1: 사진 엔진 */}
      {step === 1 && (
        <div className="glass-panel animate-fade-in">
          <h1>추억의 사진 고르기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', cursor: 'pointer', overflow: 'hidden', position: 'relative' }} onClick={() => !localImage && fileInputRef.current?.click()}>
            {isUploading || isAiProcessing ? <RefreshCcw size={48} className="animate-spin" color="#ec4899" /> : localImage ? <img src={localImage} alt="배경" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={64} style={{ opacity: 0.3 }} />}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={async (e) => {
             const file = e.target.files?.[0];
             if (file) {
               setLocalImage(URL.createObjectURL(file));
               setIsUploading(true);
               const fileName = `${Date.now()}.jpg`;
               const { error } = await supabase.storage.from('images').upload(fileName, file);
               if (!error) { const { data } = supabase.storage.from('images').getPublicUrl(fileName); setUploadedImageUrl(data.publicUrl); }
               setIsUploading(false);
             }
          }} style={{ display: 'none' }} />
          {!localImage ? <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>사진 선택</button> : !isAiPanelOpen ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white', padding: '24px', fontSize: '22px' }} onClick={() => setIsAiPanelOpen(true)}>더 멋있게 만들기 (AI)</button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><button className="btn btn-secondary" onClick={prevStep}>이전</button><button className="btn btn-primary" onClick={nextStep} style={{ background: '#10b981' }}>다음 글쓰기 <ArrowRight /></button></div>
            </div>
          ) : (
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>{['회화Style', '선명도', '콜라주'].map(t => <button key={t} className="btn btn-secondary" style={{ fontSize: '13px' }}>{t}</button>)}</div>
              <input type="text" placeholder="요구사항을 적어 주세요" style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'black', color: 'white', marginBottom: '10px' }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
              <div style={{ display: 'flex', gap: '10px' }}><button className="btn btn-secondary" onClick={() => setIsAiPanelOpen(false)}>이전</button><button className="btn btn-primary" style={{ flex: 2, background: '#8b5cf6' }} onClick={() => { setIsAiProcessing(true); setTimeout(() => setIsAiProcessing(false), 1000); }}>적용하기</button></div>
              <button className="btn btn-primary" onClick={nextStep} style={{ background: '#10b981', marginTop: '10px', width: '100%' }}>이 사진으로 할래요</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: 글쓰기 엔진 */}
      {step === 2 && (
        <div className="glass-panel animate-fade-in">
          <h1>사진에 이야기 더하기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
            <textarea style={{ position: 'relative', width: '90%', height: '80%', background: 'transparent', color: fontColor, fontSize: `${fontSize}px`, border: 'none', textAlign: 'center', fontFamily: font, resize: 'none', padding: '10px', zIndex: 10 }} value={textContent} onChange={e => setTextContent(e.target.value)} placeholder="이야기를 적어보세요..." />
          </div>
          {!writingMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', height: '100px' }} onClick={() => setWritingMode('manual')}><Edit3 /> <br/>내가 쓸게요</button>
              <button className="btn" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)', height: '100px' }} onClick={handleAiWriting}><Wand2 /> <br/>AI에게 부탁하기</button>
            </div>
          ) : (
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px' }}>
              {writingMode === 'manual' ? (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>{['#ffffff', '#fff9c4', '#fce4ec'].map(c => <button key={c} onClick={() => setFontColor(c)} style={{ width: '30px', height: '30px', background: c, borderRadius: '50%', border: fontColor === c ? '2px solid #ec4899' : 'none' }} />)}</div>
              ) : <button className="btn btn-secondary" onClick={handleAiWriting}>다른 문구 추천</button>}
              <button onClick={() => setWritingMode(null)} style={{ display: 'block', margin: '8px auto 0', fontSize: '11px', opacity: 0.6 }}>모드 변경</button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '15px' }}>
            <button className="btn btn-primary" style={{ background: '#3b82f6' }}>됐어요</button>
            <button className="btn btn-primary" style={{ background: '#8b5cf6' }}>사진과 글이 잘 어울려요</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '22px' }}>다음 음악 만들기 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={prevStep}><ArrowLeft size={16} /> 이전</button>
          </div>
        </div>
      )}

      {/* STEP 3: 음악 엔진 */}
      {step === 3 && (
        <div className="glass-panel animate-fade-in">
          <h1>배경 음악 더하기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '16/9', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedMusic ? <div style={{ textAlign: 'center' }}><Music size={50} color="#10b981" /> <div style={{ fontWeight: 'bold', color: '#10b981', marginTop: '10px' }}>{selectedMusic}</div></div> : <Disc size={50} style={{ opacity: 0.2 }} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', height: '100px' }} onClick={() => setSelectedMusic('🎹 클래식 피아노')}>목록에서 선택</button>
            <button className="btn" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', height: '100px' }} onClick={handleAiMusic}>AI에게 부탁</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '20px' }}>
            <button className="btn btn-primary" style={{ background: '#8b5cf6' }}>이 음악으로 할래요</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '20px' }}>다음 목소리 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={prevStep}><ArrowLeft size={16} /> 이전</button>
          </div>
        </div>
      )}

      {/* STEP 4: 목소리 엔진 */}
      {step === 4 && (
        <div className="glass-panel animate-fade-in">
          <h1>내 목소리로 낭송하기</h1>
          <div className="montage-item" style={{ marginBottom: '24px', aspectRatio: '4/3', position: 'relative' }}>
            {localImage && <img src={localImage} alt="배경" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
            <div style={{ position: 'relative', zIndex: 10, color: fontColor, fontFamily: font, fontSize: '24px', padding: '20px', textAlign: 'center' }}>{textContent}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <button className="btn" style={{ background: isRecording ? '#dc2626' : '#ef4444', width: '80px', height: '80px', borderRadius: '50%' }} onClick={() => { setIsRecording(!isRecording); if (isRecording) setRecordedVoiceUrl('m'); }}>
              {isRecording ? <div style={{ width: '20px', height: '20px', background: 'white', margin: 'auto' }} /> : <Mic size={36} color="white" />}
            </button>
            {recordedVoiceUrl && <button className="btn" style={{ background: '#3b82f6', width: '80px', height: '80px', borderRadius: '50%' }} onClick={() => setIsPlaying(!isPlaying)}><Play size={36} color="white" fill="white" /></button>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => { setIsTransforming(true); setTimeout(() => { setIsTransforming(false); alert('웅장한 톤으로 변환 완료!'); }, 1500); }}>다른 목소리로 (AI 변환)</button>
            <button className="btn btn-primary" onClick={nextStep} style={{ background: 'linear-gradient(45deg, #8b5cf6, #ec4899)', padding: '24px', fontSize: '24px' }}>발표 준비 <ArrowRight /></button>
            <button className="btn btn-secondary" onClick={prevStep}><ArrowLeft size={16} /> 이전</button>
          </div>
        </div>
      )}

      {/* STEP 5: 발표 및 무대 매니저 (Stage Manager) */}
      {step === 5 && (
        <div className="glass-panel animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Calendar size={48} color="#ec4899" style={{ marginBottom: '15px' }} />
            <h1>전시 무대 매니저</h1>
            <p>나만의 인생 갤러리를 세상에 자랑할 준비가 되셨나요?</p>
          </div>

          <div style={{ width: '100%', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}><Share2 size={20} inline /> 세상에 공유하기</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[ { id: 'k', name: '카카오', color: '#FEE500' }, { id: 'f', name: 'FB', color: '#1877F2' }, { id: 'i', name: '인스타', color: '#E4405F' }, { id: 'b', name: '밴드', color: '#2DB400' } ].map(s => (
                <button key={s.id} className="btn" style={{ background: 'rgba(255,255,255,0.1)', height: '70px', padding: '5px' }} onClick={() => { setSharedPlatform(s.name); alert(`${s.name}에 공유되었습니다!`); }}>
                  <div style={{ width: '24px', height: '24px', background: s.color, borderRadius: '6px', margin: '0 auto 5px' }} />
                  <span style={{ fontSize: '11px' }}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '30px', width: '100%' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}><Users size={20} inline /> 초대 명단 정리 (Google 연동)</h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <input 
                id="inviteName"
                type="text" 
                placeholder="초대할 분 성함" 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} 
              />
              <button 
                className="btn btn-primary" 
                style={{ width: '60px', padding: '0' }}
                onClick={() => {
                  const input = document.getElementById('inviteName') as HTMLInputElement;
                  if (input.value) { addInvitee(input.value); input.value = ''; }
                }}
              >
                <UserPlus size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {invitees.length === 0 ? <span style={{ opacity: 0.5, fontSize: '14px' }}>연락처에서 소중한 사람을 초대해 보세요.</span> : invitees.map(name => (
                <div key={name} style={{ background: '#ec4899', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                   {name} <span style={{ cursor: 'pointer' }} onClick={() => setInvitees(invitees.filter(i => i !== name))}>×</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}><ClipboardCheck size={20} inline /> 무대 데뷔 체크리스트</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'schedule', label: '발표 일정' },
                { key: 'stage', label: '무대 준비' },
                { key: 'vendor', label: '사람/업체' },
                { key: 'outfit', label: '의상/화장' }
              ].map(item => (
                <button 
                  key={item.key} 
                  className="btn" 
                  style={{ 
                    justifyContent: 'flex-start', 
                    background: checklist[item.key as keyof typeof checklist] ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: checklist[item.key as keyof typeof checklist] ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '16px'
                  }}
                  onClick={() => toggleCheck(item.key as keyof typeof checklist)}
                >
                  <div style={{ 
                    width: '24px', height: '24px', 
                    borderRadius: '50%', 
                    border: '2px solid' + (checklist[item.key as keyof typeof checklist] ? '#10b981' : 'rgba(255,255,255,0.3)'),
                    marginRight: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: checklist[item.key as keyof typeof checklist] ? '#10b981' : 'transparent'
                  }}>
                    {checklist[item.key as keyof typeof checklist] && <Check size={16} color="white" />}
                  </div>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" style={{ padding: '24px', fontSize: '24px', background: 'linear-gradient(45deg, #10b981, #3b82f6)' }} onClick={() => {
             alert("축하합니다! 당신의 빛나는 인생 무대가 완벽하게 준비되었습니다. ✨");
             setStep(0);
          }}>
            무대 시작하기! <Heart size={24} fill="currentColor" />
          </button>
          <button className="btn btn-secondary" onClick={prevStep} style={{ marginTop: '10px' }}>
            <ArrowLeft size={16} /> 이전으로
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: ` @keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); background: #dc2626; } 100% { transform: scale(1); } } .animate-spin { animation: spin 2s linear infinite; } .animate-bounce { animation: bounce 2s infinite; } @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } `}} />
    </div>
  );
}
