import { setUserData, getUserData, getUserId, objectToArray } from "./util.js";

const apiKey = 'AIzaSyAvGTgdkfQmY7znkZyMYV1g5PAk1Vzgf0I';
const databaseUrl = 'https://js-application-exam-1d0be-default-rtdb.europe-west1.firebasedatabase.app/';

const endpoints = {
    LOGIN: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',
    REGISTER: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',
    CREATION: 'destinations',
    CREATION_BY_ID: 'destinations/',

};

function host(url) {
    let result = `${databaseUrl}${url}.json`;
    const auth = getUserData();
    if (auth !== null) {
        result += `?auth=${auth.idToken}`
    }

    return result;
}

async function request(url, method, body) {
    let options = {
        method,
    };

    if (body) {
        Object.assign(options, {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    }

    let response = await fetch(url, options);
    let data = await response.json();

    if (data && data.hasOwnProperty('error')) {
        throw new Error(data.error.message)
    }

    return data;
}

async function get(url) {
    return request(url, 'GET');
}

async function post(url, body) {
    return request(url, 'POST', body);
}

async function del(url) {
    return request(url, 'DELETE');
}

async function patch(url, body) {
    return request(url, 'PATCH', body);
}

export async function login(email, password) {

    let response = await post(endpoints.LOGIN + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(response);

    return response;
}

export async function register(email, password) {
    let response = await post(endpoints.REGISTER + apiKey, {
        email,
        password,
        returnSecureToken: true,
    });

    setUserData(response);
    return response;
}

// COMMON PARTS FROM TEMPLATE ENDS HERE


export async function getAll() {
    const records = await get(host(endpoints.CREATION));
    return objectToArray(records);
}

export async function getById(id) {

    const record = await get(host(endpoints.CREATION_BY_ID + id));
    record._id = id;
    return record;

}

export async function create(creation) {
    // check what will happend if declare the data with literal 
    const data = Object.assign({ _ownerId: getUserId() }, creation);
    return post(host(endpoints.CREATION), data)
}

export async function edit(id, creation) {
    return patch(host(endpoints.CREATION_BY_ID + id), creation);
}

export async function deleteById(id) {
    return del(host(endpoints.CREATION_BY_ID + id));
}
