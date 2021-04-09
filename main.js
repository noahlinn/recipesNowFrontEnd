const loginOrSignUp = document.querySelector(".login-or-signup")
const signUpButton = document.querySelector("#signup-button")
const loginButton = document.querySelector("#login-button")
const signUpPage = document.querySelector(".signup")
const sections = document.querySelectorAll('section')
const signUpForm = document.querySelector('.signup-form')

const searchPage = document.querySelector('.search-page')
const loginPage = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')

hideSections = () => {
    sections.forEach(section => section.classList.add('hidden'))
}
removeHidden = (section) => {
    section.classList.remove('hidden')
}
signUpButton.addEventListener('click', () => {
    console.log('click')
    hideSections()
    removeHidden(signUpPage)
})
loginButton.addEventListener('click', () => {
    hideSections()
    removeHidden(loginPage)
})
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.querySelector('#signup-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    const diet = document.querySelector('#diet').value
    // console.log(name, email, password, diet)
    try {
        let res = await axios.post('http://localhost:3001/users', {
            name: name,
            email: email,
            password: password,
            diet: diet
        })
        let userId = res.data.user.id
        localStorage.setItem('userId', userId)
        hideSections()
        removeHidden(searchPage)
    } catch (error) {
        alert('email already exists or invalid')
    }
})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    console.log(email, password)
    try {
        let res = await axios.post('http://localhost:3001/users/login', {
            email: email,
            password: password
        })  
        let userId = res.data.user.id
        localStorage.setItem('userId', userId)
        hideSections()
        removeHidden(searchPage)
    } catch (error) {
        alert('login failed')
    }
    
})