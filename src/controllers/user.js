import { addPartials, getUserData, notifications } from '../util.js'
import { register, login, getAll, deleteById } from '../data.js'


export async function registerPage() {
    addPartials(this)
    this.partial('/templates/user/register.hbs')
}

export async function postRegister(context) {

    const { email, password, rePassword } = context.params

    try {
        if (email.length <= 0 || password.length <= 0) {
            throw new Error('All fields are required!')
        }

        if (password !== rePassword) {
            throw new Error('Passwords must match!')
        }

        notifications('showLoader', '')

        const result = await register(email, password)
        notifications('hideLoader', '')

        notifications('success', 'User registration successful.')

        context.redirect('/home')

    } catch (err) {
        notifications('error', err.message.toLowerCase())
    }

}

export async function loginPage() {
    addPartials(this)
    this.partial('/templates/user/login.hbs')
}

export async function postLogin(context) {

    const { email, password } = context.params

    try {
        if (email.length <= 0 || password.length <= 0) {
            throw new Error('All fields are required!')
        }

        notifications('showLoader', '')

        const result = await login(email, password)

        notifications('hideLoader', '')
        notifications('success', 'You\'ve logged successfully.')
        context.redirect('/home')

    } catch (err) {
        notifications('error', err.message.toLowerCase())

    }

}


export async function logoutPage() {
    localStorage.removeItem('auth')
    notifications('success', 'Logout successful.')
    this.redirect('/login')
}


export async function myDestinationsPage() {
    await addPartials(this)

    const allDestinations = await getAll()
    const user = getUserData()

    const currentUserDestinations = allDestinations.filter(destination => destination._ownerId == user.localId)
    const context = { currentUserDestinations }

    this.partial('/templates/user/myDestinations.hbs', context)
}

export async function removePage() {

    notifications('showLoader', '')

    await deleteById(this.params._id)

    notifications('hideLoader', '')
    notifications('success', 'Destination deleted.')

    this.redirect('/myDestinations')

}