
const loginOrSignUp = document.querySelector(".login-or-signup")
const signUpButton = document.querySelector("#signup-button")
const loginButton = document.querySelector("#login-button")
const signUpPage = document.querySelector(".signup")
const sections = document.querySelectorAll('section')
const signUpForm = document.querySelector('.signup-form')
const logOutButtons = document.querySelectorAll('.log-out')
const searchPage = document.querySelector('.search-page')
const loginPage = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')
const searchForm = document.querySelector('.search-form')
const searchResults = document.querySelector('.search-results')
const recipeDeatilsPage = document.querySelector('.recipe-details')
const saveButton = document.querySelector('#save-recipe')
const backToResusltsButton = document.querySelector('#back-to-results')
const resultCard = document.querySelector('.result-card')
const profileButton = document.querySelector('.profile-button')
const profilePage = document.querySelector('.profile-page')
let recipeId = null

signUpButton.addEventListener('click', () => {
    console.log('click')
    hideSections()
    removeHidden(signUpPage)
})

loginButton.addEventListener('click', () => {
    hideSections()
    removeHidden(loginPage)
})

for (const button of logOutButtons) {
    button.addEventListener('click', () => {
        localStorage.clear()
        hideSections()
        removeHidden(loginOrSignUp)
    })
}

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    signUp()
    clearResults(searchResults)
})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    login()
    clearResults(searchResults)
})

saveButton.addEventListener('click', () => {
    console.log('click')
    const userId = localStorage.getItem('userId')
    console.log(userId, recipeId)
    saveRecipe(userId, recipeId)
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = document.querySelector('#search-recipes').value
    const id = localStorage.getItem('userId')
    clearResults(searchResults)
    getRecipes(id, query)
})

backToResusltsButton.addEventListener('click', () => {
    addHidden(recipeDeatilsPage)
    removeHidden(searchPage)
})

profileButton.addEventListener('click', () => {
    hideSections()
    removeHidden(profilePage)
    console.log('click')
    showSavedRecipe()
})

getRecipes = async (id, query) => {
    try {
        const res = await axios.post('http://localhost:3001/recipes/search', {
            id: id,
            query: query
        })
        console.log(res)
        let resultsArray = res.data.results
        if (resultsArray.length === 0) {
            alert("No results found")
        }
        else {
            for (let result of resultsArray) {
                let recipeName = result.title
                let recipeImage = result.image
                let recipeId = result.id
                displayRecipes(recipeId, recipeName, recipeImage)
            }
        }
    }
    catch (error) {
        alert(error)
    }
}

displayRecipes = (id, name, img) => {
    let card = document.createElement('div')
    let recipeImage = document.createElement('img')
    let recipeName = document.createElement('p')
    card.classList.add('recipe-card')
    recipeName.innerText = name
    recipeImage.src = img
    card.append(recipeName, recipeImage)
    searchResults.append(card)
    card.addEventListener('click', () => {
        recipeId = id
        console.log(id)
        displaySingle(id)

    })
}

displaySingle = async (recipeId) => {
    try {
        addHidden(searchPage)
        removeHidden(recipeDeatilsPage)
        clearResults(resultCard)
        let results = await axios.get(`http://localhost:3001/recipes/search/${recipeId}`)
        createRecipeElements(results)
    } catch (error) {

    }
}
createRecipeElements = (results) => {
    let recipeHeader = document.createElement('h1')
    let recipeImg = document.createElement('img')
    recipeImg.src = results.data.image
    let instructionHeader = document.createElement('h3')
    instructionHeader.innerHTML = 'Instructions:'
    let ingredientHeader = document.createElement('h3')
    ingredientHeader.innerHTML = 'Ingredients:'
    let recipeInstructions = document.createElement('p')
    let ingredientList = document.createElement('ul')
    recipeHeader.innerText = results.data.title
    recipeInstructions.innerHTML = results.data.instructions
    let ingredients = results.data.extendedIngredients
    for (let ingredient of ingredients) {
        let eachIngredient = document.createElement('li')
        eachIngredient.innerHTML = ingredient.original
        ingredientList.append(eachIngredient)
    }
    resultCard.append(recipeHeader, recipeImg, instructionHeader,
        recipeInstructions, ingredientHeader, ingredientList)
}


clearResults = (result) => {
    while (result.firstChild) {
        result.firstChild.remove()
    }
}

hideSections = () => {
    sections.forEach(section => section.classList.add('hidden'))
}

removeHidden = (section) => {
    section.classList.remove('hidden')
}

addHidden = (section) => {
    section.classList.add('hidden')
}

signUp = async () => {
    const name = document.querySelector('#signup-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    const diet = document.querySelector('#diet').value
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
}

login = async () => {
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
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
}
saveRecipe = async (userId, recipeId) => {
    try {
        let res = await axios.post(`http://localhost:3001/users/${userId}/save/${recipeId}`)
        alert('Recipe Saved')
    } catch (error) {
        alert('save failed')
    }
}

showSavedRecipe = async () => {
    try {
        const userId = localStorage.getItem('userId')
        let res = await axios.get(`http://localhost:3001/users/${userId}/savedRecipes`)
        console.log(res.data)
    } catch (error) {
        
    }
}


if (localStorage.getItem('userId')) {
    hideSections()
    removeHidden(searchPage)
}
else {
    hideSections()
    removeHidden(loginOrSignUp)
}