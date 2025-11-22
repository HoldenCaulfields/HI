
import { NodeType, ThemeConfig, UniverseData, GraphNode, GraphLink } from '../proversion/types';

const getThemeForQuery = (query: string): ThemeConfig => {
  const q = query.toLowerCase().trim();
  
  if (q.includes('love') || q.includes('sad') || q.includes('lonely') || q.includes('crush')) {
    return {
      name: 'Passion',
      background: 'radial-gradient(circle at center, #2b0510 0%, #000000 100%)',
      nodeColors: { 
        [NodeType.ROOT]: '#ff0055', 
        [NodeType.ANSWER]: '#ff4d7d', 
        [NodeType.USER]: '#ffa6c1', 
        [NodeType.GROUP]: '#ff0055', 
        [NodeType.RELATED]: '#800f2f' 
      },
      lineColor: '#ff0055', 
      particleColor: '#ff4d7d', 
      fontColor: '#ffe6eb',
      vibeDescription: "Emotional Resonance Frequency detected."
    };
  }
  if (q.includes('code') || q.includes('js') || q.includes('react') || q.includes('bug')) {
    return {
      name: 'Matrix',
      background: 'linear-gradient(135deg, #050a14 0%, #001a33 100%)',
      nodeColors: { 
        [NodeType.ROOT]: '#00ff9d', 
        [NodeType.ANSWER]: '#00ccff', 
        [NodeType.USER]: '#e0ffff', 
        [NodeType.GROUP]: '#00ff9d', 
        [NodeType.RELATED]: '#005544' 
      },
      lineColor: '#00ff9d', 
      particleColor: '#00ff9d', 
      fontColor: '#ccffee',
      vibeDescription: "Developer Neural Link established."
    };
  }
  return {
    name: 'Cosmos',
    background: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a12 100%)',
    nodeColors: { 
      [NodeType.ROOT]: '#ffffff', 
      [NodeType.ANSWER]: '#7b2cbf', 
      [NodeType.USER]: '#4cc9f0', 
      [NodeType.GROUP]: '#4361ee', 
      [NodeType.RELATED]: '#3f37c9' 
    },
    lineColor: '#4cc9f0', 
    particleColor: '#ffffff', 
    fontColor: '#ffffff',
    vibeDescription: "Exploring the Human Collective."
  };
};

const REAL_USERS = ['Sarah_K', 'DevMike', 'Chef_Boy', 'Traveler_99', 'MusicLover', 'ZenMaster', 'Alice_Wonder', 'Neo_Hacker', 'CoffeeAddict', 'SkyWalker', 'Byte_Me', 'Luna_Love'];
const RELATED_TOPICS_MAP: Record<string, string[]> = {
  'default': ['Life Advice', 'Trending', 'Viral', 'Help'],
  'tech': ['Web3', 'AI Tools', 'Startup', 'Debugging'],
  'emotion': ['Therapy', 'Venting', 'Friends', 'Relationships'],
  'job': ['Resume Tips', 'Interview Prep', 'Remote Work', 'Salary']
};

export const generateUniverseData = (query: string, width: number, height: number): UniverseData => {
  const theme = getThemeForQuery(query);
  const center = { x: width / 2, y: height / 2 };
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const isQuestion = query.includes('?') || query.toLowerCase().startsWith('how') || query.toLowerCase().startsWith('what') || query.toLowerCase().startsWith('why');
  const isTech = query.toLowerCase().includes('code') || query.toLowerCase().includes('js');
  const isEmotion = query.toLowerCase().includes('sad') || query.toLowerCase().includes('love');

  // Root Node
  const rootId = 'root';
  nodes.push({
    id: rootId, 
    label: query.length > 20 ? query.substring(0, 20) + '...' : query, 
    type: NodeType.ROOT,
    x: center.x, y: center.y, vx: 0, vy: 0, 
    radius: 60, 
    color: theme.nodeColors.ROOT, 
    details: isQuestion 
      ? `Question Hub: ${Math.floor(Math.random() * 500)} humans contributed.`
      : `Topic Universe: ${Math.floor(Math.random() * 2000)} humans active.`
  });

  const addNode = (opts: Partial<GraphNode> & { parentId: string, distance: number }) => {
    const angle = Math.random() * Math.PI * 2;
    const id = Math.random().toString(36).substring(2, 9);
    const dist = opts.distance;
    
    const node: GraphNode = {
      id,
      label: 'Node',
      type: NodeType.RELATED,
      x: center.x + Math.cos(angle) * dist,
      y: center.y + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: 20,
      color: theme.nodeColors[NodeType.RELATED],
      ...opts
    };
    
    if (!opts.color) {
      node.color = theme.nodeColors[node.type];
    }

    nodes.push(node);
    links.push({ source: opts.parentId, target: id, value: 1 });
    return id;
  };

  // --- 1. ANSWERS (If Question) ---
  if (isQuestion) {
    const answers = [
      { 
        text: "I tried this method and it worked...", 
        fullAnswer: "I actually struggled with this for weeks. The key is to be consistent. I tried this method and it worked perfectly after about 3 days. Don't give up!",
        author: "Chef_Boy", votes: 142,
        comments: [
           {id: 'c1', author: 'UserA', text: 'Worked for me too!', timestamp: new Date()},
           {id: 'c2', author: 'UserB', text: 'Can you explain step 2?', timestamp: new Date()}
        ]
      },
      { 
        text: "Context is key here.", 
        fullAnswer: "It really depends on the context. If you are doing X, then Y. But if you are doing Z, then A. Can you provide more details?",
        author: "DevMike", votes: 89,
        comments: []
      },
      { 
        text: "Check the docs linked below.", 
        fullAnswer: "Official documentation usually covers this edge case. Here is the link...",
        author: "RTFM_Bot", votes: 12,
        comments: []
      },
      { 
        text: "Don't listen to the top answer.", 
        fullAnswer: "Unpopular opinion, but the top answer is outdated. Modern approach is...",
        author: "Contrarian_One", votes: 45,
        comments: [{id: 'c3', author: 'OldSchool', text: 'Debatable.', timestamp: new Date()}]
      },
    ];

    answers.forEach((ans) => {
      addNode({
        parentId: rootId,
        distance: 140 + (Math.random() * 60),
        type: NodeType.ANSWER,
        label: ans.text.substring(0, 15) + '...',
        radius: 35 + (ans.votes / 10),
        answerData: ans,
        details: ans.text
      });
    });
  }

  // --- 2. GROUPS (Community Hubs) ---
  const groups = isTech 
    ? ['React Devs', 'JS Help', 'Career Talk', 'Showcase'] 
    : isEmotion 
      ? ['Vent Room', 'Kindness Corner', 'Late Night', 'Music Share']
      : ['General Chat', 'Experts Only', 'Beginners', 'Voice Room 🔊'];
    
  groups.forEach((g) => {
    const gid = addNode({
      parentId: rootId,
      distance: 220 + (Math.random() * 80),
      type: NodeType.GROUP,
      label: g,
      radius: 45,
      details: `${g} - Live discussion related to "${query}"`,
      onlineCount: Math.floor(Math.random() * 300) + 10
    });

    // Users orbiting groups
    const userCount = Math.floor(Math.random() * 4) + 1;
    for(let i=0; i<userCount; i++) {
      const uName = REAL_USERS[Math.floor(Math.random() * REAL_USERS.length)];
      addNode({
        parentId: gid,
        distance: 70,
        type: NodeType.USER,
        label: uName,
        radius: 15,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uName}`,
        details: "Active in this group"
      });
    }
  });

  // --- 3. RELATED SEARCHES (Navigation Nodes) ---
  const relatedKey = isTech ? 'tech' : isEmotion ? 'emotion' : 'default';
  const relatedTopics = RELATED_TOPICS_MAP[relatedKey];
  
  relatedTopics.forEach(topic => {
      addNode({
          parentId: rootId,
          distance: 350 + (Math.random() * 50),
          type: NodeType.RELATED,
          label: topic,
          radius: 25,
          details: "Click to travel to this universe"
      });
  });

  // --- 4. DRIFTING USERS (Direct Connection Opportunities) ---
  for(let i=0; i<4; i++) {
    const uName = REAL_USERS[Math.floor(Math.random() * REAL_USERS.length)];
    addNode({
      parentId: rootId,
      distance: 280 + (Math.random() * 150),
      type: NodeType.USER,
      label: uName,
      radius: 18,
      img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uName}`,
      details: "Searching for the same thing..."
    });
  }

  return { nodes, links, theme };
};
