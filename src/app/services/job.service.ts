import { PrismaClient } from '@prisma/client';
import { CreateJobDTO, UpdateJobDTO } from '../../types/job.type';

export class JobService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.job.findMany();
  }

  async findById(id: number) {
    return this.prisma.job.findUnique({
      where: { id }
    });
  }

  async create(data: CreateJobDTO) {
    return this.prisma.job.create({
      data
    });
  }

  async update(id: number, data: UpdateJobDTO) {
    return this.prisma.job.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.job.delete({
      where: { id }
    });
  }
}