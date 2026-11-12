import { Router } from 'express';
import projects from './projects.js';
import tasks from './tasks.js';
import skills from './skills.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/projects', projects);
router.use('/tasks', tasks);
router.use('/skills', skills);

export default router;
