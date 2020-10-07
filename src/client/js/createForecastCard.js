export function createForecastCard(forecast, units) {
    let temperatureUnit = "C"
    let speedUnit = "m/s"
    let depthUnit = "mm"
    if (units == "I") {
        temperatureUnit = "F"
        speedUnit = "mph"
        depthUnit = "in"
    }

    const forecastCard = document.createElement('div')
    forecastCard.classList.add('forecast-card')

    const dateDiv = document.createElement('div')
    dateDiv.classList.add('date')
    dateDiv.innerHTML = forecast.date

    const iconDiv = document.createElement('div')
    iconDiv.classList.add('icon')
    iconDiv.innerHTML = `<img src="./icons/${forecast.icon}.png">`

    const descriptionDiv = document.createElement('div')
    descriptionDiv.classList.add('description')
    descriptionDiv.innerHTML = forecast.description

    const highTemperatureDiv = document.createElement('div')
    highTemperatureDiv.classList.add('high-temperature')
    highTemperatureDiv.innerHTML = `High temperature: ${forecast.highTemperature}\xB0${temperatureUnit}`

    const lowTemperatureDiv = document.createElement('div')
    lowTemperatureDiv.classList.add('low-temperature')
    lowTemperatureDiv.innerHTML = `Low temperature: ${forecast.lowTemperature}\xB0${temperatureUnit}`

    const humidityDiv = document.createElement('div')
    humidityDiv.classList.add('humidity')
    humidityDiv.innerHTML = `Humidity: ${forecast.humidity}%`

    const chancePrecipitationDiv = document.createElement('div')
    chancePrecipitationDiv.classList.add('chance-precipitation')
    chancePrecipitationDiv.innerHTML = `Chance of precipitation: ${forecast.chancePrecipitation}%`

    const precipitationDiv = document.createElement('div')
    precipitationDiv.classList.add('precipitation')
    precipitationDiv.innerHTML = `Precipitation amount: ${forecast.precipitation.toFixed(1)}${depthUnit}`

    const snowDiv = document.createElement('div')
    snowDiv.classList.add('snow')
    snowDiv.innerHTML = `Snow amount: ${forecast.snow.toFixed(1)}${depthUnit}`

    const windSpeedDiv = document.createElement('div')
    windSpeedDiv.classList.add('wind-speed')
    windSpeedDiv.innerHTML = `Windspeed: ${forecast.windSpeed.toFixed(1)}${speedUnit}`

    const windDirectionDiv = document.createElement('div')
    windDirectionDiv.classList.add('wind-direction')
    windDirectionDiv.innerHTML = `Wind direction: ${forecast.windDirection}\xB0`

    forecastCard.append(dateDiv)
    forecastCard.append(iconDiv)
    forecastCard.append(descriptionDiv)
    forecastCard.append(highTemperatureDiv)
    forecastCard.append(lowTemperatureDiv)
    forecastCard.append(humidityDiv)
    forecastCard.append(chancePrecipitationDiv)
    forecastCard.append(precipitationDiv)
    forecastCard.append(snowDiv)
    forecastCard.append(windSpeedDiv)
    forecastCard.append(windDirectionDiv)

    return forecastCard
}