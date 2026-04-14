import User from '#models/User'
import { SignupValidator } from '#validators/SignupValidator'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * RegisterController handles user registration.
 * It provides methods for displaying the signup page and creating
 * new user accounts.
 */
export default class RegisterController {
  /**
   * Display the signup page
   */
  async create({ view }: HttpContext) {
    return view.render('pages/auth/signup')
  }

  /**
   * Create a new user account and authenticate the user
   */
  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(SignupValidator)
    const user = await User.create({ ...payload })

    await auth.use('web').login(user)
    return response.redirect('/')
  }
}
