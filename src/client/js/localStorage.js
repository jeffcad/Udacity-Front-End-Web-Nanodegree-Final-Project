/**
 * Loads data from local storage on page load and calls to update the UI
 * @param {load event} event Fires when page is finished loading
 */
export function checkLocalStorage(event) {
    if (localStorage.bigData) {
        const bigData = JSON.parse(localStorage.getItem('bigData'))
        Client.updateUI(bigData)
    }
}

/**
 * Clears data from local storage and reloads page if user clicks button
 * @param {click event} event Fires when clear button is clicked
 */
export function clearLocalStorage(event) {
    localStorage.clear()
    location.reload()
}