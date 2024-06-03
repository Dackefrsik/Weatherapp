"use strict";

//const { response } = require("express");

window.addEventListener("load", () => {
    console.log("load");

    //#region Hömtar ut knappen för att kunna visa kartan
    let mapBtnRef = document.querySelector("#map");

    //Lyssnare som kollar om användaren klickar på knappen för kartan 
    mapBtnRef.addEventListener("click", () => {

        //Hämtar ut kartan och skiftar av och på med klassen 
        let iframeRef = document.querySelector(".map");
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
        console.log("On click");

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
        console.log("submit");

        let query = document.querySelector("input[type='search']").value;
        console.log(query);

        fetch("https://nominatim.openstreetmap.org/search?format=json&limit=3&q="  + query)
        .catch((error) => {
            console.log(error);
        })
        .then((response) =>{
           return response.json();
        })
        .then((data) => {
            
            if(h1Ref.innerHTML != null){
                h1Ref.innerHTML = null;
                divRef.innerHTML = null;
                hourRef.innerHTML = null;
            }

            let firstChar = query.charAt(0).toUpperCase();
            let textNodeRef = document.createTextNode(firstChar + query.slice(1));

            h1Ref.appendChild(textNodeRef);
            document.querySelector("input[type='search']").value = "";
            console.log(data);
            let lat = data[0].lat;
            let lon = data[0].lon;
            console.log(lat);
            console.log(lon);
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
        fetch("http://api.timezonedb.com/v2.1/get-time-zone?key=W2KV6C9E7TW4&format=json&by=position&lat=" + lat + "&lng="  + lon)
        .catch((error) => {
            console.log(error);
        })
        .then((response) => {
            return response.json();
        })
        .then((data2) =>{
           console.log(data2);

           let h1Ref = document.querySelector("#h1");
           console.log(h1Ref.innerHTML);
           if(h1Ref.innerHTML === ""){
            console.log("null");
            let textNodeRef = document.createTextNode(data2.cityName);
            h1Ref.appendChild(textNodeRef);
           }

            let divRef = document.querySelector("#show-weather");
            let imgRef = document.createElement("img");
            fetch("https://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lon + "&appid=5b4794c0213f8621d31acea89a4f7cdf")
            .catch((error) => {
                console.log(error);
            })
            .then((response) => {
                return response.json();
            })
            .then((data3) => {
                console.log(data3);
                if(data3.weather[0].main == "Clouds"){
                    imgRef.setAttribute("src", "../image/clouds.png");
                }
                else if(data3.weather[0].main == "Clear"){
                    imgRef.setAttribute("src", "../image/clear.png")
                }
                else if(data3.weather[0].main == "Rain"){
                    imgRef.setAttribute("src", "../image/rain.png")
                }
                else if(data3.weather[0].main == "Drizzle"){
                    imgRef.setAttribute("src", "../image/drizzle.png")
                }
                else if(data3.weather[0].main == "Mist" || data3.weather[0].main == "Haze"){
                    imgRef.setAttribute("src", "../image/mist.png")
                }
            })

            let weatherRef = document.createElement("h3");
            weatherRef.classList.add("d-flex", "justify-content-center");
            let textNodeRef = document.createTextNode(data2.formatted.substring(11,16) + " " + data.hourly.temperature_2m[data2.formatted.substring(11,13)] + " " + data.hourly_units.temperature_2m);
            weatherRef.appendChild(textNodeRef);
            divRef.appendChild(imgRef);
            divRef.appendChild(weatherRef);
            let hourRef = document.querySelector("#show-next-hour");
            for(let i = parseInt(data2.formatted.substring(11,13)) + 1; i < parseInt(data2.formatted.substring(11,13))  + 5; i++ ){
                let time = i;
                if(time >= 24){
                    time = time -24;
                }
                
                let h3Ref = document.createElement("h3");
                let textNodeRef2 = document.createTextNode(time + ":00 " + data.hourly.temperature_2m[i] + " " + data.hourly_units.temperature_2m);
                h3Ref.appendChild(textNodeRef2);
                hourRef.appendChild(h3Ref);
            }
        });        
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

    let timeRef = document.createElement("h1");
    let textNodeRef = document.createTextNode(currentHour + ":" + currentMin);

    timeRef.appendChild(textNodeRef);
    headRef.appendChild(timeRef);
}
//#endregion