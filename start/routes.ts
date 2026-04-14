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
    router.get('signup', [controllers.NewAccount, 'create']).as('signup')
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create']).as('login')
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('logout')
  })
  .use(middleware.auth())
