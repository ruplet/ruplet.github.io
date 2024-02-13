document.addEventListener("DOMContentLoaded", function() {
    // Load JSON data
    fetch('german_dishes.json')
        .then(response => response.json())
        .then(data => {
            // Populate the ingredient dropdown
            const ingredientSelect = document.getElementById('ingredient-select');
            const uniqueIngredients = getUniqueIngredients(data);
            populateDropdown(ingredientSelect, uniqueIngredients);

            // Populate the ingredient dropdown using Select2
            $('#ingredient-select').select2({
                data: getUniqueIngredients(data),
                placeholder: 'Select ingredients',
                closeOnSelect: false, // Keep the dropdown open after selecting an option
            });


            // Display all recipes initially
            displayRecipes(data);

            // Display detailed information about a recipe in a modal
            document.getElementById('recipes-container').addEventListener('click', function(event) {
                const recipeElement = event.target.closest('.recipe');
                if (recipeElement) {
                    const titleElement = recipeElement.querySelector('h3');
                    if (titleElement) {
                        const recipeData = data.find(recipe => recipe.dish_name === titleElement.textContent);
                        if (recipeData) {
                            displayRecipeDetails(recipeData);
                        } else {
                            console.error('Recipe data not found for:', titleElement.textContent);
                        }
                    } else {
                        console.error('Title element not found in recipe:', recipeElement);
                    }
                }
            });
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
                selectedIngredients.some(ingredient => Object.keys(recipe.ingredients).includes(ingredient))
            );
            displayRecipes(filteredRecipes);
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function displayRecipeDetails(recipe) {
    const modal = document.getElementById('recipe-modal');
    const recipeDetails = document.getElementById('recipe-details');
    
    // Display basic information
    recipeDetails.innerHTML = `<h2>${recipe.dish_name}</h2>`;

    // Display ingredients
    const ingredientsList = document.createElement('ul');
    Object.keys(recipe.ingredients).forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = `${ingredient}: ${recipe.ingredients[ingredient]}`;
        ingredientsList.appendChild(ingredientItem);
    });
    recipeDetails.appendChild(ingredientsList);

    // Display history information
    recipeDetails.appendChild(document.createElement('hr'));
    const historyElement = document.createElement('p');
    historyElement.textContent = `History: ${recipe.history}`;
    recipeDetails.appendChild(historyElement);


    // // Display amino acid contents (mock data for illustration)
    // const aminoAcids = {
    //     "Histidine": "16",
    //     "Isoleucine": "30",
    //     "Leucine": "61",
    //     "Lysine": "48",
    //     "Methionine + Cysteine": "23",
    //     "Phenylalanine + Tyrosine": "41",
    //     "Threonine": "26",
    //     "Tryptophan": "6.6",
    //     "Valine": "40"
    //     // leucine: getRandomAminoAcidContent()
    // };

    // const aminoAcidsList = document.createElement('ul');
    // Object.keys(aminoAcids).forEach(acid => {
    //     const acidItem = document.createElement('li');
    //     acidItem.textContent = `${acid}: ${aminoAcids[acid]} mg`;
    //     aminoAcidsList.appendChild(acidItem);
    // });
    recipeDetails.appendChild(document.createElement('hr'));
    
    const node = document.createElement('p');
    node.textContent = 'The following is miligrams of each Essential Aminoacid (EAA) per 1g of protein in food. The data is mock data for illustration purposes only';
    recipeDetails.appendChild(node);
    // recipeDetails.appendChild(aminoAcidsList);

    // const referenceAminoAcids = {
    //     "Histidine": "25",
    //     "Isoleucine": "35",
    //     "Leucine": "70",
    //     "Lysine": "55",
    //     "Methionine + Cysteine": "20",
    //     "Phenylalanine + Tyrosine": "45",
    //     "Threonine": "30",
    //     "Tryptophan": "7.5",
    //     "Valine": "45"
    //     // Add more amino acids as needed
    // };
    // const aminoAcidsTable = document.createElement('table');
    // aminoAcidsTable.innerHTML = `
    //     <thead>
    //         <tr>
    //             <th>Amino Acid</th>
    //             <th>${recipe.dish_name}</th>
    //             <th>Reference Protein</th>
    //         </tr>
    //     </thead>
    //     <tbody>
    //         ${Object.keys(aminoAcids).map(acid => `
    //             <tr>
    //                 <td>${acid}</td>
    //                 <td>${aminoAcids[acid]} mg</td>
    //                 <td>${referenceAminoAcids[acid]} mg</td>
    //             </tr>
    //         `).join('')}
    //     </tbody>
    // `;
    // recipeDetails.appendChild(aminoAcidsTable);

    // Fetch amino acid contents from the JSON file
    fetch('mg_of_eaa_per_g_of_protein.json')
        .then(response => response.json())
        .then(aminoAcidsData => {
            var aminoAcids = aminoAcidsData.find(data => data.food === recipe.dish_name);

            if (!aminoAcids) {
                aminoAcids = aminoAcidsData.find(data => data.food === "reference protein");
                // make a copy to not modify the original data
                aminoAcids = JSON.parse(JSON.stringify(aminoAcids));
                // randomly tweak one amino acid content for illustration
                var aminoAcidNames = Object.keys(aminoAcids);
                const randomIndex = 1 + Math.floor(Math.random() * (aminoAcidNames.length - 1));
                const randomAminoAcid = aminoAcidNames[randomIndex];

                for (var acidName of aminoAcidNames) {
                    // console.log(aminoAcids[acidName]);
                    aminoAcids[acidName] = parseFloat(aminoAcids[acidName]);
                    if (acidName !== randomAminoAcid) {
                        aminoAcids[acidName] *=  Math.random() * 0.3 + 0.85;
                    } else {
                        aminoAcids[acidName] *= 0.4;
                    }
                    aminoAcids[acidName] = Math.round(aminoAcids[acidName] * 10) / 10;
                    // console.log(aminoAcids[acidName]);
                }
            }

            // console.log(aminoAcids);

            // Display amino acid contents for comparison
            const aminoAcidsTable = document.createElement('table');
            aminoAcidsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Amino Acid</th>
                        <th>${recipe.dish_name}</th>
                        <th>Reference Protein</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(aminoAcids).map(acid => {
                        if (acid !== 'food') {
                            return `
                                <tr>
                                    <td>${acid}</td>
                                    <td>${aminoAcids[acid]} mg</td>
                                    <td>${aminoAcidsData[0][acid]} mg</td> <!-- Using the reference protein data -->
                                </tr>
                            `;
                        }
                        return '';
                    }).join('')}
                </tbody>
            `;
            recipeDetails.appendChild(aminoAcidsTable);
        })
        .catch(error => console.error('Error fetching amino acid data:', error));

    // Open the modal
    modal.style.display = 'block';
}

function getRandomAminoAcidContent() {
    // Generate random amino acid content for illustration
    return Math.floor(Math.random() * 100) + 50;
}

function closeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.style.display = 'none';
}