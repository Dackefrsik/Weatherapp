"use strict";

//const { response } = require("express");

window.addEventListener("load", () => {

    //#region Hömtar ut knappen för att kunna visa kartan
    let mapBtnRef = document.querySelector("#map");

    //Lyssnare som kollar om användaren klickar på knappen för kartan 
    mapBtnRef.addEventListener("click", () => {

        //Hämtar ut kartan och skiftar av och på med klassen 
        let iframeRef = document.querySelector(".iframemap");
        iframeRef.classList.toggle("d-none");
    });
    //#endregion

    //sätter igång klockan
    setInterval(updateClock, 1000);

    //#region räknar ut kordinaterna som visar väder
    let h1Ref= document.querySelector("#h1");
    let divRef = document.querySelector("#show-weather");
    let hourRef = document.querySelector("#show-next-hour");

    document.querySelector(".compass").addEventListener("click", () => {

        let iframeRef = document.querySelector("iframe");
        iframeRef.style.display = "none";
    
        if(h1Ref.innerHTML != null){
            h1Ref.innerHTML = null;
            divRef.innerHTML = null;
            hourRef.innerHTML = null;
        }
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
    
                weather(lat, lon);
            });
        }
        else{
            console.log("No GPs function in webb browser!");
        }
    }); 
   

    document.querySelector("form").addEventListener("submit", (event) => {
        let iframeRef = document.querySelector("iframe");
        iframeRef.style.display = "none";
        event.preventDefault();

        let query = document.querySelector("input[type='search']").value;
        
        let navbarToggler = document.querySelector(".show");
        if(navbarToggler != null){
            navbarToggler.classList.remove("show");
        }
        fetch("/api/geocode?q=" + encodeURIComponent(query))
        .catch((error) => {
            console.log(error);
        })
        .then((response) =>{
           return response.json();
        })
        .then((data) => {
            console.log(data);
            if(h1Ref.innerHTML != null){
                h1Ref.innerHTML = null;
                divRef.innerHTML = null;
                hourRef.innerHTML = null;
            }

            let firstChar = query.charAt(0).toUpperCase();
            let textNodeRef = document.createTextNode(firstChar + query.slice(1));

            h1Ref.appendChild(textNodeRef);
            document.querySelector("input[type='search']").value = "";
            let lat = data[0].lat;
            let lon = data[0].lon;
            weather(lat, lon);

            
        }) 
        
        
    });

    document.querySelector(".btn").addEventListener("click", () =>{
        
        if(h1Ref.innerHTML != null){
            h1Ref.innerHTML = null;
            divRef.innerHTML = null;
            hourRef.innerHTML = null;
        }

        let iframeRef = document.querySelector("iframe");
        iframeRef.style.display = "block";
        iframeRef.addEventListener("click", () => {
            console.log("Value: " + iframeRef.value);
        });
    })
    //#endregion

});

//#region funktion som visar väder
function weather(lat, lon){
    fetch("https://api.open-meteo.com/v1/forecast?latitude="+ lat +"&longitude="+ lon +"&hourly=temperature_2m")
    .catch((error) => {
        console.log(error);
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        //Hämtar nyckeln från secrets i repository

        fetch('http://localhost:3000/api-key')
        .then(response => response.json())
        .then(apikey => {
            const apiKey = apikey.apiKey;

            fetch("http://api.timezonedb.com/v2.1/get-time-zone?key="+ apiKey + "&format=json&by=position&lat=" + lat + "&lng="  + lon)
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                return response.json();
            })
            .then((data2) =>{
            console.log(data2);

            //let divRef = document.querySelector("#show-weather");

                fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lon + "&appid=5b4794c0213f8621d31acea89a4f7cdf")
                .catch((error) => {
                    console.log(error);
                })
                .then((response) => {
                    return response.json();
                })
                .then((data3) => {
                    console.log(data3);
                    showData(data3);
                    showHeat(data, data2, data3);
                })
            });
        })
    }) 
} 
//#endregion

//#region funktion som styr klockan
function updateClock(){
    let headRef = document.querySelector("#clock");

    if(headRef.innerHTML != null){
        headRef.innerHTML = null;
    }
    let currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMin = currentTime.getMinutes();

    currentHour = (currentHour < 10 ? "0" : "") + currentHour;
    currentMin = (currentMin < 10 ? "0" : "") + currentMin;

    let timeRef = document.createElement("h4");
    timeRef.classList.add("mt-1")
    let textNodeRef = document.createTextNode(currentHour + ":" + currentMin);

    timeRef.appendChild(textNodeRef);
    headRef.appendChild(timeRef);
}
//#endregion

//#region Med funktion som visar data
function showData(data3){
    
    let h1Ref = document.querySelector("#h1");
    h1Ref.classList.add("mt-3");
    if(h1Ref.innerHTML === ""){
    let textNodeRef = document.createTextNode(data3.name);
    h1Ref.appendChild(textNodeRef);
    }
    
    let conditionRef = document.querySelector("#condition");
    conditionRef.innerHTML = "";

    conditionRef.classList.add("d-flex", "justify-content-evenly", "mt-5");
    let divRef = document.createElement("div");
    divRef.classList.add("d-flex", "flex-row");
    let imgRef2 = document.createElement("img");
    imgRef2.setAttribute("src", "../image/wind.png");
    imgRef2.classList.add("conditionIcon");
    let textDiv = document.createElement("div");
    textDiv.classList.add("d-flex", "flex-column", "px-3");
    let h4Ref = document.createElement("h4");
    h4Ref.innerHTML = data3.wind.speed + "km/h";
    let h6Ref = document.createElement("h6");
    h6Ref.innerHTML = "Wind Speed";
    textDiv.appendChild(h4Ref);
    textDiv.appendChild(h6Ref);
    divRef.appendChild(textDiv);
    divRef.appendChild(imgRef2);


    let divRef2 = document.createElement("div");
    divRef2.classList.add("d-flex", "flex");
    let imgRef3 = document.createElement("img");
    imgRef3.setAttribute("src", "../image/humidity.png");
    imgRef3.classList.add("conditionIcon");
    divRef2.appendChild(imgRef3);
    let textDiv2 = document.createElement("div");
    textDiv2.classList.add("d-flex", "flex-column"); 
    let h4Ref2 = document.createElement("h4");
    h4Ref2.innerHTML = data3.main.humidity + "%";
    let h6Ref2 = document.createElement("h6");
    h6Ref2.innerHTML = "Humidity";
    h4Ref2.classList.add("px-3");
    textDiv2.appendChild(h4Ref2);
    textDiv2.appendChild(h6Ref2);
    divRef2.appendChild(textDiv2);
    divRef2.appendChild(imgRef3);

    conditionRef.appendChild(divRef);    
    conditionRef.appendChild(divRef2); 
}
//#endregion

//#region Funktion som visar bild med med tid och gradantal
function showHeat(data, data2, data3){
    let divRef = document.querySelector("#show-weather");
    let imgRef = document.createElement("img");
    imgRef.innerHTML = "";
    imgRef.classList.add("mb-5");

    if(data3.weather[0].icon == "01n"){
        imgRef.setAttribute("src", "../image/01n_t@4x.png");
    }
    else if(data3.weather[0].icon == "01d"){
        imgRef.setAttribute("src", "../image/01d_t@4x.png")
    }
    else if(data3.weather[0].icon == "02d"){
        imgRef.setAttribute("src", "../image/02d_t@4x.png")
    }
    else if(data3.weather[0].icon == "02n"){
        imgRef.setAttribute("src", "../image/02n_t@4x.png")
    }
    else if(data3.weather[0].icon == "03d"){
        imgRef.setAttribute("src", "../image/03d_t@4x.png")
    }
    else if(data3.weather[0].icon == "03n"){
        imgRef.setAttribute("src", "../image/03n_t@4x.png");
    }
    else if(data3.weather[0].icon == "04d"){
        imgRef.setAttribute("src", "../image/04d_t@4x.png")
    }
    else if(data3.weather[0].icon == "04n"){
        imgRef.setAttribute("src", "../image/04n_t@4x.png")
    }
    else if(data3.weather[0].icon == "09d"){
        imgRef.setAttribute("src", "../image/09d_t@4x.png")
    }
    else if(data3.weather[0].icon == "09n"){
        imgRef.setAttribute("src", "../image/09n_t@4x.png")
    }
    else if(data3.weather[0].icon == "10d"){
        imgRef.setAttribute("src", "../image/10d_t@4x.png")
    }
    else if(data3.weather[0].icon == "10n"){
        imgRef.setAttribute("src", "../image/10n_t@4x.png")
    }
    else if(data3.weather[0].icon == "13d"){
        imgRef.setAttribute("src", "../image/13d_t@4x.png")
    }
    else if(data3.weather[0].icon == "13n"){
        imgRef.setAttribute("src", "../image/13n_t@4x.png")
    }
    else if(data3.weather[0].icon == "50d"){
        imgRef.setAttribute("src", "../image/50d_t@4x.png")
    }
    else if(data3.weather[0].icon == "13n"){
        imgRef.setAttribute("src", "../image/50n_t@4x.png")
    }
            
    divRef.appendChild(imgRef);
    let hourRef = document.querySelector("#show-next-hour");
    let tempRef = document.querySelector("#hour-temp");
    hourRef.innerHTML = "";
    tempRef.innerHTML = "";
    for(let i = parseInt(data2.formatted.substring(11,13)); i < parseInt(data2.formatted.substring(11,13))  + 5; i++ ){
        let time = i;
        if(time >= 24){
            time = time -24;
        }
        
        let h3Ref = document.createElement("h3");
        let h3Ref2 = document.createElement("h3");

        if(time < 10){
            h3Ref.innerHTML = "0" + time + ":00 ";
            h3Ref2.innerHTML = data.hourly.temperature_2m[i] + data.hourly_units.temperature_2m;

        }
        else{
            h3Ref.innerHTML = time + ":00 ";
            h3Ref2.innerHTML = data.hourly.temperature_2m[i] + data.hourly_units.temperature_2m;

        }
        hourRef.appendChild(h3Ref);
        tempRef.appendChild(h3Ref2);
    }
}

//#endregion