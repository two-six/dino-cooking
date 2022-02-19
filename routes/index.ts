import { Router, helpers } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/index.ts';

const router = new Router();

router.get('/', controller.getHomepage);

export default router;