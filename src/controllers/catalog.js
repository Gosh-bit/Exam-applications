import { addPartials, getUserId, notifications } from '../util.js'
import { getAll, create, getById, edit } from '../data.js'

export async function homePage() {

    await addPartials(this)
    notifications('showLoader', '')

    const destinations = await getAll();
    notifications('hideLoader', '')

    const context = { destinations }

    this.partial('/templates/catalog/home.hbs', context)
}

export async function createPage() {
    await addPartials(this)
    this.partial('/templates/catalog/create.hbs')

}

export async function detailsPage() {
    await addPartials(this)

    const { _id } = this.params
    notifications('showLoader', '')

    const destination = await getById(_id)
    notifications('hideLoader', '')

    const isAuthor = destination._ownerId === getUserId()

    const context = { destination, isAuthor }
    this.partial('/templates/catalog/details.hbs', context)

}

export async function editPage() {
    await addPartials(this)

    const { _id } = this.params
    notifications('showLoader', '')

    const destination = await getById(_id)
    notifications('hideLoader', '')

    const context = { destination }
    this.partial('/templates/catalog/edit.hbs', context)

}

export async function postEdit(context) {
    const { _id, destination, city, duration, departureDate, imgUrl } = context.params
    try {
        if (destination.length <= 0 || city.length <= 0 || duration.length <= 0 || departureDate.length <= 0 || imgUrl.length <= 0) {
            throw new Error('All fields are required!')
        }

        if (Number(duration) < 1 || Number(duration) > 100) {
            throw new Error('Duration must be between 1-100!')
        }

        const currentEdition = { destination, city, duration, departureDate, imgUrl }

        notifications('showLoader', '')

        const result = await edit(_id, currentEdition)
        notifications('hideLoader', '')
        notifications('success', 'Destination has been edited successfully!')

        context.redirect(`/details/${_id}`)
    } catch (err) {
        notifications('error', err.message.toLowerCase())
    }

}


export async function postCreate(context) {

    const { destination, city, duration, departureDate, imgUrl } = context.params
    try {
        if (destination.length <= 0 || city.length <= 0 || duration.length <= 0 || departureDate.length <= 0 || imgUrl.length <= 0) {
            throw new Error('All fields are required!')
        }

        if (Number(duration) < 1 || Number(duration) > 100) {
            throw new Error('Duration must be between 1-100!')
        }

        const currentCreation = { destination, city, duration, departureDate, imgUrl }

        notifications('showLoader', '')

        const result = await create(currentCreation)
        notifications('hideLoader', '')

        notifications('success', 'Destination has been created successfully!')

        context.redirect('/home')


    } catch (err) {
        notifications('error', err.message.toLowerCase())
    }
}
