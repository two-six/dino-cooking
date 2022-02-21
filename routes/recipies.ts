import { Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

import controller from '../controllers/recipies.ts';

const router = new Router();

router.get('/recipies/view', controller.viewRecipies);
router.post('/recipies/add', controller.addRecipe);

export default router;