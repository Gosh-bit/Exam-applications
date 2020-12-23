import { homePage, createPage, postCreate, detailsPage, editPage, postEdit } from './controllers/catalog.js'
import { loginPage, registerPage, postRegister, postLogin, logoutPage, myDestinationsPage, removePage } from './controllers/user.js'
import * as api from './data.js'

window.api = api;

const app = new Sammy('#container', function () {

    this.use('Handlebars', 'hbs')

    this.get('/', homePage)
    this.get('/home', homePage)
    this.get('/create', createPage)
    this.post('/create', (context) => { postCreate(context) })

    this.get('/details/:_id', detailsPage)

    this.get('/edit/:_id', editPage)
    this.post('/edit/:_id', (context) => { postEdit(context) })

    this.get('/myDestinations', myDestinationsPage)
    this.get('/remove/:_id', removePage)


    this.get('/register', registerPage)
    this.post('/register', (context) => { postRegister(context) })
    this.get('/login', loginPage)
    this.post('/login', (context) => { postLogin(context) })
    this.get('/logout', logoutPage)
});


app.run()