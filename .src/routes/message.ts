import { Router, helpers } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/message.ts';

const router = new Router();

router.get('/messages', controller.getMessages);
router.post('/messages', controller.createMessage);
router.get('/messages/:messageId', controller.getMessage);

export default router;