'use client';

import { useEffect, useRef, useState } from 'react';

// --- INTERFACES (Giữ nguyên) ---

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  icon: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bgGradient: string[];
  };
  events: Omit<TimelineEvent, 'x' | 'y' | 'vx' | 'vy' | 'radius'>[];
  groupChats: string[];
  users: string[];
  relatedTopics: string[];
  questions: string[];
}

// --- THEMES (Giữ nguyên) ---
interface TestPageProps {
  theme?: string;
}

const themes: Record<string, ThemeConfig> = {
  // ... (Dữ liệu themes của bạn giữ nguyên)
  findjob: {
    name: 'Tìm Việc Làm',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#6ee7b7',
      bgGradient: ['from-emerald-950', 'via-green-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Tạo CV', description: 'Chuẩn bị hồ sơ xin việc chuyên nghiệp', icon: '📄' },
      { id: 2, title: 'Tìm Công Ty', description: 'Nghiên cứu các công ty phù hợp', icon: '🏢' },
      { id: 3, title: 'Nộp Đơn', description: 'Gửi hồ sơ ứng tuyển', icon: '📮' },
      { id: 4, title: 'Phỏng Vấn', description: 'Chuẩn bị và tham gia phỏng vấn', icon: '💼' },
      { id: 5, title: 'Nhận Offer', description: 'Nhận thư mời làm việc', icon: '🎉' },
      { id: 6, title: 'Ngày Đầu', description: 'Bắt đầu công việc mới', icon: '🚀' },
    ],
    groupChats: ['💼 Job Hunters VN', '🎯 Career Growth', '📈 Startup Jobs', '🏆 Tech Recruiters'],
    users: ['Nguyễn Văn A - HR Manager', 'Trần Thị B - Tech Lead', 'Lê Văn C - Founder', 'Phạm Thị D - Recruiter'],
    relatedTopics: ['Resume Tips', 'Interview Skills', 'Salary Negotiation', 'Career Path', 'Networking'],
    questions: ['Làm sao để viết CV ấn tượng?', 'Chuẩn bị gì cho buổi phỏng vấn?', 'Thương lượng lương thế nào?']
  },
  lover: {
    name: 'Tình Yêu',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fbcfe8',
      bgGradient: ['from-pink-950', 'via-rose-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Gặp Gỡ', description: 'Lần đầu tiên nhìn thấy nhau', icon: '👀' },
      { id: 2, title: 'Thả Thính', description: 'Bắt đầu tìm hiểu', icon: '💬' },
      { id: 3, title: 'Hẹn Hò', description: 'Buổi date đầu tiên', icon: '☕' },
      { id: 4, title: 'Tỏ Tình', description: 'Thổ lộ cảm xúc', icon: '💝' },
      { id: 5, title: 'Yêu Nhau', description: 'Chính thức là couple', icon: '💑' },
      { id: 6, title: 'Kỷ Niệm', description: 'Những ngày đặc biệt', icon: '🎂' },
    ],
    groupChats: ['💕 Single & Ready', '💑 Couple Goals', '💒 Wedding Plans', '❤️ Love Stories'],
    users: ['Mai Anh - 25 tuổi', 'Tuấn Kiệt - 27 tuổi', 'Linh Chi - 23 tuổi', 'Minh Đức - 26 tuổi'],
    relatedTopics: ['Dating Tips', 'Relationship Advice', 'Gift Ideas', 'Romantic Places', 'Communication'],
    questions: ['Làm sao biết người ấy thích mình?', 'Địa điểm hẹn hò lý tưởng?', 'Quà tặng ý nghĩa?']
  },
  music: {
    name: 'Âm Nhạc',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      bgGradient: ['from-purple-950', 'via-violet-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Khám Phá', description: 'Tìm thể loại yêu thích', icon: '🎵' },
      { id: 2, title: 'Playlist', description: 'Tạo danh sách nhạc', icon: '📱' },
      { id: 3, title: 'Concert', description: 'Tham dự live show', icon: '🎤' },
      { id: 4, title: 'Học Nhạc Cụ', description: 'Bắt đầu chơi đàn', icon: '🎸' },
      { id: 5, title: 'Sáng Tác', description: 'Viết bài hát riêng', icon: '🎼' },
      { id: 6, title: 'Biểu Diễn', description: 'Lên sân khấu đầu tiên', icon: '🎭' },
    ],
    groupChats: ['🎵 Indie Lovers', '🎸 Rock Vietnam', '🎹 EDM Community', '🎤 Cover Artists'],
    users: ['DJ Minh - Producer', 'Ca sĩ Hương - Vocalist', 'Tuấn - Guitarist', 'Linh - Music Teacher'],
    relatedTopics: ['New Releases', 'Music Theory', 'Instruments', 'Concerts', 'Spotify Playlists'],
    questions: ['Nhạc cụ nào dễ học nhất?', 'Làm sao tập hát hay?', 'Concert nào đáng xem?']
  },
  tech: {
    name: 'Công Nghệ',
    colors: {
      primary: '#06b6d4',
      secondary: '#22d3ee',
      accent: '#67e8f9',
      bgGradient: ['from-cyan-950', 'via-blue-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Học Code', description: 'Bắt đầu với HTML/CSS', icon: '💻' },
      { id: 2, title: 'First Project', description: 'Dự án đầu tiên hoàn thành', icon: '🚀' },
      { id: 3, title: 'GitHub', description: 'Đóng góp open source', icon: '🔧' },
      { id: 4, title: 'Hackathon', description: 'Tham gia cuộc thi lập trình', icon: '🏆' },
      { id: 5, title: 'Tech Lead', description: 'Dẫn dắt team phát triển', icon: '👨‍💻' },
      { id: 6, title: 'Launch App', description: 'Ra mắt sản phẩm riêng', icon: '🎯' },
    ],
    groupChats: ['👨‍💻 Developers VN', '⚛️ React Devs', '🐍 Python Club', '🤖 AI Engineers'],
    users: ['Alex - Full Stack Dev', 'Bình - Data Scientist', 'Châu - DevOps', 'Dũng - Mobile Dev'],
    relatedTopics: ['AI/ML', 'Web Dev', 'Mobile Apps', 'Cloud', 'Blockchain', 'Cybersecurity'],
    questions: ['Học ngôn ngữ nào trước?', 'Framework tốt nhất?', 'Làm sao giỏi coding?']
  },
  startup: {
    name: 'Khởi Nghiệp',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#fcd34d',
      bgGradient: ['from-amber-950', 'via-orange-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Ý Tưởng', description: 'Tìm ra problem cần giải quyết', icon: '💡' },
      { id: 2, title: 'MVP', description: 'Xây dựng sản phẩm tối thiểu', icon: '🛠️' },
      { id: 3, title: 'Co-founder', description: 'Xây dựng team sáng lập', icon: '🤝' },
      { id: 4, title: 'Launch', description: 'Ra mắt sản phẩm', icon: '🚀' },
      { id: 5, title: 'Fundraising', description: 'Gọi vốn đầu tư', icon: '💰' },
      { id: 6, title: 'Scale Up', description: 'Mở rộng quy mô', icon: '📈' },
    ],
    groupChats: ['💡 Startup Ideas', '🚀 Founders Club', '💰 Investors Network', '📊 Growth Hackers'],
    users: ['Founder Anh - CEO', 'Bình - CTO', 'Chi - Marketing Head', 'Duy - Product Manager'],
    relatedTopics: ['Business Model', 'Pitch Deck', 'Market Research', 'Funding', 'Growth Hacking'],
    questions: ['Làm sao validate ý tưởng?', 'Tìm investor ở đâu?', 'Khi nào nên fundraise?']
  },
  tinder: {
    name: 'Hẹn Hò Online',
    colors: {
      primary: '#ef4444',
      secondary: '#f87171',
      accent: '#fca5a5',
      bgGradient: ['from-red-950', 'via-pink-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Tạo Profile', description: 'Upload ảnh đẹp nhất', icon: '📸' },
      { id: 2, title: 'Swipe Right', description: 'Tìm người phù hợp', icon: '👉' },
      { id: 3, title: 'Match!', description: 'Cả hai đều thích nhau', icon: '💘' },
      { id: 4, title: 'Nhắn Tin', description: 'Bắt đầu trò chuyện', icon: '💬' },
      { id: 5, title: 'Date IRL', description: 'Hẹn gặp ngoài đời', icon: '☕' },
      { id: 6, title: 'Relationship', description: 'Phát triển mối quan hệ', icon: '❤️' },
    ],
    groupChats: ['🔥 Tinder Tips', '💝 Online Dating', '😂 Funny Profiles', '💯 Success Stories'],
    users: ['Nam - 28 tuổi - HCMC', 'Lan - 25 tuổi - HN', 'Khoa - 30 tuổi - DN', 'Thu - 26 tuổi - HCMC'],
    relatedTopics: ['Profile Tips', 'First Message', 'Date Ideas', 'Red Flags', 'Safety Tips'],
    questions: ['Làm sao có nhiều match?', 'Tin nhắn đầu nên nói gì?', 'Cách tránh ghosting?']
  },
  coffee: {
    name: 'Cà Phê',
    colors: {
      primary: '#92400e',
      secondary: '#b45309',
      accent: '#d97706',
      bgGradient: ['from-amber-950', 'via-yellow-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Khám Phá', description: 'Thử ly cà phê đầu tiên', icon: '☕' },
      { id: 2, title: 'Cafe Hopping', description: 'Khám phá quán mới', icon: '🏪' },
      { id: 3, title: 'Học Pha Chế', description: 'Tìm hiểu cách pha', icon: '👨‍🍳' },
      { id: 4, title: 'Home Brewing', description: 'Pha cà phê tại nhà', icon: '🏠' },
      { id: 5, title: 'Coffee Expert', description: 'Phân biệt các loại hạt', icon: '🎓' },
      { id: 6, title: 'Mở Quán', description: 'Khởi nghiệp quán cà phê', icon: '☕' },
    ],
    groupChats: ['☕ Coffee Lovers', '🏪 Cafe Recommendations', '👨‍🍳 Barista Tips', '🌱 Specialty Coffee'],
    users: ['Barista Tùng', 'Coffee Blogger Mai', 'Roaster Hải', 'Cafe Owner Linh'],
    relatedTopics: ['Brewing Methods', 'Coffee Beans', 'Latte Art', 'Cafe Reviews', 'Equipment'],
    questions: ['Pha phin hay espresso?', 'Quán cafe nào đẹp?', 'Hạt arabica vs robusta?']
  },
  movie: {
    name: 'Phim Ảnh',
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      bgGradient: ['from-violet-950', 'via-purple-950', 'to-slate-900']
    },
    events: [
      { id: 1, title: 'Rạp Chiếu', description: 'Xem phim đầu tiên ở rạp', icon: '🎬' },
      { id: 2, title: 'Netflix & Chill', description: 'Binge-watch series yêu thích', icon: '📺' },
      { id: 3, title: 'Film Festival', description: 'Tham dự LHP quốc tế', icon: '🎭' },
      { id: 4, title: 'Học Làm Phim', description: 'Khóa học điện ảnh', icon: '🎥' },
      { id: 5, title: 'Short Film', description: 'Quay phim ngắn đầu tiên', icon: '🎞️' },
      { id: 6, title: 'Premiere', description: 'Ra mắt tác phẩm riêng', icon: '🌟' },
    ],
    groupChats: ['🎬 Movie Buffs', '🍿 Netflix Party', '🎭 Indie Films', '📽️ Filmmakers VN'],
    users: ['Đạo diễn Tuấn', 'Critic Hương', 'Editor Mai', 'Actor Khôi'],
    relatedTopics: ['New Releases', 'Classic Films', 'Directors', 'Cinematography', 'Film Theory'],
    questions: ['Phim nào hay nhất năm?', 'Học làm phim ở đâu?', 'Thiết bị quay cần gì?']
  }
};

interface StarParticle {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    velocity: { x: number; y: number; };
}

// --- Component HxIUniverse (Thay thế TestPage) ---

export default function HxIUniverse({ theme = 'findjob' }: TestPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'universe' | 'groups' | 'users' | 'topics' | 'questions'>('universe');
  const eventsRef = useRef<TimelineEvent[]>([]);
  const starsRef = useRef<StarParticle[]>([]); // New ref for stars

  const currentTheme = themes[theme] || themes.findjob;
  const numStars = 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Khởi tạo các sự kiện (Hành tinh)
    const initEvents = () => {
      const width = canvas.width;
      const height = canvas.height;
      const events: TimelineEvent[] = [];
      
      currentTheme.events.forEach((event) => {
        events.push({
          ...event,
          x: Math.random() * (width - 200) + 100,
          y: Math.random() * (height - 300) + 150,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: 40
        });
      });
      
      eventsRef.current = events;
    };

    // Khởi tạo các hạt sao
    const initStars = () => {
        const stars: StarParticle[] = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                velocity: { x: (Math.random() - 0.5) * 0.05, y: (Math.random() - 0.5) * 0.05 }
            });
        }
        starsRef.current = stars;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (eventsRef.current.length === 0) {
        initEvents();
      }
      if (starsRef.current.length === 0) { // Khởi tạo sao khi resize
          initStars();
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // CẬP NHẬT: Thêm lực đẩy khi hover
    const updateEvent = (event: TimelineEvent) => {
      const isHovered = hoveredEvent === event.id;
      const baseRadius = 40;
      const targetRadius = isHovered ? baseRadius * 1.3 : baseRadius;

      // Smooth radius change
      event.radius += (targetRadius - event.radius) * 0.1; 

      // Cập nhật vị trí
      event.x += event.vx;
      event.y += event.vy;

      // Xử lý va chạm biên
      if (event.x - event.radius < 0 || event.x + event.radius > canvas.width) event.vx *= -1;
      if (event.y - event.radius < 0 || event.y + event.radius > canvas.height) event.vy *= -1;

      event.x = Math.max(event.radius, Math.min(canvas.width - event.radius, event.x));
      event.y = Math.max(event.radius, Math.min(canvas.height - event.radius, event.y));

      // Lực hấp dẫn/đẩy
      eventsRef.current.forEach(other => {
        if (other.id !== event.id) {
          const dx = other.x - event.x;
          const dy = other.y - event.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0 && dist < 300) {
            let force = 0.002;
            
            // Nếu một trong hai hành tinh đang được hover, tạo lực đẩy nhẹ
            if (isHovered || hoveredEvent === other.id) {
                force = -0.01; // Lực đẩy thay vì hấp dẫn
            }

            event.vx += (dx / dist) * force;
            event.vy += (dy / dist) * force;
          }
        }
      });

      // Giới hạn vận tốc
      const maxSpeed = 1.5;
      const speed = Math.sqrt(event.vx * event.vx + event.vy * event.vy);
      if (speed > maxSpeed) {
        event.vx = (event.vx / speed) * maxSpeed;
        event.vy = (event.vy / speed) * maxSpeed;
      }
    };
    
    // HÀM MỚI: Cập nhật và vẽ các hạt sao
    const updateAndDrawStars = () => {
        ctx.fillStyle = '#FFFFFF';
        starsRef.current.forEach(star => {
            star.x += star.velocity.x;
            star.y += star.velocity.y;
            star.alpha = (Math.sin(Date.now() * 0.001 + star.x * 0.01) + 1) / 2; // Hiệu ứng nhấp nháy

            // Loop stars when out of bounds
            if (star.x < 0 || star.x > canvas.width) star.x = star.x < 0 ? canvas.width : 0;
            if (star.y < 0 || star.y > canvas.height) star.y = star.y < 0 ? canvas.height : 0;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.globalAlpha = star.alpha * 0.6;
            ctx.fill();
        });
        ctx.globalAlpha = 1; // Reset global alpha
    }

    const drawConnections = () => {
      const events = eventsRef.current;
      for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
          const dx = events[i].x - events[j].x;
          const dy = events[i].y - events[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 250) {
            ctx.beginPath();
            const opacity = (1 - dist / 250) * 0.5; // Tăng độ sáng đường nối
            // Sử dụng màu accent cho đường nối
            ctx.strokeStyle = `${currentTheme.colors.accent}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`; 
            ctx.lineWidth = 2; // Đường nối dày hơn
            ctx.moveTo(events[i].x, events[i].y);
            ctx.lineTo(events[j].x, events[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawEvent = (event: TimelineEvent) => {
      const isHovered = hoveredEvent === event.id;
      const size = event.radius; // Dùng event.radius đã được smooth

      // Draw glow (Cải tiến hiệu ứng glow)
      ctx.beginPath();
      ctx.arc(event.x, event.y, size + 15, 0, Math.PI * 2);
      const glowOpacity = isHovered ? 0.7 : 0.4; // Sáng hơn khi hover
      const glowColor = `${currentTheme.colors.secondary}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`;
      const glowGradient = ctx.createRadialGradient(event.x, event.y, 0, event.x, event.y, size + 20);
      glowGradient.addColorStop(0, glowColor);
      glowGradient.addColorStop(1, `${currentTheme.colors.primary}00`);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw circle background
      ctx.beginPath();
      ctx.arc(event.x, event.y, size, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(event.x, event.y, 0, event.x, event.y, size);
      gradient.addColorStop(0, currentTheme.colors.secondary);
      gradient.addColorStop(1, currentTheme.colors.primary);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = currentTheme.colors.accent;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw icon
      ctx.font = `${size * 0.7}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(event.icon, event.x, event.y + size * 0.05); // Điều chỉnh vị trí icon

      // Draw title
      if (!isHovered) {
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(event.title, event.x, event.y + size + 15);
        ctx.shadowBlur = 0;
      }
    };

    const animate = () => {
      // Làm mờ nhẹ nền (trail effect)
      ctx.fillStyle = 'rgba(5, 8, 20, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateAndDrawStars(); // Vẽ các hạt sao

      drawConnections();

      eventsRef.current.forEach(event => {
        updateEvent(event);
        drawEvent(event);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredEvent, currentTheme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let foundEvent: number | null = null;
    eventsRef.current.forEach(event => {
      const dx = mouseX - event.x;
      const dy = mouseY - event.y;
      // Dùng bán kính cơ bản 40 + padding 10 để dễ hover hơn
      if (Math.sqrt(dx * dx + dy * dy) < 50) foundEvent = event.id; 
    });
    setHoveredEvent(foundEvent);
  };

  const hoveredData = eventsRef.current.find(e => e.id === hoveredEvent);
  
  // --- HÀM TƯƠNG TÁC (Placeholder) ---
  const handleJoinGroup = (group: string) => alert(`Đã tham gia nhóm: ${group}! (Logic Socket.IO sẽ kích hoạt)`);
  const handleViewUser = (user: string) => alert(`Xem hồ sơ của: ${user}`);
  const handleAnswerQuestion = (q: string) => alert(`Bắt đầu trả lời câu hỏi: ${q}`);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-b ${currentTheme.colors.bgGradient.join(' ')}`}>
      {/* Cải tiến: Thêm lớp overlay nhẹ để tăng độ sâu */}
      <div className='absolute inset-0 bg-black/10' /> 
      
      <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="absolute inset-0 cursor-pointer" />
      
      {/* Tiêu đề */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none">
        <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-2xl tracking-wide" style={{
          textShadow: `0 0 25px ${currentTheme.colors.accent}99, 0 0 50px ${currentTheme.colors.primary}70` // Hiệu ứng Shadow đẹp hơn
        }}>
          HX.I: {currentTheme.name}
        </h1>
        <p className="text-gray-300 text-base opacity-90 font-light">
          Kết nối con người qua các mốc quan trọng và chủ đề liên quan.
        </p>
      </div>

      {/* Popover Chi tiết Event */}
      {hoveredData && activeTab === 'universe' && (
        <div className="absolute z-20 bg-slate-800/90 backdrop-blur-md border border-white/30 rounded-xl p-5 shadow-2xl max-w-xs pointer-events-none transition-all duration-300"
          style={{ 
            left: `${hoveredData.x}px`, 
            top: `${hoveredData.y}px`, 
            transform: 'translate(-50%, calc(-100% - 60px))',
            borderColor: currentTheme.colors.accent // Màu border theo theme
          }}>
          <div className="text-4xl mb-2 text-center text-white">{hoveredData.icon}</div>
          <h3 className="text-white text-lg font-bold mb-1 border-b pb-1" style={{ borderColor: currentTheme.colors.primary }}>{hoveredData.title}</h3>
          <p className="text-gray-300 text-sm">{hoveredData.description}</p>
        </div>
      )}

      {/* Panel Tương tác Dưới */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-4xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/20"> 
          
          {/* Tabs */}
          <div className="flex gap-3 mb-4 flex-wrap justify-center">
            {(['universe', 'groups', 'users', 'topics', 'questions'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                  activeTab === tab 
                    ? 'text-white shadow-lg' 
                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
                }`} 
                style={activeTab === tab ? { 
                  background: `linear-gradient(to right, ${currentTheme.colors.primary} 30%, ${currentTheme.colors.secondary})`,
                  boxShadow: `0 4px 15px ${currentTheme.colors.primary}60` // Shadow theo màu chủ đạo
                } : {}}>
                {tab === 'universe' && '🌌 Timeline Map'}
                {tab === 'groups' && '💬 Group Chat'}
                {tab === 'users' && '👥 Người Tiềm Năng'}
                {tab === 'topics' && '🏷️ Chủ Đề Liên Quan'}
                {tab === 'questions' && '❓ Hỏi & Đáp'}
              </button>
            ))}
          </div>

          <div className="text-white">
            {activeTab === 'universe' && (
              <div className="text-center text-gray-400 text-sm py-4 border-t border-white/10">
                **Map Vũ Trụ:** Các hành tinh là các mốc quan trọng trong chủ đề **{currentTheme.name}**. Hover để xem mô tả.
              </div>
            )}
            
            {/* Tab Groups */}
            {activeTab === 'groups' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-2">
                {currentTheme.groupChats.map((group, i) => (
                  <div key={i} className="bg-slate-800/70 rounded-lg p-3 transition-colors cursor-pointer border-l-4 flex items-center justify-between"
                       style={{ borderLeftColor: currentTheme.colors.primary }}>
                    <div>
                        <div className="font-semibold text-gray-100">{group}</div>
                        <div className="text-xs text-gray-400 mt-1">{Math.floor(Math.random() * 500 + 50)} thành viên đang online</div>
                    </div>
                    <button 
                        onClick={() => handleJoinGroup(group)}
                        className="px-3 py-1 text-sm rounded-full bg-transparent border transition-all hover:scale-105"
                        style={{ borderColor: currentTheme.colors.accent, color: currentTheme.colors.accent }}
                    >
                        Tham Gia
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Users */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-2">
                {currentTheme.users.map((user, i) => (
                  <div key={i} className="bg-slate-800/70 rounded-lg p-3 transition-colors cursor-pointer flex items-center justify-between gap-3 shadow-inner">
                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-xl font-bold text-white"
                             style={{ background: `linear-gradient(to bottom right, ${currentTheme.colors.secondary}, ${currentTheme.colors.primary})` }}>
                            {user.charAt(0)}
                        </div>
                        <div className="text-sm font-medium">{user}</div>
                    </div>
                    <button 
                        onClick={() => handleViewUser(user)}
                        className="px-3 py-1 text-xs rounded-full bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors"
                    >
                        Xem Profile
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Topics */}
            {activeTab === 'topics' && (
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-2 justify-center">
                {currentTheme.relatedTopics.map((topic, i) => (
                  <div key={i} className="rounded-full px-4 py-2 text-sm transition-colors cursor-pointer border font-medium hover:scale-105"
                       style={{ 
                          backgroundColor: `${currentTheme.colors.primary}20`, // Nền mờ của màu primary
                          borderColor: currentTheme.colors.primary, 
                          color: currentTheme.colors.accent 
                       }}>
                    **#**{topic}
                  </div>
                ))}
              </div>
            )}
            
            {/* Tab Questions */}
            {activeTab === 'questions' && (
              <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                {currentTheme.questions.map((q, i) => (
                  <div key={i} className="bg-slate-800/70 rounded-lg p-3 transition-colors cursor-pointer flex justify-between items-center border-b border-white/10 hover:bg-slate-700/70">
                    <div>
                        <div className="text-sm font-medium text-gray-200">{q}</div>
                        <div className="text-xs text-gray-400 mt-1">{Math.floor(Math.random() * 50 + 5)} câu trả lời</div>
                    </div>
                    <button 
                         onClick={() => handleAnswerQuestion(q)}
                        className="px-3 py-1 text-sm rounded-full bg-transparent border transition-all hover:bg-white/10"
                        style={{ borderColor: currentTheme.colors.accent, color: currentTheme.colors.accent }}
                    >
                        Trả Lời
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}