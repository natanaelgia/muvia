/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

// Home page - redirects to login
router.get('/', ({ response }) => response.redirect('/login')).as('home')

router
  .group(() => {
    router.get('signup', [controllers.Register, 'create']).as('signup')
    router.post('signup', [controllers.Register, 'store']).as('register.store')

    router.get('login', [controllers.Login, 'create']).as('login')
    router.post('login', [controllers.Login, 'store']).as('login.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Login, 'destroy']).as('logout')
  })
  .use(middleware.auth())
