
export enum NodeType {
  ROOT = 'ROOT',
  ANSWER = 'ANSWER',
  USER = 'USER',
  GROUP = 'GROUP',
  KEYWORD = 'KEYWORD',
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  details?: string;
  img?: string;
  val: number;
  color: string;

  // Physics properties
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;

  // D3 Simulation properties
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string; // ID
  target: string; // ID
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  theme: ThemeConfig;
}

export interface ThemeConfig {
  name: string;
  background: string;
  nodeColors: {
    [key in NodeType]: string;
  };
  lineColor: string;
  particleColor: string;
  fontColor: string;
  vibeDescription: string;
}
