# Koll på Käket (Nutrition Tracker)
This is a front-end website project focused on recipes, nutrition education, and analysis. The site provides users with tools to browse recipes, learn about nutrition, and calculate the nutritional content of their meals.

The project is built with HTML, CSS, and modern JavaScript (ES Modules), integrating with two external APIs: TheMealDB for recipes and Nutritionix for nutritional data analysis.

## Features
* Recipe Browser: Search for recipes, filter by category, and view detailed instructions, ingredients, and YouTube video links (powered by TheMealDB API).

* Nutrition Calculator: A dynamic tool that allows users to input a list of ingredients and their amounts (e.g., "100g chicken", "1 cup rice") and receive a detailed breakdown of both macronutrients (calories, protein, fat, carbs) and micronutrients (vitamins, minerals) using the Nutritionix API.

* Interactive Quiz: A multiple-choice quiz to test users' knowledge of macro- and micronutrients.

* Responsive Design: Features a mobile-friendly hamburger menu and responsive images (.webp format using srcset).

* Utility Scripts: Includes helper scripts for dynamic content, like showing the "last updated" date in the footer.

## Project Structure
Here is the folder and file structure for the project:
```
./main/
├── index.html
│
├── js/
│   ├── api.js                 # Handles all API calls (TheMealDB)
│   ├── entry-kalkylator.js    # Entry point for the calculator
│   ├── instruktioner.js       # Logic for displaying single recipes
│   ├── kalkylator.js          # Core logic for the Nutritionix calculator
│   ├── recept.js
│   ├── sok.js
│   ├── utils.js
│   └── extra/
│       ├── convert-to-webp.js # (Dev) Node.js script for image optimization
│       ├── mobil-nav.js       # Toggles mobile navigation
│       ├── quiz.js                # Logic for the interactive quiz
│       └── senast-upd.js      # Updates "last modified" date in footer
│
├── html/
│   ├── berakna.html           # The Nutrition Calculator page
│   ├── fakta.html             # Main "Nutrition Facts" page
│   ├── instruktioner.html     # Template for a single recipe
│   ├── makro.html             # Page for Macronutrients
│   ├── mikro.html             # Page for Micronutrients
│   ├── om.html                # "About" page
│   ├── quiz.html              # The Quiz page
│   └── recept.html            # The Recipe search/browser page
│
├── css/
│   ├── reset.css
│   ├── stil.css               # Main stylesheet
│
└── assets/
    ├── fonts/
    │   └── (font files)
    └── img/
        └── (image files, including .webp versions)
```
        
## Key Components
### 1. Recipe Feature (api.js, instruktioner.js)
This feature uses TheMealDB API to fetch recipe data.

#### api.js: 
Acts as a service module, exporting async functions like fetchMealById, searchMeals, and fetchMealsByCategory.

#### instruktioner.js: 
Runs on the instruktioner.html page. It reads a mealId from the URL, fetches the corresponding recipe using api.js, and dynamically generates the HTML to display ingredients, instructions, and images.

### 2. Nutrition Calculator (kalkylator.js, entry-kalkylator.js)
This is the most complex feature, using the Nutritionix API to analyze natural language queries.

#### kalkylator.js: 
Contains the main logic. It listens for form submissions, builds a query (e.g., "40 grams oats, 100 grams banana"), and sends it to the Nutritionix "natural nutrients" endpoint.

It then parses the API response to build and display two tables: one for macronutrients (totaling calories, protein, etc.) and one for micronutrients (totaling vitamins and minerals).

#### entry-kalkylator.js: 
A simple entry point that imports and runs the init() function from kalkylator.js when the DOM is loaded.

## Dependencies For Running the Site
#### 1. A modern web browser: 
The site uses modern JavaScript (ES Modules) and fetch APIs, so an up-to-date browser like Chrome, Firefox, or Edge is required.

#### 2. Nutritionix API Key: 
The Nutrition Calculator will not work without a valid appId and appKey from Nutritionix. TheMealDB API, used for recipes, does not require a key.

#### 3. A local server: 
Due to the use of JavaScript modules (type="module"), opening the index.html file directly from your local file system (file:///...) will not work in most browsers. You must serve the files from a local server.

## How to Run
### 1. Running the Website (Local):
#### Clone or download the project repository.

### 2. Start a Local Server:
#### The easiest way is to use a VS Code extension like "Live Server". Right-click the index.html file and choose "Open with Live Server".

Alternatively, you can use Node.js. Open your terminal in the main project folder and run:
* If you have 'http-server' installed globally:
http-server

* Or using Python:
python -m http.server

### 3. Open the site: 
Open your browser and navigate to the local address (e.g., http://localhost:8080 or http://127.0.0.1:5500).
