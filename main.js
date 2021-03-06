
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
const profileHeader = document.querySelector('#profile-header')

const resultCard = document.querySelector('.result-card')
const profileButton = document.querySelector('.profile-button')
const profilePage = document.querySelector('.profile-page')
const backToSearchButton = document.querySelector('.back-to-search')
const savedResults = document.querySelector('.saved-results')
const deleteSave = document.querySelector('#delete-recipe')
const backToResusltsButton = document.querySelector('#back-to-results')
const saveButton = document.querySelector('#save-recipe')
const moreButtons = document.querySelector('.more-buttons')
const updateForm = document.querySelector('.update-form')
const updateDietValue = document.querySelector('#update-diet')

let recipeId = null
let profile = false




signUpButton.addEventListener('click', () => {

    hideSections()
    removeHidden(signUpPage)
    addHidden(loginOrSignUp)
})

loginButton.addEventListener('click', () => {
    hideSections()
    removeHidden(loginPage)
    addHidden(loginOrSignUp)
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
    signUpForm.reset()
})

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    login()
    clearResults(searchResults)
    loginForm.reset()
})

saveButton.addEventListener('click', () => {

    const userId = localStorage.getItem('userId')

    saveRecipe(userId, recipeId)
})

profileButton.addEventListener('click', () => {
    hideSections()
    removeHidden(profilePage)
    showSavedRecipe()
    profile = true
    clearResults(searchResults)
    showProfileName()
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const query = document.querySelector('#search-recipes').value
    const id = localStorage.getItem('userId')
    getRecipes(id, query, searchResults)
    clearResults(searchResults)
    searchForm.reset()
})

backToResusltsButton.addEventListener('click', () => {
    if (profile) { backHandler(profilePage) }
    else { backHandler(searchPage) }
})

let backHandler = (show) => {
    addHidden(recipeDeatilsPage)
    removeHidden(show)
}



backToSearchButton.addEventListener('click', () => {
    profile = false
    hideSections()
    removeHidden(searchPage)
})

deleteSave.addEventListener('click', () => {
    deleteSavedRecipe(recipeId)
    if(profile){
        hideSections()
        removeHidden(profilePage)
    }
})


updateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let userId = localStorage.getItem('userId')
    updateDiet(userId)
    alert('Diet Changed')
    updateForm.reset()
})

updateDiet = async (userId) => {
    try {
        let diet = updateDietValue.value
        const res = await axios.put(`http://localhost:3001/users/${userId}`, {
            diet: diet
        })
    } catch (error) {
        alert(error)
    }
}



getRecipes = async (id, query) => {
    try {
        const res = await axios.post('http://localhost:3001/recipes/search', {
            id: id,
            query: query
        })
        let resultsArray = res.data.results
        if (resultsArray.length === 0) {
            alert("No results found")
        }
        else {
            for (let result of resultsArray) {
                let recipeName = result.title
                let recipeImage = result.image
                let recipeId = result.id
                displayRecipes(recipeId, recipeName, recipeImage, searchResults, searchPage, resultCard)
            }
        }
    }
    catch (error) {
        alert(error)
    }
}

displayRecipes = (id, name, img, div, page, page2) => {
    let card = document.createElement('div')
    let recipeImage = document.createElement('img')
    let recipeName = document.createElement('p')
    card.classList.add('recipe-card')
    recipeName.innerText = name
    recipeImage.src = img
    card.append(recipeName, recipeImage)
    div.append(card)
    card.addEventListener('click', () => {
        recipeId = id
        displaySingle(id, page)
        clearResults(page2)
    })

}

displaySingle = async (recipeId, page) => {
    try {
        addHidden(page)
        removeHidden(recipeDeatilsPage)
        let results = await axios.get(`http://localhost:3001/recipes/search/${recipeId}`)
        createRecipeElements(results)
        checkIfSaved(recipeId)
    } catch (error) {
    }
}

createRecipeElements = (results) => {
    let recipeHeader = document.createElement('h1')
    let recipeImg = document.createElement('img')
    recipeImg.src = results.data.image
    let instructionHeader = document.createElement('h3')
    let ingredientContainer = document.createElement('div')
    ingredientContainer.classList.add('ingredient-container')
    let instructionContainer = document.createElement('div')
    instructionContainer.classList.add('instruction-container')
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
    ingredientContainer.append(ingredientHeader, ingredientList)
    instructionContainer.append(instructionHeader, recipeInstructions)
    resultCard.append( recipeHeader, recipeImg , ingredientContainer, instructionContainer
         )
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
        let userName = res.data.user.name
        localStorage.setItem('userName', userName)
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
        let userName = res.data.user.name
        localStorage.setItem('userName', userName)
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
        clearResults(savedResults)
        const userId = localStorage.getItem('userId')
        
        let res = await axios.get(`http://localhost:3001/users/${userId}/savedRecipes`)
        let dataArr = res.data
    
        for (let data of dataArr) {
            recipeId = data.recipeId
            let results = await axios.get(`http://localhost:3001/recipes/search/${recipeId}`)
            displayRecipes(recipeId, results.data.title, results.data.image, savedResults, profilePage, resultCard)
        }  
    } catch (error) {
        alert(error)
    }
}

deleteSavedRecipe = async (recipeId) => {
    let userId = localStorage.getItem('userId')
    try {
        let results = await axios.delete(`http://localhost:3001/users/${userId}/delete/${recipeId}`)
        showSavedRecipe()
    } catch (error) {
        
    }
}



checkIfSaved = async (id) => {
    let userId = localStorage.getItem('userId')
    let res = await axios.get(`http://localhost:3001/users/${userId}/savedRecipes`)
    const saveArr = res.data.map(recipe => recipe.recipeId)
    if (saveArr.includes(id.toString())) {
        removeHidden(deleteSave)
        addHidden(saveButton)
    }
    else {
        addHidden(deleteSave)
        removeHidden(saveButton)
    }
}

showProfileName = () => {
    const userName = localStorage.getItem('userName')
    profileHeader.innerHTML = `Hello, ${userName}`
}

if (localStorage.getItem('userId')) {
    hideSections()
    removeHidden(searchPage)
}
else {
    hideSections()
    removeHidden(loginOrSignUp)
}