import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/comments.ts';

const router = new Router();

router.post('/comment/add/:id', controller.add);

export default router;