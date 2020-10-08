import { submitted } from './js/app'
import { getGeonameData } from './js/apiCalls'
import { getWeatherbitData } from './js/apiCalls'
import { getPhotoData } from './js/apiCalls'
import { extractCityData } from './js/extractions'
import { extractForecastData } from './js/extractions'
import { extractPhoto } from './js/extractions'
import { createForecastCard } from './js/createForecastCard'

import './styles/main.scss'
import './styles/form.scss'
import './styles/forecast.scss'


import './icons/a01d.png'
import './icons/a02d.png'
import './icons/a03d.png'
import './icons/a04d.png'
import './icons/a05d.png'
import './icons/a06d.png'
import './icons/c01d.png'
import './icons/c02d.png'
import './icons/c03d.png'
import './icons/c04d.png'
import './icons/d01d.png'
import './icons/d02d.png'
import './icons/d03d.png'
import './icons/f01d.png'
import './icons/r01d.png'
import './icons/r02d.png'
import './icons/r03d.png'
import './icons/r04d.png'
import './icons/r05d.png'
import './icons/r06d.png'
import './icons/s01d.png'
import './icons/s02d.png'
import './icons/s03d.png'
import './icons/s04d.png'
import './icons/s05d.png'
import './icons/s06d.png'
import './icons/t01d.png'
import './icons/t02d.png'
import './icons/t03d.png'
import './icons/t04d.png'
import './icons/t05d.png'
import './icons/u00d.png'

export {
    submitted,
    getGeonameData,
    getWeatherbitData,
    getPhotoData,
    extractCityData,
    extractForecastData,
    extractPhoto,

    createForecastCard
}

(function () {
    console.log("getTodayDate has been called")
    const d = new Date()
    let month = (d.getMonth() + 1).toString()
    let date = d.getDate().toString()
    const year = d.getFullYear().toString()
    if (month.length == 1) {
        month = "0" + month
    }
    if (date.length == 1) {
        date = "0" + date
    }

    const formattedDate = `${year}-${month}-${date}`
    const departureDate = document.getElementById('departure-date')
    departureDate.setAttribute("min", formattedDate)
    const returnDate = document.getElementById('return-date')
    returnDate.setAttribute("min", formattedDate)

})()

const submitButton = document.getElementById('submit-button')
submitButton.addEventListener('click', submitted)