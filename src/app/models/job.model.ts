export interface Job {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobDto {
  title: string;
  description: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}