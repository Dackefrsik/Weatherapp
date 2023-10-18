"use strict";

window.addEventListener("load", () => {
    console.log("load");
    setInterval(updateClock, 1000);

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

    document.querySelector("input[type='button']").addEventListener("click", () =>{
        
        if(h1Ref.innerHTML != null){
            h1Ref.innerHTML = null;
            divRef.innerHTML = null;
            hourRef.innerHTML = null;
        }

        let iframeRef = document.querySelector("iframe");
        iframeRef.style.display = "block";
    })

});

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
            imgRef.setAttribute("src", "/public/image/sun.png");
            let weatherRef = document.createElement("h3");
            let textNodeRef = document.createTextNode(data2.formatted.substring(11,16) + " " + data.hourly.temperature_2m[data2.formatted.substring(11,13)] + " " + data.hourly_units.temperature_2m);
            weatherRef.appendChild(textNodeRef);
            divRef.appendChild(imgRef);
            divRef.appendChild(weatherRef);
            for(let i = parseInt(data2.formatted.substring(11,13)) + 1; i < parseInt(data2.formatted.substring(11,13))  + 5; i++ ){
                let time = i;
                if(time >= 24){
                    time = time -24;
                }
                let hourRef = document.querySelector("#show-next-hour");
                let h3Ref = document.createElement("h3");
                let textNodeRef2 = document.createTextNode(time + ":00 " + data.hourly.temperature_2m[i] + " " + data.hourly_units.temperature_2m);
                h3Ref.appendChild(textNodeRef2);
                hourRef.appendChild(h3Ref);
            }
        });        
    })
}

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