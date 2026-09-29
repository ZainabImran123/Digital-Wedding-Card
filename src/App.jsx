import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [attendanceChoice, setAttendanceChoice] = useState("Joyfully Accept");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const introVideoRef = useRef(null);
  const bgAudioRef = useRef(null);

  const detailsRef = useRef(null);
  const venueRef = useRef(null);
  const programRef = useRef(null);
  const transportRef = useRef(null);
  const giftsRef = useRef(null);
  const dressCodeRef = useRef(null);
  const rsvpRef = useRef(null);
  const footerRef = useRef(null);

  // Try to play audio on mount and on first click/scroll anywhere
  useEffect(() => {
    const audioEl = bgAudioRef.current;
    if (!audioEl) return;

    audioEl.volume = 1.0;

    const playAudio = () => {
      audioEl.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Autoplay blocked by browser:", err);
      });
    };

    playAudio();

    const handleUserInteraction = () => {
      playAudio();
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  const toggleMusic = () => {
    const audioEl = bgAudioRef.current;
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }
  };

  useEffect(() => {
    const target = new Date("2026-10-03T16:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (introVideoRef.current) {
      introVideoRef.current.play().catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (!showInvitation) return;
    const sections = [
      detailsRef.current,
      venueRef.current,
      programRef.current,
      transportRef.current,
      giftsRef.current,
      dressCodeRef.current,
      rsvpRef.current,
      footerRef.current,
    ];
    const triggers = [];
    sections.forEach((section) => {
      if (!section) return;
      const anim = gsap.fromTo(
        section.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });
    return () => {
      triggers.forEach((trig) => trig.kill());
      ScrollTrigger.refresh();
    };
  }, [showInvitation]);

  const openInvitation = () => {
    setTransitioning(true);
    setTimeout(() => {
      setShowInvitation(true);
      setTransitioning(false);
    }, 800);
  };

  const venueName = "MAIRIE DE VAURÉAL";
  const venueAddress = "Vauréal, France";
  const eventTime = "15:15 - 23:00";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    venueName + ", " + venueAddress
  )}`;

  return (
    <div className="min-h-screen bg-[#f3ede2] text-[#3a332a] font-serif relative flex flex-col items-center justify-between overflow-x-hidden selection:bg-[#d4af37]/30">

      {/* --- BACKGROUND AUDIO ELEMENT --- */}
      <audio ref={bgAudioRef} loop preload="auto">
        <source src="/audio/wedding-song.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* --- LAPTOP-STYLE MINIMAL BACKGROUNDLESS AUDIO TOGGLE BUTTON --- */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-transparent text-[#3a332a] hover:text-[#d4af37] p-2 transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        <span className="text-xl">{isPlaying ? "🔊" : "🔇"}</span>
        <span className="text-xs uppercase font-sans-caps tracking-widest hidden sm:inline">
          {isPlaying ? "Sound On" : "Sound Off"}
        </span>
      </button>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500&display=swap');
        .font-heading { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Cormorant Garamond', serif; }
        .font-sans-caps { font-family: 'Montserrat', sans-serif; letter-spacing: 0.25em; }
        @keyframes zoomInSmooth {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.12); opacity: 0; filter: blur(4px); }
        }
        .animate-zoom-out { animation: zoomInSmooth 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-30px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes scaleInLine {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 0.8; }
        }
        @keyframes horizScrollOneWay {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        .animate-horizontal-move { animation: horizScrollOneWay 14s linear infinite; }
        .animate-subtitle { animation: fadeInDown 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-names { animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
        .animate-divider { animation: scaleInLine 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards; transform-origin: center; opacity: 0; }
        .animate-date { animation: fadeInUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1.1s forwards; opacity: 0; }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.03); }
        }
        .animate-gentle-float { animation: gentleFloat 3s ease-in-out infinite; }
      `}</style>

      {/* --- FULLSCREEN INTRO VIDEO SCREEN --- */}
      {!showInvitation && (
        <div className={`fixed inset-0 z-40 bg-black flex items-center justify-center transition-opacity duration-700 ${transitioning ? 'animate-zoom-out' : 'opacity-100'}`}>
          <video
            ref={introVideoRef}
            className="w-full h-full object-cover absolute inset-0"
            autoPlay
            muted
            playsInline
            onEnded={openInvitation}
          >
            <source src="/videos/my-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* --- MAIN PAGE CONTAINER --- */}
      <div className={`w-full flex-1 flex flex-col items-center relative z-10 transition-all duration-700 ${showInvitation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* --- HERO SECTION --- */}
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
          <img
            src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/64dfbc54-127f-40c6-9453-fda3e966789d/hero-end-frame.webp"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/20 z-0"></div>

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto my-auto">
            <p className="animate-subtitle text-xs sm:text-sm uppercase font-sans-caps text-[#eee4cc] tracking-[0.35em] font-semibold drop-shadow-md">
              We're Getting Married
            </p>
            <h2 className="animate-names text-6xl sm:text-8xl font-heading text-white font-normal italic tracking-wide drop-shadow-lg py-2">
              Clara & Nour
            </h2>
            <div className="animate-divider w-24 h-[1px] bg-[#d4af37] mx-auto my-4"></div>
            <p className="animate-date font-sans-caps text-xs sm:text-sm text-[#f5ebd8] uppercase tracking-[0.3em] font-medium drop-shadow-md">
              October 3, 2026
            </p>
          </div>
        </div>

        {/* --- COUNTDOWN SECTION --- */}
        <div ref={detailsRef} className="relative w-full min-h-[70vh] flex flex-col items-center justify-between text-center py-20 px-4 overflow-hidden bg-[#f4efe8]">
          <div className="relative z-10 space-y-2 pt-6">
            <p className="text-xl sm:text-2xl font-body italic text-[#8c7b6c] tracking-wider drop-shadow-sm">Only</p>
            <h3 className="text-7xl sm:text-9xl font-heading text-[#5c4a3d] font-bold tracking-tight drop-shadow-md">{timeLeft.days}</h3>
            <p className="text-xs sm:text-sm uppercase font-sans-caps text-[#b39679] tracking-[0.4em] font-semibold pt-1">Days to Go</p>
          </div>

          <div className="relative z-10 w-full max-w-md h-64 sm:h-80 my-8 rounded-2xl overflow-hidden shadow-md bg-black/10">
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
              <source src="videos/door.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="relative z-10 mb-4"></div>
        </div>

        {/* --- VENUE SECTION --- */}
        <section ref={venueRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center p-6 md:p-10 bg-[#f3ede2]">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-medium mb-3 text-[#3F5F6C]">Details</h1>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#5D5D5D]">WHEN & WHERE</p>
          </div>
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center mb-16">
            <div className="absolute inset-[18%] rounded-[50%] overflow-hidden z-0">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/9b2a9024-6044-4a39-b657-d8ecc85b61e9/venue-photo.png" alt="Venue" className="w-full h-full object-cover" />
            </div>
            <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/372a4581-5c40-4bd2-beed-5b278a11aeb5/venue-oval-frame.png" alt="Frame" className="relative z-10 w-full h-full object-contain pointer-events-none" />
          </div>
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-[#3F5F6C]">The venue</h2>
            <div className="space-y-1">
              <p className="text-xl md:text-2xl font-semibold uppercase tracking-wider text-[#3F5F6C]">{venueName}</p>
              <p className="text-base md:text-lg">{venueAddress}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#5D5D5D]">
              <span className="text-base md:text-lg font-light">{eventTime}</span>
            </div>
          </div>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-[#545E56] hover:bg-[#434c45] text-white text-sm md:text-base font-medium rounded-full shadow-sm transition-all">
            Get directions
          </a>
        </section>

        {/* --- PROGRAMME SECTION --- */}
        <section ref={programRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center px-4 bg-[#f3ede2]">
          <div className="relative w-full max-w-[420px] mx-auto flex flex-col items-center justify-center py-6 px-4">
            <div className="relative w-full grid place-items-center">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/e01c5a64-23b5-44e4-85f1-8992ed86d59b/program-frame.png" alt="Frame" className="w-full h-auto object-contain pointer-events-none z-10" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-10 pt-48 max-w-[320px] mx-auto">
                <div className="w-full space-y-3.5 font-body">
                  <div className="space-y-0.5"><p className="text-[10px] uppercase font-sans-caps tracking-widest text-[#8c7355]">3:15 PM</p><h3 className="text-base sm:text-lg font-heading font-semibold text-[#3F5F6C]">CEREMONY</h3></div>
                  <div className="w-5 h-[1px] bg-[#d4af37]/40 mx-auto"></div>
                  <div className="space-y-0.5"><p className="text-[10px] uppercase font-sans-caps tracking-widest text-[#8c7355]">4:30 PM</p><h3 className="text-base sm:text-lg font-heading font-semibold text-[#3F5F6C]">WELCOME COCKTAIL</h3></div>
                  <div className="w-5 h-[1px] bg-[#d4af37]/40 mx-auto"></div>
                  <div className="space-y-0.5"><p className="text-[10px] uppercase font-sans-caps tracking-widest text-[#8c7355]">7:00 PM</p><h3 className="text-base sm:text-lg font-heading font-semibold text-[#3F5F6C]">DINNER</h3></div>
                  <div className="w-5 h-[1px] bg-[#d4af37]/40 mx-auto"></div>
                  <div className="space-y-0.5"><p className="text-[10px] uppercase font-sans-caps tracking-widest text-[#8c7355]">10:00 PM</p><h3 className="text-base sm:text-lg font-heading font-semibold text-[#3F5F6C]">DANCING</h3></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRANSPORT SECTION --- */}
        <section ref={transportRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-between px-0 bg-[#f3ede2]">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-4 px-6 my-6">
            <h2 className="text-4xl sm:text-6xl font-heading italic font-normal text-[#3F5F6C]">Transport</h2>
            <p className="text-xs sm:text-sm uppercase font-sans-caps text-[#5D5D5D] tracking-[0.3em]">HOW TO GET THERE</p>
            <div className="w-16 h-[1px] bg-[#d4af37]/60 mx-auto my-2"></div>
            <p className="text-base sm:text-xl font-semibold uppercase tracking-wider text-[#3F5F6C] pt-1">BY CAR</p>
            <p className="text-base sm:text-xl font-body italic text-[#5D5D5D] max-w-lg mx-auto">Free parking is available next to the venue for all guests</p>
          </div>
          <div className="w-full relative h-40 md:h-52 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-y-0 flex items-center justify-center animate-horizontal-move w-full">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/83fcc409-2aee-44f3-9baf-b06640233702/carriage.png" alt="Carriage" className="w-96 md:w-[500px] h-auto object-contain" />
            </div>
          </div>
        </section>

        {/* --- GIFTS SECTION --- */}
        <section ref={giftsRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center px-4 bg-[#f3ede2]">
          <div className="relative w-full max-w-[420px] mx-auto flex flex-col items-center justify-center py-6 px-4">
            <div className="relative w-full grid place-items-center">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/3c37f183-6534-4d1d-857d-4cba8a987965/gifts-frame.png" alt="Frame" className="w-full h-auto object-contain pointer-events-none z-10" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-start text-center px-10 pt-34 max-w-[280px] mx-auto">
                <div className="w-full space-y-2.5 font-body">
                  <div className="space-y-0.5">
                    <h2 className="text-2xl sm:text-3xl font-heading font-normal text-[#3F5F6C]">Gifts</h2>
                    <p className="text-[9px] uppercase font-sans-caps tracking-widest text-[#8c7355]">YOUR PRESENCE IS OUR GREATEST GIFT</p>
                  </div>
                  <p className="text-xs italic text-[#5D5D5D] leading-snug">If you would like to honor us with a gift, a contribution towards our honeymoon would be deeply appreciated.</p>
                  <div>
                    <button onClick={() => setShowBankDetails(!showBankDetails)} className="px-4 py-2 bg-[#545E56] hover:bg-[#434c45] text-white text-[10px] uppercase font-sans-caps tracking-wider rounded-full shadow-sm transition-all">
                      {showBankDetails ? "Hide Bank Details" : "Bank Details"}
                    </button>
                  </div>
                  {showBankDetails && (
                    <div className="p-2.5 bg-[#fdfbf7]/90 border border-[#d4af37]/30 rounded-xl text-left text-[11px] space-y-0.5 shadow-sm">
                      <p className="font-semibold text-[#3F5F6C]">Bank: <span className="font-normal text-[#5D5D5D]">BNP Paribas</span></p>
                      <p className="font-semibold text-[#3F5F6C]">Name: <span className="font-normal text-[#5D5D5D]">Clara & Nour</span></p>
                      <p className="font-semibold text-[#3F5F6C]">IBAN: <span className="font-normal text-[#5D5D5D]">FR76 3000 ... 2010</span></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- DRESS CODE SECTION --- */}
        <section ref={dressCodeRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center px-4 bg-[#f3ede2]">
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-6">
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-5xl font-heading font-normal text-[#3F5F6C]">Dress code</h2>
              <p className="text-xs uppercase font-sans-caps tracking-[0.3em] text-[#5D5D5D]">FORMAL / BLACK TIE</p>
            </div>
            <div className="relative w-full max-w-[300px] h-40 sm:h-48 flex items-center justify-center overflow-hidden my-4">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/41a63db0-8157-465d-954b-4837a9c72c27/dress-code-a.png" alt="Dress Code" className="w-full h-full object-contain animate-gentle-float" />
            </div>
            <p className="text-base sm:text-lg font-body italic text-[#5D5D5D] max-w-xs mx-auto">We kindly request formal evening attire for our celebration.</p>
          </div>
        </section>

        {/* --- RSVP SECTION --- */}
        <section ref={rsvpRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center px-4 bg-[#f3ede2]">
          <div className="w-full max-w-md mx-auto flex flex-col items-center text-center space-y-6 bg-[#fdfbf7]/80 p-8 rounded-3xl border border-[#d4af37]/20 shadow-lg">
            {!rsvpSubmitted ? (
              <>
                <div className="space-y-1">
                  <h2 className="text-4xl sm:text-5xl font-heading font-normal text-[#3F5F6C]">RSVP</h2>
                  <p className="text-xs uppercase font-sans-caps tracking-[0.3em] text-[#5D5D5D]">PLEASE RESPOND BY AUGUST 15, 2026</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); setRsvpSubmitted(true); }} className="w-full space-y-4 text-left font-body">
                  <div>
                    <label className="block text-xs uppercase font-sans-caps text-[#3F5F6C] mb-1">Full Name(s)</label>
                    <input type="text" required placeholder="Enter your name" className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5F6C]" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-sans-caps text-[#3F5F6C] mb-1">Will you attend?</label>
                    <select value={attendanceChoice} onChange={(e) => setAttendanceChoice(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5F6C]">
                      <option value="Joyfully Accept">Joyfully Accept</option>
                      <option value="Regretfully Decline">Regretfully Decline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-sans-caps text-[#3F5F6C] mb-1">Dietary Restrictions / Wishes</label>
                    <textarea rows="3" placeholder="Let us know if you have any allergies..." className="w-full px-4 py-2.5 rounded-xl border border-[#d4af37]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3F5F6C]"></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#545E56] hover:bg-[#434c45] text-white uppercase font-sans-caps text-xs tracking-wider rounded-full shadow-md transition-all mt-2">
                    Send RSVP
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 space-y-4 flex flex-col items-center justify-center">
                <h2 className="text-4xl sm:text-5xl font-heading italic font-normal text-[#3F5F6C]">Thank you!</h2>
                <p className="text-sm font-body italic text-[#5D5D5D] tracking-wide">
                  {attendanceChoice === "Joyfully Accept"
                    ? "We are so happy you will join us."
                    : "We are sorry you can't make it, but thank you for letting us know."}
                </p>
                <div className="w-24 h-[1px] bg-[#d4af37]/50 my-2"></div>
              </div>
            )}
          </div>
        </section>

        {/* --- FOOTER SECTION --- */}
        <section ref={footerRef} className="w-full py-20 md:py-28 flex flex-col items-center justify-center px-4 bg-[#f3ede2]">
          <div className="relative w-full max-w-[420px] mx-auto flex flex-col items-center justify-center py-6 px-4">
            <div className="relative w-full grid place-items-center">
              <img src="https://villa-perle.thedigitalyes.com/__l5e/assets-v1/5ac8ce4b-a000-46cc-a4dc-56145d22a193/footer-swan-frame.png" alt="Footer Frame" className="w-full h-auto object-contain pointer-events-none z-10 min-h-[400px] bg-[#f9f6f0]/50 border border-[#d4af37]/20 rounded-2xl" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-between text-center py-10 px-8">
                <div className="space-y-1 pt-26">
                  <h3 className="text-2xl sm:text-3xl font-heading font-normal italic text-[#3F5F6C]">Clara & Nour</h3>
                  <p className="text-[10px] uppercase font-sans-caps tracking-[0.3em] text-[#8c7355]">OCTOBER 3, 2026</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto -mb-4 pt-6 pb-4">
            <p className="text-[9px] uppercase font-sans-caps tracking-[0.25em] text-[#5D5D5D]/80">MADE WITH LOVE</p>
          </div>
        </section>

      </div>
    </div>
  );
}