const loginOrSignUp = document.querySelector(".login-or-signup")
const signUpButton = document.querySelector("#signup-button")
const loginButton = document.querySelector("#login-button")
const signUpPage = document.querySelector(".signup")
const sections = document.querySelectorAll('section')

hideSections =() => {
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
})