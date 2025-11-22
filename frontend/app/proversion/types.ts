
export enum NodeType {
  ROOT = 'ROOT',
  USER = 'USER',
  GROUP = 'GROUP',
  ANSWER = 'ANSWER',
  RELATED = 'RELATED'
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  avatar?: string;
}

export interface AnswerData {
  text: string;
  fullAnswer: string; // Longer content
  author: string;
  votes: number;
  comments: Comment[];
  isTopRated?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  details?: string;
  img?: string;
  onlineCount?: number;
  answerData?: AnswerData; 
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface ThemeConfig {
  name: string;
  background?: string;
  bgGradient?: string;
  lineColor: string;
  fontColor: string;
  particleColor?: string;
  vibeDescription: string;
  nodeColors: {
    [key in NodeType]: string;
  };
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMe: boolean;
  avatar?: string;
  role?: 'expert' | 'newbie' | 'mod';
}

export interface UniverseData {
  nodes: GraphNode[];
  links: GraphLink[];
  theme: ThemeConfig;
}
