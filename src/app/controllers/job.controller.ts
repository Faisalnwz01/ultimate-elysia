import { Elysia, t } from 'elysia';
import { JobService } from '../services/job.service';
import { prisma } from '../../lib/prisma';

const jobService = new JobService(prisma);

export const jobController = new Elysia({ prefix: '/api/jobs' })
  .get('/', async () => {
    return await jobService.findAll();
  })
  .get('/:id', async ({ params: { id } }) => {
    return await jobService.findById(Number(id));
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .post('/', async ({ body }) => {
    return await jobService.create(body);
  }, {
    body: t.Object({
      title: t.String(),
      description: t.String()
    })
  })
  .put('/:id', async ({ params: { id }, body }) => {
    return await jobService.update(Number(id), body);
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      title: t.Optional(t.String()),
      description: t.Optional(t.String())
    })
  })
  .delete('/:id', async ({ params: { id } }) => {
    return await jobService.delete(Number(id));
  }, {
    params: t.Object({
      id: t.String()
    })
  });