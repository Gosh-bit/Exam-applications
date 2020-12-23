export function setUserData(data) {
    localStorage.setItem('auth', JSON.stringify(data));
}

export function getUserData() {

    const auth = localStorage.getItem('auth');

    if (auth !== null) {
        return JSON.parse(auth);
    }
    return null;
}

export function getUserId() {

    const auth = localStorage.getItem('auth');

    if (auth !== null) {
        return JSON.parse(auth).localId;
    }
    return null;
}

export function objectToArray(data) {
    return data ? Object.keys(data).map(key => { return { _id: key, ...data[key] } }) : [];
}

export async function addPartials(context) {
    context.user = getUserData();

    const partials = await Promise.all([
        context.load('/templates/common/header.hbs'),
        context.load('/templates/common/footer.hbs')
    ]);

    context.partials = {
        header: partials[0],
        footer: partials[1],
    }
}

export function notifications(element, message = 'Loading ...') {

    const errorElement = document.querySelector('.errorBox')
    const successElement = document.querySelector('.infoBox')
    const loadingElement = document.querySelector('.loadingBox')

    const notifier = {
        success: () => {
            successElement.innerHTML = message
            successElement.style.display = 'block';

            document.querySelector('body').addEventListener('click', function () {
                successElement.style.display = 'none';

            })
            setTimeout(function () {
                successElement.style.display = 'none'
            }, 3000)
        },

        error: () => {
            errorElement.innerHTML = message
            errorElement.style.display = 'block';

            document.querySelector('body').addEventListener('click', function () {
                errorElement.style.display = 'none';

            })
        },

        showLoader: () => {
            loadingElement.innerHTML = message;
            loadingElement.style.display = 'block';

        },

        hideLoader: () => {
            loadingElement.innerHTML = message;
            loadingElement.style.display = 'none';
        }

    }

    notifier[element]();
}
