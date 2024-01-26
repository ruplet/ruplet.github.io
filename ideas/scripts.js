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
            if (/^\d+\.\s/.test(instruction)) {
                // If instruction starts with a numeric prefix, remove it
                instructionItem.textContent = instruction.replace(/^\d+\.\s/, '');
            } else {
                instructionItem.textContent = instruction;
            }
            instructionsList.appendChild(instructionItem);
        });
        recipeElement.appendChild(instructionsList);

        recipesContainer.appendChild(recipeElement);
    });
}


document.addEventListener("DOMContentLoaded", function() {
    // Load JSON data
    fetch('german_dishes.json')
        .then(response => response.json())
        .then(data => {
            // Populate the ingredient dropdown using Select2
            $('#ingredient-select').select2({
                data: getUniqueIngredients(data),
                placeholder: 'Select ingredients',
                closeOnSelect: false, // Keep the dropdown open after selecting an option
            });

            // Display all recipes initially
            displayRecipes(data);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

function filterRecipes() {
    const selectedIngredients = $('#ingredient-select').val();
    if (!selectedIngredients || selectedIngredients.length === 0) {
        alert('Please select at least one ingredient.');
        return;
    }

    fetch('german_dishes.json')
        .then(response => response.json())
        .then(data => {
            const filteredRecipes = data.filter(recipe =>
                selectedIngredients.some(ingredient => recipe.ingredients[ingredient])
            );
            displayRecipes(filteredRecipes);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}