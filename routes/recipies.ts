import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/recipies.ts';

const router = new Router();

router.get('/recipies/view', controller.view);
router.post('/recipies/add', controller.add);
router.delete('/recipies/remove/:id', controller.remove);
router.put('/recipies/edit/:id', controller.edit);
router.put('/recipies/rate/:id', controller.rate);

export default router;