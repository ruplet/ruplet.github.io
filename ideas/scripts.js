document.addEventListener("DOMContentLoaded", function() {
    // Load JSON data
    fetch('german_dishes.json')
        .then(response => response.json())
        .then(data => {
            // Populate the ingredient dropdown
            const ingredientSelect = document.getElementById('ingredient-select');
            const uniqueIngredients = getUniqueIngredients(data);
            populateDropdown(ingredientSelect, uniqueIngredients);
            
            // Display all recipes initially
            displayRecipes(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function getUniqueIngredients(data) {
    const allIngredients = data.reduce((acc, recipe) => {
        Object.keys(recipe.ingredients).forEach(ingredient => {
            acc.add(ingredient);
        });
        return acc;
    }, new Set());

    return Array.from(allIngredients);
}

function populateDropdown(select, options) {
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

function filterRecipes() {
    const selectedIngredient = document.getElementById('ingredient-select').value;
    if (!selectedIngredient) {
        alert('Please select an ingredient.');
        return;
    }

    fetch('german_dishes.json')
        .then(response => response.json())
        .then(data => {
            const filteredRecipes = data.filter(recipe => recipe.ingredients[selectedIngredient]);
            displayRecipes(filteredRecipes);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    recipesContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');

        const titleElement = document.createElement('h3');
        titleElement.textContent = recipe.dish_name;
        recipeElement.appendChild(titleElement);

        const ingredientsList = document.createElement('ul');
        Object.keys(recipe.ingredients).forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = `${ingredient}: ${recipe.ingredients[ingredient]}`;
            ingredientsList.appendChild(ingredientItem);
        });
        recipeElement.appendChild(ingredientsList);

        const instructionsList = document.createElement('ol');
        recipe.instructions.forEach(instruction => {
            const instructionItem = document.createElement('li');
            instructionItem.textContent = instruction;
            instructionsList.appendChild(instructionItem);
        });
        recipeElement.appendChild(instructionsList);

        recipesContainer.appendChild(recipeElement);
    });
}
