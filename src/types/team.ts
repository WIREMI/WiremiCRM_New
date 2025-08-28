// Team Management Types
export interface TeamMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
  department: string;
  avatar?: string;
  status: TeamMemberStatus;
  permissions: string[];
  tasksAssigned: number;
  tasksCompleted: number;
  lastActive: string;
  invitedBy: string;
  invitedAt: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  assignedBy: string;
  projectId?: string;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  dependencies: string[]; // Task IDs
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  teamMembers: string[];
  budget?: number;
  spent?: number;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  milestones: ProjectMilestone[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: MilestoneStatus;
  completedAt?: string;
}

export interface TaskAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

// Enums
export enum TeamRole {
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  GRAPHIC_DESIGNER = 'GRAPHIC_DESIGNER',
  VIDEO_EDITOR = 'VIDEO_EDITOR',
  SOCIAL_MEDIA_MANAGER = 'SOCIAL_MEDIA_MANAGER',
  COPYWRITER = 'COPYWRITER',
  SEO_SPECIALIST = 'SEO_SPECIALIST',
  PPC_SPECIALIST = 'PPC_SPECIALIST'
}

export enum TeamMemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export enum TaskType {
  CONTENT_CREATION = 'CONTENT_CREATION',
  DESIGN = 'DESIGN',
  VIDEO_EDITING = 'VIDEO_EDITING',
  CAMPAIGN_SETUP = 'CAMPAIGN_SETUP',
  REVIEW = 'REVIEW',
  RESEARCH = 'RESEARCH',
  ANALYSIS = 'ANALYSIS'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}