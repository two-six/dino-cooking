import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import session from '../controllers/session.ts';

const router = new Router();

router.get('/session', session.getSession);

export default router;