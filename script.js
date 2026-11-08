const monthYear = document.querySelector("#month-year")
const weekDay = document.querySelectorAll(".weekday")
const dates = document.querySelectorAll(".day")
const currentDay = new Date()


const weekDayLabels = ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']
const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// making month and week labels
monthYear.textContent = monthLabels[currentDay.getMonth()] + " " + currentDay.getFullYear()

for (let i = 0; i < 7; i++) {
    weekDay[i].textContent = weekDayLabels[i]
}


let monday = new Date(currentDay) // clone of the current day
monday.setDate((currentDay.getDate() - (currentDay.getDay() + 6) % 7)) // turn it into monday of the week


let sunday = new Date(monday) // clone monday
sunday.setDate(monday.getDate() + 6) // turn it into sunday

const weekRange = `${monday.toDateString()} - ${sunday.toDateString}`


let visibleDate = new Date(currentDay)
let weekDates = []


function newWeekUpdate() {
    weekDates = []
 
    sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6) // set sundays date

    // updating the month display
    if (monday.getMonth() !== sunday.getMonth()) {
        monthYear.textContent = `${monthLabels[monday.getMonth()]} ${monday.getFullYear()} - ${monthLabels[sunday.getMonth()]} ${sunday.getFullYear()}`
    }

    else {
        monthYear.textContent = monthLabels[visibleDate.getMonth()] + " " + visibleDate.getFullYear()
    }


    for (let i = 0; i < 7; i++) {
    
    const weekDate = new Date(monday)
    weekDate.setDate(monday.getDate() + i) // set monday's date
    dates[i].textContent = weekDate.getDate() // insert the day of the month for the week
    
    weekDates.push(weekDate)
    }

    highlightVisibleDay()
    
    // dates[i].classList.remove("active-day")
    // if (weekDate.toDateString() === currentDay.toDateString()) {
    //     dates[i].classList.add("active-day")
    // }

    // dates[i].classList.remove("visible-active-day")
    // if (weekDate.toDateString() === currentDay.toDateString() && visibleDate.toDateString() === weekDate.toDateString()) {
    //     dates[i].classList.add("visible-active-day")
    // }

    // dates[i].classList.remove("visible-day")
    // if (weekDate.toDateString() === visibleDate.toDateString() ) {
    //     dates[i].classList.add("visible-day")
        // monthYear.textContent = monthLabels[visibleDate.getMonth()] + " " + visibleDate.getFullYear()
    // }
    // }
}





function highlightVisibleDay() {
    const daysOfTheWeek = document.querySelectorAll(".day") // - dates
    // const allTimelines = document.querySelectorAll(".calendar-day")  // allTheDays or calendarDays  ||  document or mainViewContainer?

    const index = weekDates.findIndex(weekDate =>
        visibleDate.toDateString() === weekDate.toDateString()
    )
    const currentDayIndex = weekDates.findIndex(weekDate =>
        currentDay.toDateString() === weekDate.toDateString()
    )


    daysOfTheWeek.forEach(dayOfTheWeek => 
    dayOfTheWeek.classList.remove("visible-day", "active-day")
    )



    if (index !== -1) {
        daysOfTheWeek[index].classList.add("visible-day")

    }

    if (currentDayIndex !== -1) {
        daysOfTheWeek[currentDayIndex].classList.add("active-day")
    }
}




newWeekUpdate() // calling the week update when they open the calendar

const template = document.querySelector("#calendar-day-template")
const topSentinel = document.querySelector("#top-sentinel")
const bottomSentinel = document.querySelector("#bottom-sentinel")
const mainViewContainer = document.querySelector("#main-view-section-daily");


// cloning an initial template for the first day when the app is opened
const templateClone = template.content.cloneNode(true);
mainViewContainer.insertBefore(templateClone, bottomSentinel) // inserting the cloned template
const calendarDay = mainViewContainer.querySelector(".calendar-day") // creating calendar day const after making the initial template clone - since it is inside the template


// assigning a date to the initial template cloned
const freshDay = new Date(currentDay)
mainViewContainer.querySelector(".calendar-day").dataset.date = freshDay.toDateString() 

mainViewContainer.getElementsByClassName("border-date")[0].textContent = freshDay.toDateString()



// *************
// creating an observer to watch for the date so that it can update the weekly tab
// const calendarDayObserver = new IntersectionObserver(trackVisibleDayIntersection)
// calendarDayObserver.observe(calendarDay)


// observer for each new day timeline
const observer = new IntersectionObserver(createNewDayTimelines)
observer.observe(topSentinel)
observer.observe(bottomSentinel)




// setting up infinite scroll - creating a new time line for each day
function createNewDayTimelines(entries) {

    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return
        }

        if (entry.target === topSentinel && entry.isIntersecting) {
            const topTemplateClone = template.content.cloneNode(true)
            const newTopCalendarDay = topTemplateClone.querySelector(".calendar-day")

            const allTheDays = mainViewContainer.querySelectorAll(".calendar-day")
            const lastKnownDay = allTheDays[0] // we want index 0, the first/last date in the list of dates

            const followingDay = new Date(lastKnownDay.dataset.date)
            followingDay.setDate(followingDay.getDate() - 1)


            console.log("Existing first timeline:", lastKnownDay.dataset.date)
            console.log("New top timeline date:", followingDay.toDateString())


            newTopCalendarDay.dataset.date =  followingDay.toDateString()  // assigning a date to each new timeline

            newTopCalendarDay.getElementsByClassName("border-date")[0].textContent = followingDay.toDateString() //changing the border-date indicator at 12am on timeline


            mainViewContainer.insertBefore(topTemplateClone, topSentinel.nextSibling) // had to assign before inserting into the main view container. The clone's children are removed after inserting into the DOM
            // calendarDayObserver.observe(newTopCalendarDay)

            console.log("MVC:", mainViewContainer.children)
        }


        if (entry.target === bottomSentinel && entry.isIntersecting) {
            const bottomTemplateClone = template.content.cloneNode(true)
            const newBottomCalendarDay = bottomTemplateClone.querySelector(".calendar-day")

            const allTheDays = mainViewContainer.querySelectorAll(".calendar-day")
            const lastKnownDay = allTheDays[allTheDays.length - 1]

            const followingDay = new Date(lastKnownDay.dataset.date)
            followingDay.setDate(followingDay.getDate() + 1)

            newBottomCalendarDay.dataset.date =  followingDay.toDateString() // assigning a date to each new timeline

            newBottomCalendarDay.getElementsByClassName("border-date")[0].textContent = followingDay.toDateString() //changing the border-date indicator at 12am on timeline


            mainViewContainer.insertBefore(bottomTemplateClone, bottomSentinel)
            // calendarDayObserver.observe(newBottomCalendarDay)

        }
    }
    )
}



// function for checking if the visible day falls within the week dates and update if needed
// function trackVisibleDayIntersection(entries) {
//     entries.forEach(entry => {
//         if (
//             entry.isIntersecting && weekDates.some(weekDate =>
//                 entry.target.dataset.date === weekDate.toDateString()
//             )) {

//             visibleDate = new Date(entry.target.dataset.date)
//             newWeekUpdate()
//             }

//         if (
//             entry.isIntersecting && !weekDates.some(weekDate =>
//                 entry.target.dataset.date === weekDate.toDateString()
//             )) {
//             visibleDate = new Date(entry.target.dataset.date)
//             monday = new Date(visibleDate) // clone of the visible day
//             monday.setDate((visibleDate.getDate() - (visibleDate.getDay() + 6) % 7)) // set it to monday of the week
//             newWeekUpdate()
//             }
//     })
        
//         console.log(visibleDate)
//         console.log(new Date(entry.target.dataset.date))  
// }



//function for returning to current day when you click the button
function returnToCurrentDay() {
    const allTheDays = mainViewContainer.querySelectorAll(".calendar-day")
    allTheDays.forEach(day => {
        if (day.dataset.date === currentDay.toDateString()) {
            day.scrollIntoView({behavior: "smooth", block: "start"})
            console.log("back to today - clicked!")
        }
    }
    )
}

const backToToday = document.querySelector(".todays-date")
backToToday.addEventListener("click", returnToCurrentDay)

 



// function to update the week and highlight the current visible day every time you scroll
function trackVisibleDay() {

    let largestVisibleHeight = 0

    const calViewRect = calendarView.getBoundingClientRect()

    const calendarDays = document.querySelectorAll(".calendar-day")
    calendarDays.forEach (calendarDay => {
        const calDayRect = calendarDay.getBoundingClientRect()

        const visibleTop = Math.max(calDayRect.top, calViewRect.top)
        const visibleBottom = Math.min(calDayRect.bottom, calViewRect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)

        if (visibleHeight > largestVisibleHeight) {
            largestVisibleHeight = visibleHeight
            visibleDate = new Date(calendarDay.dataset.date)
        }
    })


    if (!weekDates.some(weekDay =>
        visibleDate.toDateString() === weekDay.toDateString())) {
            monday = new Date(visibleDate)
            monday.setDate(visibleDate.getDate() - (visibleDate.getDay() + 6) % 7)
            newWeekUpdate()
        }
        
    
    else {
        highlightVisibleDay()
    }
}

const calendarView = document.querySelector("#main-view-section-daily")
calendarView.addEventListener("scroll", trackVisibleDay)



















































