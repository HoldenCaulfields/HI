
const getThemeForQuery = (query) => {
  const q = query.toLowerCase().trim();
  
  if (q.includes('love') || q.includes('heart') || q.includes('date')) {
    return {
      name: 'Passion',
      background: 'radial-gradient(circle at center, #4a0e16 0%, #1a0508 100%)',
      nodeColors: { ROOT: '#ff0055', ANSWER: '#ff6688', USER: '#ff99aa', GROUP: '#ff3366', KEYWORD: '#882244' },
      lineColor: '#ff0055', particleColor: '#ff99aa', fontColor: '#ffddee',
      vibeDescription: "A nebula of emotions and connections."
    };
  }
  if (q.includes('tech') || q.includes('code') || q.includes('ai')) {
    return {
      name: 'Cyberpunk',
      background: 'linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)',
      nodeColors: { ROOT: '#00ffff', ANSWER: '#0099ff', USER: '#ffffff', GROUP: '#00cc99', KEYWORD: '#004466' },
      lineColor: '#00ffff', particleColor: '#00ffff', fontColor: '#ccffff',
      vibeDescription: "The digital frontier. Data streams and neural links."
    };
  }
  if (q.includes('job') || q.includes('work') || q.includes('career')) {
    return {
      name: 'Corporate',
      background: 'linear-gradient(to bottom, #1e3c72, #2a5298)',
      nodeColors: { ROOT: '#ffffff', ANSWER: '#bbddff', USER: '#88aacc', GROUP: '#446688', KEYWORD: '#224466' },
      lineColor: '#ffffff', particleColor: '#aabbcc', fontColor: '#ffffff',
      vibeDescription: "Professional network constellation."
    };
  }
  if (q.includes('music') || q.includes('song') || q.includes('art')) {
    return {
      name: 'Neon',
      background: 'linear-gradient(45deg, #2c3e50, #000000)',
      nodeColors: { ROOT: '#ff00ff', ANSWER: '#cc00cc', USER: '#ffff00', GROUP: '#00ff00', KEYWORD: '#660066' },
      lineColor: '#ff00ff', particleColor: '#ffff00', fontColor: '#ffffff',
      vibeDescription: "Rhythm and visual harmony."
    };
  }
  return {
    name: 'Cosmos',
    background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    nodeColors: { ROOT: '#ffffff', ANSWER: '#e94560', USER: '#0f3460', GROUP: '#533483', KEYWORD: '#7a8b99' },
    lineColor: '#e94560', particleColor: '#ffffff', fontColor: '#ffffff',
    vibeDescription: "The infinite void of knowledge."
  };
};

export const generateUniverseData = (query) => {
  const theme = getThemeForQuery(query);
  const width = 1000; 
  const height = 800;
  const center = { x: width / 2, y: height / 2 };
  
  const nodes = [];
  const links = [];

  // Root
  nodes.push({
    id: 'root', label: query.toUpperCase(), type: 'ROOT',
    x: center.x, y: center.y, vx: 0, vy: 0, radius: 40, val: 10,
    color: theme.nodeColors.ROOT, details: `The singularity of "${query}".`
  });

  const keywords = ['Future', 'Idea', 'Concept', 'Deep', 'Link', 'Source', 'Meaning', 'Trend', 'Orbit', 'Pulse'];
  const answers = ['This is the way.', '42', 'It depends on context.', 'Search deeper within.', 'Connection found.', 'Expanding...'];
  const users = ['Neo_99', 'Alice_W', 'Bot_X', 'Dr_Strange', 'Seeker01', 'Star_Lord', 'Cosmic_Dev'];
  const groups = ['The Thinkers', 'General Chat', 'Deep Dive', 'Random'];

  const addNode = (label, type, parentId, dist) => {
    const angle = Math.random() * Math.PI * 2;
    const id = Math.random().toString(36).substr(2, 9);
    const r = type === 'ANSWER' ? 25 : type === 'KEYWORD' ? 15 : 20;
    
    nodes.push({
      id, label, type,
      x: center.x + Math.cos(angle) * dist,
      y: center.y + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: r, val: r / 5,
      color: theme.nodeColors[type],
      details: `A ${type.toLowerCase()} node related to ${query}.`,
      img: type === 'USER' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${label}` : undefined
    });
    links.push({ source: parentId, target: id, value: 1 });
    return id;
  };

  // Orbit 1
  [...groups, ...answers].forEach((item, i) => {
    const type = groups.includes(item) ? 'GROUP' : 'ANSWER';
    const id = addNode(item, type, 'root', 150 + Math.random() * 50);
    
    // Orbit 2
    const subCount = Math.floor(Math.random() * 3) + 1;
    for(let j=0; j<subCount; j++) {
      const isUser = Math.random() > 0.5;
      const label = isUser ? users[Math.floor(Math.random() * users.length)] : keywords[Math.floor(Math.random() * keywords.length)];
      addNode(label + `_${i}${j}`, isUser ? 'USER' : 'KEYWORD', id, 80);
    }
  });

  for(let k=0; k<5; k++) {
      addNode(keywords[k] || 'Data', 'KEYWORD', 'root', 250);
  }

  return { nodes, links, theme };
};
