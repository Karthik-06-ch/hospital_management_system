import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MdPerson, MdCalendarToday, MdReceipt, MdAssignment, MdBusiness, MdInsertChart, MdArrowForward, MdCheckCircle, MdLocalHospital } from 'react-icons/md';

// -----------------------------
// GLOBAL STYLES & CURSOR LOGIC
// -----------------------------

const CustomCursor = () => {
  const cursorPos = useRef({ x: -100, y: -100 });
  const cursorOuterPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(Array(12).fill({ x: -100, y: -100 }));
  const rafId = useRef(null);

  const innerCursorRef = useRef(null);
  const outerCursorRef = useRef(null);
  const trailsRef = useRef([]);

  const [cursorState, setCursorState] = useState('default'); // default, button, card, link, clicked

  useEffect(() => {
    // Check if touch device, disable if so
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Add global cursor none
    document.body.style.cursor = 'none';

    const updateCursorState = (e) => {
      const target = e.target;
      const isButton = target.closest('button') || target.closest('.cta-btn');
      const isCard = target.closest('.tilt-card');
      const isLink = target.closest('a') || target.closest('.nav-link');

      if (e.type === 'mousedown') {
        setCursorState('clicked');
      } else if (e.type === 'mouseup') {
        setCursorState(isButton ? 'button' : isCard ? 'card' : isLink ? 'link' : 'default');
      } else {
        if (isButton) setCursorState('button');
        else if (isCard) setCursorState('card');
        else if (isLink) setCursorState('link');
        else setCursorState('default');
      }
    };

    const handleMouseMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      updateCursorState(e);
    };

    const handleMouseInteraction = (e) => updateCursorState(e);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseInteraction);
    window.addEventListener('mouseup', handleMouseInteraction);

    // Animation loop
    const animate = () => {
      // Lerp outer cursor
      cursorOuterPos.current.x += (cursorPos.current.x - cursorOuterPos.current.x) * 0.12;
      cursorOuterPos.current.y += (cursorPos.current.y - cursorOuterPos.current.y) * 0.12;

      // Update basic cursors mapping
      if (innerCursorRef.current && outerCursorRef.current) {
        innerCursorRef.current.style.transform = `translate(${cursorPos.current.x - 5}px, ${cursorPos.current.y - 5}px) scale(${cursorState === 'clicked' ? 0.8 : cursorState === 'button' ? 0 : 1})`;
        
        let outerScale = 1;
        let outerBorderRadius = '50%';
        let outerWidth = 40;
        let outerHeight = 40;
        let offsetX = 20;
        let offsetY = 20;

        if (cursorState === 'button') { outerWidth = 60; outerHeight = 60; offsetX = 30; offsetY = 30; }
        else if (cursorState === 'card') { outerBorderRadius = '12px'; }
        else if (cursorState === 'link') { outerWidth = 60; outerHeight = 20; offsetX = 30; offsetY = 10; outerBorderRadius = '10px'; }
        else if (cursorState === 'clicked') { outerScale = 0.8; }

        outerCursorRef.current.style.width = `${outerWidth}px`;
        outerCursorRef.current.style.height = `${outerHeight}px`;
        outerCursorRef.current.style.borderRadius = outerBorderRadius;
        outerCursorRef.current.style.transform = `translate(${cursorOuterPos.current.x - offsetX}px, ${cursorOuterPos.current.y - offsetY}px) scale(${outerScale})`;
      }

      // Update Trail logic
      let prevPos = { ...cursorPos.current };
      for (let i = 0; i < trailPositions.current.length; i++) {
        const currentPos = trailPositions.current[i];
        
        // Follow previous position with lerp
        currentPos.x += (prevPos.x - currentPos.x) * 0.3;
        currentPos.y += (prevPos.y - currentPos.y) * 0.3;
        
        if (trailsRef.current[i]) {
          trailsRef.current[i].style.transform = `translate(${currentPos.x - 3}px, ${currentPos.y - 3}px)`;
        }
        prevPos = { ...currentPos };
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseInteraction);
      window.removeEventListener('mouseup', handleMouseInteraction);
      cancelAnimationFrame(rafId.current);
    };
  }, [cursorState]);

  // Styling based on state
  let outerBg = 'rgba(255, 255, 255, 0)';
  let outerBorder = '1px solid white';
  let blendMode = 'normal';

  if (cursorState === 'button') {
    outerBg = 'rgba(37, 99, 235, 0.4)';  // Semi-transparent blue
    outerBorder = 'none';
    blendMode = 'difference';
  } else if (cursorState === 'card') {
    outerBorder = '1.5px solid #0ea5e9'; // Teal
  }

  return (
    <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-[9999] hidden md:block" style={{ mixBlendMode: blendMode }}>
      {/* Trails */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          ref={el => trailsRef.current[i] = el}
          className="fixed top-0 left-0 rounded-full"
          style={{
            width: `${6 - (i * 0.3)}px`, height: `${6 - (i * 0.3)}px`,
            backgroundColor: `rgba(${255 - (i*10)}, ${255 - (i*5)}, 255, ${0.8 - (i * 0.05)})`,
            willChange: 'transform',
            transition: 'opacity 0.1s ease',
            opacity: cursorState !== 'default' && cursorState !== 'card' ? 0 : 1
          }}
        />
      ))}
      {/* Outer Ring */}
      <div 
        ref={outerCursorRef}
        className="fixed top-0 left-0 transition-all duration-300 ease-out"
        style={{
          border: outerBorder,
          backgroundColor: outerBg,
          willChange: 'transform, width, height',
        }}
      />
      {/* Inner Dot */}
      <div 
        ref={innerCursorRef}
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-white rounded-full transition-transform duration-100"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

// -----------------------------
// 3D CARD IMPLEMENTATION
// -----------------------------
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    
    const glare = cardRef.current.querySelector('.glare');
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
    cardRef.current.style.transition = 'transform 0.5s ease-out';
    const glare = cardRef.current.querySelector('.glare');
    if (glare) glare.style.background = 'transparent';
  };

  const handleMouseEnter = () => {
    cardRef.current.style.transition = 'none';
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden tilt-card will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d', contain: 'layout' }}
    >
      <div className="glare absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
};

// -----------------------------
// SECTIONS
// -----------------------------

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f2e]/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <MdLocalHospital size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-widest">CareSync</span>
        </div>
        <div className="hidden md:flex gap-8 items-center text-slate-300 font-medium tracking-wide">
          <a href="#features" className="nav-link hover:text-white transition-colors relative group">
            Features
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
          </a>
          <a href="#how-it-works" className="nav-link hover:text-white transition-colors relative group">
            How It Works
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
          </a>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="nav-link text-white font-medium hover:text-blue-400 transition-colors">Log in</Link>
          <Link to="/register" className="cta-btn px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const elementsRef = useRef([]);
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = ["Streamlining Patient Care", "Empowering Doctors", "Modernizing Healthcare"];

  // Typing effect
  useEffect(() => {
    let currentText = '';
    let i = 0;
    let isDeleting = false;
    let typingTimer;

    const type = () => {
      const fullText = phrases[phraseIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, i - 1);
        i--;
      } else {
        currentText = fullText.substring(0, i + 1);
        i++;
      }
      setTypedText(currentText);

      let typeSpeed = isDeleting ? 30 : 100;

      if (!isDeleting && i === fullText.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        typeSpeed = 500;
      }

      typingTimer = setTimeout(type, typeSpeed);
    };

    typingTimer = setTimeout(type, 100);
    return () => clearTimeout(typingTimer);
  }, [phraseIndex]);

  // Parallax
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;

      elementsRef.current.forEach((el, index) => {
        if (!el) return;
        const speed = (index + 1) * 0.03;
        el.style.transform = `translate(${x * innerWidth * speed}px, ${y * innerHeight * speed}px) rotate(${x * 20}deg)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-[#0a0f2e]">
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div ref={el => elementsRef.current[0] = el} className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-blue-500/30" />
        <div ref={el => elementsRef.current[1] = el} className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-[#0ea5e9]/20 rotate-45" />
        <div ref={el => elementsRef.current[2] = el} className="absolute top-1/3 right-1/3 w-8 h-8 bg-blue-500/10 rounded-full blur-xl" />
        <div ref={el => elementsRef.current[3] = el} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
              Revolutionizing HM Systems
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Advanced <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                Hospital Management
              </span><br/>
              System
            </h1>
            <h2 className="text-2xl text-slate-300 font-light mb-10 h-8 flex items-center">
              {typedText}
              <span className="inline-block w-1 h-6 bg-blue-500 ml-1 animate-pulse"></span>
            </h2>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/login')} className="cta-btn px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                Get Started
              </button>
              <button className="cta-btn px-8 py-4 bg-transparent border border-slate-600 hover:border-slate-400 text-white rounded-full font-bold text-lg transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <TiltCard className="w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-[#1a2352] to-[#0d1640] rounded-2xl border border-white/10 shadow-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-yellow-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
              <div className="text-slate-400 text-sm">Dashboard Overview</div>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center">
                <div className="text-teal-400 text-sm mb-1">Active Patients</div>
                <div className="text-3xl text-white font-bold">1,204</div>
                <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden"><div className="w-[70%] h-full bg-teal-400 rounded-full"></div></div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center">
                <div className="text-blue-400 text-sm mb-1">Doctors Online</div>
                <div className="text-3xl text-white font-bold">48</div>
                <div className="flex mt-3 gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30"></div>)}
                </div>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl border border-white/5 p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400"><MdInsertChart size={24}/></div>
                <div>
                  <div className="text-white font-bold">Real-time Analytics</div>
                  <div className="text-slate-400 text-sm">System running smoothly</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
};

const AnimatedCounter = ({ end, label }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const endNumeric = parseInt(end.replace(/,/g, ''));
    const increment = endNumeric / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= endNumeric) {
        clearInterval(timer);
        setCount(endNumeric);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <TiltCard className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] rounded-2xl p-8 border border-white/10 text-center">
      <div ref={ref} className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-2">
        {count.toLocaleString()}{end.includes('%') ? '%' : '+'}
      </div>
      <div className="text-slate-300 font-medium">{label}</div>
    </TiltCard>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-[#0d1640] relative z-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCounter end="10,000" label="Patients Treated" />
        <AnimatedCounter end="500" label="Expert Doctors" />
        <AnimatedCounter end="50" label="Departments" />
        <AnimatedCounter end="99.9%" label="System Uptime" />
      </div>
    </section>
  );
};

const FeatureCard = ({ title, icon, desc }) => (
  <TiltCard className="group bg-[#111c4d] rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
    <div className="w-14 h-14 bg-[#0a0f2e] group-hover:bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 transition-colors border border-white/5">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </TiltCard>
);

const FeaturesSection = () => {
  const features = [
    { title: "Patient Management", icon: <MdPerson size={28}/>, desc: "Complete lifecycle management from admission to discharge." },
    { title: "Doctor Scheduling", icon: <MdCalendarToday size={28}/>, desc: "Intelligent rostering and real-time appointment booking." },
    { title: "Billing & Invoicing", icon: <MdReceipt size={28}/>, desc: "Automated billing, insurance claims, and payment tracking." },
    { title: "Medical Records", icon: <MdAssignment size={28}/>, desc: "Secure Electronic Health Records (EHR) accessible instantly." },
    { title: "Department Control", icon: <MdBusiness size={28}/>, desc: "Centralized overview of all hospital departments and wards." },
    { title: "Real-time Analytics", icon: <MdInsertChart size={28}/>, desc: "Dashboards and reports to make data-driven decisions." }
  ];

  return (
    <section id="features" className="py-24 bg-[#0a0f2e] relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Everything You Need</h2>
          <p className="text-slate-300 text-lg">A robust suite of tools engineered to handle the complex operations of a modern hospital effortlessly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[#0d1640] relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-20">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500/20 via-teal-500/50 to-blue-500/20 -translate-y-1/2 z-0"></div>
          
          {[
            { step: '01', title: 'Register Patients', desc: 'Securely input and verify patient details into the encrypted database.' },
            { step: '02', title: 'Schedule Appointments', desc: 'Assign doctors and time slots natively with conflict detection.' },
            { step: '03', title: 'Manage & Analyze', desc: 'Track treatments, generate bills, and analyze operational metrics.' }
          ].map((s, i) => (
            <TiltCard key={i} className="relative z-10 bg-[#15235b] p-8 rounded-2xl border border-blue-500/20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 border-4 border-[#0d1640]">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{s.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{s.desc}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-[#0a0f2e] relative z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20"></div>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 text-center relative z-10"
      >
        <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Transform</span> Your Hospital?
        </h2>
        <p className="text-xl text-slate-300 mb-12">Join thousands of healthcare organizations streamlining operations today.</p>
        
        <button onClick={() => navigate('/login')} className="cta-btn group relative px-10 py-5 bg-white rounded-full font-bold text-xl text-[#0a0f2e] hover:bg-gray-100 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] overflow-hidden inline-flex items-center gap-2">
          <span className="relative z-10">Start Free Trial</span>
          <MdArrowForward className="relative z-10 group-hover:translate-x-1 transition-transform"/>
        </button>
      </motion.div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div className="bg-[#0a0f2e] min-h-screen font-sans">
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      
      <footer className="bg-[#05081c] py-8 text-center border-t border-white/5 relative z-20">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} CareSync Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
