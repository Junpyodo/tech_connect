export type UserRole = "recruiter" | "employee";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  techStack: string[];
  bio: string;
  experience: string;
  company?: string;
}

export interface Post {
  id: string;
  authorId: string;
  type: "job" | "news";
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  likes: number;
}

export const currentUser: User = {
  id: "u1",
  name: "Alex Developer",
  role: "employee",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  techStack: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  bio: "Full-stack developer passionate about building scalable web applications and intuitive user interfaces.",
  experience: "5 years building SaaS products. Previously at TechCorp.",
};

export const mockPosts: Post[] = [
  {
    id: "p1",
    authorId: "r1",
    type: "job",
    title: "Senior Frontend Engineer (React)",
    content: "We are looking for a Senior Frontend Engineer to join our core team. You will be responsible for building our next-generation web application. Must have strong experience with React, TypeScript, and performance optimization.",
    tags: ["React", "TypeScript", "Frontend"],
    createdAt: "2h ago",
    likes: 24,
  },
  {
    id: "p2",
    authorId: "u2",
    type: "news",
    title: "React 19 RC is out!",
    content: "The first Release Candidate for React 19 is now available. It includes the new compiler and several concurrent rendering improvements. Have you tried it yet?",
    tags: ["React", "News", "Frontend"],
    createdAt: "5h ago",
    likes: 156,
  },
  {
    id: "p3",
    authorId: "r2",
    type: "job",
    title: "Backend Node.js Developer",
    content: "Join our fintech startup as a Backend Developer. You will design and implement robust APIs using Node.js and PostgreSQL. Experience with microservices is a plus.",
    tags: ["Node.js", "PostgreSQL", "Backend"],
    createdAt: "1d ago",
    likes: 12,
  },
];

export const mockNews = [
  { id: "n1", title: "Tailwind CSS v4.0 is now in beta", source: "Tailwind Blog", time: "1h ago" },
  { id: "n2", title: "The State of JavaScript 2024 Results", source: "JS Survey", time: "3h ago" },
  { id: "n3", title: "Vercel announces new Postgres pricing", source: "Vercel News", time: "5h ago" },
  { id: "n4", title: "Why Server Components are the future", source: "Dev.to", time: "12h ago" },
];