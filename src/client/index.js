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

const submitButton = document.getElementById('submit-button')
submitButton.addEventListener('click', submitted)

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