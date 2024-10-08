export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  categories: string[];
}

export enum TaskStatus {
  PENDING,
  COMPLETED,
  CANCELED,
  OVERDUE,
}
