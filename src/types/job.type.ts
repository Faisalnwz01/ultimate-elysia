export type Job = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateJobDTO = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateJobDTO = Partial<CreateJobDTO>;