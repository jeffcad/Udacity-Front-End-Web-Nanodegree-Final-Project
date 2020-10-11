// This file is entry point for Webpack build tool
// If not using Webpack, don't need this

// Import functions from other files
import { submitted } from './js/app'
import { updateUI } from './js/updateUI'
import { checkLocalStorage } from './js/localStorage'
import { clearLocalStorage } from './js/localStorage'
import { apiCalls } from './js/apiCalls'
import { extractCityData } from './js/extractions'
import { extractForecastData } from './js/extractions'
import { extractMostLikedPhoto } from './js/extractions'
import { extractRandomPhoto } from './js/extractions'
import { createForecastCard } from './js/createForecastCard'

// Import styles from other files
import './styles/main.scss'
import './styles/form.scss'
import './styles/forecast.scss'

// Import weather icons from icon folder
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

// Export functions to Client library (see webpack.dev and webpack.prod files)
export {
    submitted,
    updateUI,
    checkLocalStorage,
    clearLocalStorage,
    apiCalls,
    extractCityData,
    extractForecastData,
    extractMostLikedPhoto,
    extractRandomPhoto,
    createForecastCard
}

// An IIFE to immediately set limits on date-picker selections in user form
// This will run as soon as page loads, before user inputs anything or clicks
// Earliest date is today for both calendars
// Departure calendar has maximum 15 days from today, due to forecast limitation
(function () {
    // Get today's date
    const d = new Date()
    let minMonth = (d.getMonth() + 1).toString()
    let minDate = d.getDate().toString()
    const minYear = d.getFullYear().toString()
    // Add 0 to months and days that are < 10
    if (minMonth.length == 1) {
        minMonth = "0" + minMonth
    }
    if (minDate.length == 1) {
        minDate = "0" + minDate
    }

    // Maximum date to start forecast is 15 days from today
    d.setDate(d.getDate() + 15)
    let maxMonth = (d.getMonth() + 1).toString()
    let maxDate = d.getDate().toString()
    const maxYear = d.getFullYear().toString()
    // Add 0 to months and days that are < 10
    if (maxMonth.length == 1) {
        maxMonth = "0" + maxMonth
    }
    if (maxDate.length == 1) {
        maxDate = "0" + maxDate
    }

    // Set minimum and maximum dates in calendar
    const formattedMinDate = `${minYear}-${minMonth}-${minDate}`
    const formattedMaxDate = `${maxYear}-${maxMonth}-${maxDate}`
    const departureDate = document.getElementById('departure-date')
    departureDate.setAttribute("min", formattedMinDate)
    departureDate.setAttribute("max", formattedMaxDate)
    const returnDate = document.getElementById('return-date')
    returnDate.setAttribute("min", formattedMinDate)

    // Add click listener on submit button
    const submitButton = document.getElementById('submit-button')
    submitButton.addEventListener('click', submitted)

    // Add listener to update the UI from local storage if it exists
    window.addEventListener('load', checkLocalStorage)

    // Add click listener to Clear Data button to erase local storage
    const clearButton = document.getElementById('clear-button')
    clearButton.addEventListener('click', clearLocalStorage)

})()