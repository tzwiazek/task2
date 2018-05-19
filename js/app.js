const slideModule = (function () {
   const random_cities = () => {
      const cities_arr = ["Lodz", "Warszawa", "Berlin", "New York", "London"];
      function weather() {
         let temp_arr = []
         while(temp_arr.length < 3) {
            let city = (Math.floor(Math.random()*5)+1)-1;
            if(temp_arr.indexOf(city) > -1) continue;
            temp_arr[temp_arr.length] = city;
         }

         for(let i=0;i<3;i++) {
            function refresh_results() {
               let q = "select location, item.condition, item.description from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + cities_arr[temp_arr[i]] + "') and u='c'"
               let request = new XMLHttpRequest();
               request.open('GET', "https://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json", true);
               request.send(null);

               request.onload = () => {
                  if (request.status >= 200 && request.status < 400) {
                     var data = JSON.parse(request.responseText);

                     let q_location = data.query.results.channel.location.city;
                     let q_temp = data.query.results.channel.item.condition.temp;
                     let q_desc = data.query.results.channel.item.condition.text;
                     let q_img = data.query.results.channel.item.description.slice(19,56);

                     let location = document.querySelectorAll(".city");
                     let temp = document.querySelectorAll(".temp");
                     let desc = document.querySelectorAll(".desc");
                     let src = document.querySelectorAll("p > img");

                     if(q_location != "Lodz") location[i].textContent = q_location;
                     else location[i].textContent = "Łódź";

                     temp[i].textContent = "Temperature: "+q_temp+"°C";
                     desc[i].textContent = "Description: "+q_desc;
                     src[i].src = q_img;
                  }
               }
               setTimeout(() => {refresh_results();}, 10000);
            }
            refresh_results();
         }
      }
      weather();
      setInterval(() => {weather();}, 60000);

      let btn = document.querySelectorAll("button");
      for(let i=0;i<3;i++) {
         btn[i].addEventListener("click", function() {
            let city = this.parentElement.parentElement.parentElement.children[0].children[0].textContent;
            localStorage.setItem("storageName",city);
            document.location.href="weather.html";
         });
      }
   }

   const city_weather_information = () => {
      let city = localStorage.getItem("storageName");
      let q = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'"
      let request = new XMLHttpRequest();
      request.open('GET', "https://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json", true);
      request.send(null);

      request.onload = () => {
         if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);

            // first column
            const query_arr= ["City: "+data.query.results.channel.location.city, "Country: "+data.query.results.channel.location.country, "Region: "+data.query.results.channel.location.region, "Chill: "+data.query.results.channel.wind.chill, "Direction: "+data.query.results.channel.wind.direction, "Speed: "+data.query.results.channel.wind.speed, "Humidity: "+data.query.results.channel.atmosphere.humidity, "Pressure: "+data.query.results.channel.atmosphere.pressure, "Rising: "+data.query.results.channel.atmosphere.rising, "Visibility: "+data.query.results.channel.atmosphere.visibility];

            // second column
            const forecast_arr = ["Date: "+data.query.results.channel.item.forecast[0].day+" "+data.query.results.channel.item.forecast[0].date, "High: "+data.query.results.channel.item.forecast[0].high, "Low: "+data.query.results.channel.item.forecast[0].low, "Date: "+data.query.results.channel.item.forecast[1].day+" "+data.query.results.channel.item.forecast[1].date, "High: "+data.query.results.channel.item.forecast[1].high, "Low: "+data.query.results.channel.item.forecast[1].low, "Date: "+data.query.results.channel.item.forecast[2].day+" "+data.query.results.channel.item.forecast[2].date, "High: "+data.query.results.channel.item.forecast[2].high, "Low: "+data.query.results.channel.item.forecast[2].low];

            //header
            let q_temp = data.query.results.channel.item.condition.temp;
            let q_item_description = data.query.results.channel.item.title;
            let q_desc = data.query.results.channel.item.condition.text;
            document.querySelector(".city").textContent = city;
            document.querySelector(".description").textContent = q_item_description;
            document.querySelector(".desc").textContent = q_desc;
            document.querySelector(".temp").textContent = q_temp+"°C";

            // first column
            let location = document.querySelectorAll(".content_location > p");
            for(let i=0;i<=9;i++) {location[i].textContent = query_arr[i];}

            // second column
            let forecast = document.querySelectorAll(".content_forecast > p");
            for(let i=0;i<=8;i++) {forecast[i].textContent = forecast_arr[i];}

            
            const days_arr = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
            let forecast_title = document.querySelectorAll(".content_forecast > h3");
            for(let i=1;i<=2;i++) {
               if(i==1) {var day = data.query.results.channel.item.forecast[1].day}
               else { day = data.query.results.channel.item.forecast[2].day};

               if(day == "Mon") forecast_title[i].textContent = days_arr[0];
               else if (day == "Tue") forecast_title[i].textContent = days_arr[1];
               else if(day == "Wed") forecast_title[i].textContent = days_arr[2];
               else if(day == "Thu") forecast_title[i].textContent = days_arr[3];
               else if(day == "Fri") forecast_title[i].textContent = days_arr[4];
               else if(day == "Sat") forecast_title[i].textContent = days_arr[5];
               else if(day == "Sun") forecast_title[i].textContent = days_arr[6];
            }
         }
      }
   }

   return {
      random_cities : random_cities,
      city_weather_information : city_weather_information
   }
})();
