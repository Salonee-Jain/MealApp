var input = document.querySelector("#search");

var searchBtn = document.querySelector(".searchbutton");
var heading2 = document.getElementById('heading2')






if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// it fetches meals from api and return it
async function fetchMealsFromApi(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}


// it fetches meals from api and return it
async function fetchMealsFromApi(url, value) {
    const response = await fetch(`${url + value}`);
    const data = await response.json();
    return data;
}

function showMealList() {
    let inputValue = document.getElementById("search").value;
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html = "";
    let meals = fetchMealsFromApi(url, inputValue);
    meals.then(data => {
        if (data.meals) {
            data.meals.forEach((element) => {
                let isFav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        isFav=true;
                    }
                }
                if (isFav) {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealDetails(${element.idMeal})">Recipe</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showMealDetails(${element.idMeal})">Recipe</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }  
            });
        } else {
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center" ">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        document.getElementById("recipe-list").innerHTML = html;
    });
}

//it  shows full meal details in main
async function showMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          
    <div class="container py-3">
    <div class="card p-5">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="recipe-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}" class="btn btn-warning">Video</a>
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
    document.getElementById("recipe-list").innerHTML = html;
}


// it shows all favourites meals in favourites body
async function showFavMealList() {
    console.log("hello");
    console.log(localStorage.getItem("favouritesList"))
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead heading2">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMealsFromApi(url,arr[index]).then(data=>{
                html += `
                <div id="card" class="card mb-3 m-2" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-warning" onclick="showFavMealDetails(${data.meals[0].idMeal})">Recipe</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:40%"><i class="fa-solid fa-xmark"></i></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favorite-list").innerHTML= html;
}


async function showFavMealDetails(id) {
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html = "";
    await fetchMealsFromApi(url, id).then(data => {
        html += `
          
    <div class="container py-3">
    <div class="card p-5">
        <div class="row ">
            <div class="col-md-4  align-self-center">
                <img src="${data.meals[0].strMealThumb}" class="w-100">
            </div>
            <div class="col-md-8 px-3 align-self-center">
                <div class="card-block px-3">
                    <div id="heading" class="text-center">

                    </div>
                    <h2 class="card-title" id="heading2">${data.meals[0].strMeal}</h2>
                    <p id="category">Category : ${data.meals[0].strCategory}</p>
                    <p d="area">Area : ${data.meals[0].strArea}</p>


                    <h5>Instruction :</h5>
                    <p class="card-text" id="recipe-intro">
                        ${data.meals[0].strInstructions}</p>
                    <a href="${data.meals[0].strYoutube}" class="btn btn-warning">Video</a>
                </div>
            </div>

        </div>
    </div>
</div>

        `;
    });
    document.getElementById("favorite-list").innerHTML = html;
}



//it adds and remove meals to favourites list
async function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouritesList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("your meal removed from your favourites list");
    } else {
        arr.push(id);
        alert("your meal added to your favourites list");
    }
    localStorage.setItem("favouritesList",JSON.stringify(arr));
    await showFavMealList();
    showMealList();
    
}