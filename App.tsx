
import React, { useState, useEffect, useRef } from 'react';
import { AppView, CatBreed, UserPet } from './types';
import { identifyCatBreed } from './geminiService';

// --- Sub-components ---

const SplashView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background-light flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pattern-bg pointer-events-none"></div>
      <div className="relative mb-8 z-10">
        <div className="w-48 h-48 bg-cream-yellow border-4 border-primary rounded-full relative flex items-center justify-center shadow-lg">
          <div className="absolute -top-4 left-6 w-12 h-12 bg-cream-yellow border-4 border-primary rounded-tr-full rounded-tl-[2rem] transform -rotate-12"></div>
          <div className="absolute -top-4 right-6 w-12 h-12 bg-cream-yellow border-4 border-primary rounded-tl-full rounded-tr-[2rem] transform rotate-12"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-8">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
            <div className="w-4 h-2 bg-pink-300 rounded-full mt-1"></div>
            <div className="flex gap-1 items-center">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center z-10 mb-20">
        <h1 className="text-primary text-6xl font-extrabold tracking-tight mb-2">MeowID</h1>
        <p className="text-[#161118]/60 text-lg font-medium">Identify your feline friend</p>
      </div>
      <div className="absolute bottom-20 w-full max-w-sm px-8 z-10">
        <div className="flex justify-between text-primary font-bold mb-2">
          <span className="text-xs uppercase tracking-widest">Initializing...</span>
          <span className="text-xs">{progress}%</span>
        </div>
        <div className="h-4 w-full bg-primary/20 rounded-full overflow-hidden border-2 border-primary/10">
          <div className="h-full bg-primary transition-all duration-75" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const NavBar: React.FC<{ active: AppView; onChange: (v: AppView) => void }> = ({ active, onChange }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-full px-8 py-3 flex items-center justify-between z-50 border border-primary/10">
    <button onClick={() => onChange(AppView.HOME)} className={`flex flex-col items-center gap-1 ${active === AppView.HOME ? 'text-primary' : 'text-gray-400'}`}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: active === AppView.HOME ? "'FILL' 1" : "" }}>home</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-gray-400">
      <span className="material-symbols-outlined">search</span>
    </button>
    <button 
      onClick={() => onChange(AppView.CAMERA)}
      className="flex size-14 items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/30 -mt-10 border-4 border-background-light active:scale-90 transition-transform"
    >
      <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
    </button>
    <button className="flex flex-col items-center gap-1 text-gray-400">
      <span className="material-symbols-outlined">auto_awesome</span>
    </button>
    <button onClick={() => onChange(AppView.PROFILE)} className={`flex flex-col items-center gap-1 ${active === AppView.PROFILE ? 'text-primary' : 'text-gray-400'}`}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: active === AppView.PROFILE ? "'FILL' 1" : "" }}>person</span>
    </button>
  </div>
);

const HomeView: React.FC = () => {
  const breeds = [
    { name: 'Maine Coon', traits: 'Gentle Giant • Calm', img: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800' },
    { name: 'Ragdoll', traits: 'Blue-eyed Beauty • Sweet', img: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=800' },
    { name: 'Siamese', traits: 'Talkative • Loyal', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=800' },
  ];

  return (
    <div className="pb-32 pt-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-primary/70">Welcome back,</p>
          <h2 className="text-xl font-extrabold">Hello, Cat Lover! 🐾</h2>
        </div>
        <div className="size-12 rounded-full border-2 border-primary/20 overflow-hidden">
            <img src="https://picsum.photos/seed/catlover/100/100" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Featured Cat Breeds</h3>
          <button className="text-primary text-sm font-semibold">See all</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-2">
          {breeds.map((b, i) => (
            <div key={i} className="min-w-[240px] flex flex-col gap-3">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={b.img} alt={b.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-2">
                <p className="text-lg font-bold">{b.name}</p>
                <p className="text-primary text-sm font-medium">{b.traits}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-accent-yellow p-5 rounded-2xl shadow-sm border border-primary/10 flex gap-4 items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
            <p className="text-primary text-xs font-bold uppercase tracking-widest">Tip of the day</p>
          </div>
          <h4 className="text-lg font-bold mb-1">Slow Blinking</h4>
          <p className="text-sm text-gray-600 mb-4">Did you know cats blink slowly to show trust? Try it back to say 'I love you'!</p>
          <button className="bg-primary text-white text-xs font-bold py-2 px-5 rounded-full shadow-md">Read More</button>
        </div>
        <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md ring-2 ring-white">
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400" alt="Cat tip" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const pets = [
    { name: 'Luna', breed: 'Siamese', img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=400' },
    { name: 'Oliver', breed: 'Maine Coon', img: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400' },
  ];

  return (
    <div className="pb-32 pt-12">
      <div className="flex flex-col items-center mb-10 px-6">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1 bg-white">
            <img src="https://picsum.photos/seed/sarah/200/200" alt="Sarah" className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-4 border-background-light">
            <span className="material-symbols-outlined text-xs">edit</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Sarah Jenkins</h2>
        <div className="flex items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-sm">pets</span>
          <span className="font-semibold text-sm">Cat Enthusiast</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Member since Oct 2023</p>
      </div>

      <div className="px-6 mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">My Pets</h3>
        <button className="text-primary text-xs font-bold bg-primary/10 py-1.5 px-4 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">add</span> Add New
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 mb-8">
        {pets.map((p, i) => (
          <div key={i} className="min-w-[180px] p-3 bg-white rounded-2xl shadow-sm border border-primary/5">
            <img src={p.img} alt={p.name} className="w-full aspect-square object-cover rounded-xl mb-3" />
            <p className="font-bold">{p.name}</p>
            <p className="text-primary text-xs font-semibold">{p.breed}</p>
          </div>
        ))}
      </div>

      <div className="px-6">
        <h3 className="text-lg font-bold mb-4">Account Menu</h3>
        <div className="flex flex-col gap-3">
          {['Scan History', 'Achievements', 'Notifications'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-full shadow-sm">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{item === 'Scan History' ? 'history' : item === 'Achievements' ? 'military_tech' : 'notifications'}</span>
                </div>
                <span className="font-semibold text-sm">{item}</span>
              </div>
              <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </div>
          ))}
          <div className="flex items-center justify-center p-4 mt-2 bg-red-50 rounded-full text-red-500 font-bold border border-red-100">
            <span className="material-symbols-outlined mr-2">logout</span> Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

const CameraView: React.FC<{ onCapture: (data: string) => void; onCancel: () => void }> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg').split(',')[1];
      onCapture(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="relative z-20 flex items-center justify-between p-6 pt-12">
        <button onClick={onCancel} className="size-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bg-accent-yellow/90 px-4 py-2 rounded-full flex items-center gap-2 text-primary font-bold text-sm">
          <span className="material-symbols-outlined text-base">pets</span> SCANNER
        </div>
        <button className="size-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center">
          <span className="material-symbols-outlined">flash_on</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-72 h-72 border-4 border-primary rounded-[4rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/40 scan-line shadow-[0_0_15px_#c442f0]"></div>
          {/* Decorative ears */}
          <div className="absolute -top-[2px] left-6 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-full -rotate-[15deg] origin-bottom-right"></div>
          <div className="absolute -top-[2px] right-6 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-full rotate-[15deg] origin-bottom-left"></div>
        </div>
        <div className="mt-12 bg-accent-yellow px-6 py-3 rounded-full shadow-lg">
           <p className="text-primary font-bold text-sm">Align the kitty in the frame</p>
        </div>
      </div>

      <div className="relative z-20 bg-gradient-to-t from-black/80 to-transparent pb-12 pt-8 flex items-center justify-center gap-10">
        <button className="size-12 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center">
          <span className="material-symbols-outlined">photo_library</span>
        </button>
        <button onClick={capture} className="size-24 rounded-full border-4 border-white p-1 active:scale-95 transition-transform">
          <div className="w-full h-full rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(196,66,240,0.6)]">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>camera</span>
          </div>
        </button>
        <button className="size-12 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center">
          <span className="material-symbols-outlined">flip_camera_ios</span>
        </button>
      </div>
    </div>
  );
};

const ResultsView: React.FC<{ result: CatBreed; onBack: () => void }> = ({ result, onBack }) => {
  return (
    <div className="relative z-10 min-h-screen bg-background-light flex flex-col pb-10">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex items-center justify-between z-20">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-primary/10">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="font-extrabold text-lg">Identification Results</h2>
        <button className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>

      <div className="px-4 pt-2">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
            <span className="text-xs font-bold text-gray-800">{result.matchConfidence}% Match Confidence</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 px-4">
        <h1 className="text-primary text-4xl font-black leading-tight">{result.name}</h1>
        <p className="text-[#7f6189] text-sm font-medium mt-1">Found in your photo • Just now</p>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="bg-accent-yellow p-5 rounded-2xl border-2 border-accent-yellow/50 shadow-sm">
          <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Price Range</h4>
          <p className="text-primary font-bold text-lg">{result.priceRange}</p>
        </div>
        <div className="bg-purple-100 p-5 rounded-2xl border-2 border-purple-200/50 shadow-sm">
          <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white mb-3">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">Personality</h4>
          <p className="text-[#7f6189] font-bold text-xs leading-tight">{result.personality}</p>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-pink-500">favorite</span>
              <h2 className="text-sm font-bold">Affection Level</h2>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`material-symbols-outlined ${i < result.affectionLevel ? 'text-primary' : 'text-gray-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              ))}
            </div>
          </div>
          <div className="h-px bg-gray-50 w-full"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">bolt</span>
              <h2 className="text-sm font-bold">Energy Level</h2>
            </div>
            <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${result.energyLevel}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-extrabold mb-2">About the Breed</h3>
        <p className="text-[#7f6189] text-sm leading-relaxed">{result.description}</p>
      </div>

      <div className="px-6 mb-10">
        <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">info</span> View Full Breed Guide
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-6">Not your cat? <button onClick={onBack} className="text-primary font-bold underline">Try identifying again</button></p>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<AppView>(AppView.SPLASH);
  const [identificationResult, setIdentificationResult] = useState<CatBreed | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = async (base64: string) => {
    setIsLoading(true);
    setView(AppView.RESULTS); // Transition to results to show loading state
    try {
      const res = await identifyCatBreed(base64);
      setIdentificationResult(res);
    } catch (err) {
      console.error(err);
      alert("Failed to identify cat. Please try again.");
      setView(AppView.CAMERA);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (view === AppView.SPLASH) return <SplashView onComplete={() => setView(AppView.HOME)} />;
    
    return (
      <div className="min-h-screen bg-background-light overflow-x-hidden relative">
        <div className="fixed inset-0 pattern-bg pointer-events-none opacity-40"></div>
        {view === AppView.HOME && <HomeView />}
        {view === AppView.PROFILE && <ProfileView />}
        {view === AppView.CAMERA && <CameraView onCapture={handleCapture} onCancel={() => setView(AppView.HOME)} />}
        {view === AppView.RESULTS && (
          isLoading ? (
            <div className="fixed inset-0 bg-background-light z-[200] flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-bold text-primary mb-2">AI is identifying...</h2>
                <p className="text-gray-500 text-center">We're analyzing facial features and coat patterns to find the perfect match.</p>
            </div>
          ) : (
            identificationResult && <ResultsView result={identificationResult} onBack={() => setView(AppView.HOME)} />
          )
        )}
        {(view === AppView.HOME || view === AppView.PROFILE) && <NavBar active={view} onChange={setView} />}
      </div>
    );
  };

  return <div className="min-h-screen bg-background-light">{renderContent()}</div>;
}
