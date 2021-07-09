const { google } = require('googleapis')
const { oauth2 } = require('googleapis/build/src/apis/oauth2')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2('957946762556-nhq84b6go8ai5cb1fg3erucule3uaek2.apps.googleusercontent.com', 'wuVGqqb34Z0GjWMP89H8aipn')
const addEventGoogle = (event_obj, refresh_token) => {
    oAuth2Client.setCredentials({
        refresh_token: refresh_token//'1//042-qnNSeiBtnCgYIARAAGAQSNwF-L9IrjZ5s2UPW-shXJqlhQATKURR8sKlycL-u15gz9GdRWkfXzDrpTYbbKplAdn_3IRMSGT8'
    })
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
    const eventStartTime = new Date(event_obj['start_time'])
    /*eventStartTime.setMonth(event_obj['start_time'].getMonth())
    eventStartTime.setDate(event_obj['start_time'].getDay())
    eventStartTime.setHours(event_obj['start_time'].getHours())
    eventStartTime.setMinutes(event_obj['start_time'].getMinutes())*/
    const eventEndTime = new Date(event_obj['end_time'])
    /*eventEndTime.setDate(event_obj['end_time'].getDay())
    eventEndTime.setHours(event_obj['end_time'].getHours())
    eventEndTime.setMinutes(event_obj['end_time'].getMinutes())*/
    console.log('start_time:',eventStartTime);
    console.log('end_time:',eventEndTime);
    const event = {
        summary: event_obj['desc'],
        location: event_obj['desc'],
        description: event_obj['desc'],
        start: {
            dateTime: eventStartTime,
            timeZone: 'IST'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'IST'
        },
        ColorId: 1,
    }
    calendar.freebusy.query({
            resource: {
                timeMin: eventStartTime,
                timeMax: eventEndTime,
                timeZone: 'IST',
                items: [{ id: 'primary' }],
            },
        },
        (err, res) => {
            if (err) return console.error('Free Busy Query Error: ', err)
            const eventArr = res.data.calendars.primary.busy
            if (eventArr.length === 0)
                return calendar.events.insert({ calendarId: 'primary', resource: event },
                    err => {
                        if (err) return console.error('Error Creating Calender Event:', err)
                        return console.log('Calendar event successfully created.')
                    }
                )
            return console.log(`Sorry I'm busy...`)
        }
    )
}
/*oAuth2Client.setCredentials({
    refresh_token: '1//042-qnNSeiBtnCgYIARAAGAQSNwF-L9IrjZ5s2UPW-shXJqlhQATKURR8sKlycL-u15gz9GdRWkfXzDrpTYbbKplAdn_3IRMSGT8'
})
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)
const event = {
        summary: 'meet with vishnu',
        location: 'virtual-telegram',
        description: 'about fcss',
        start: {
            dateTime: eventStartTime,
            timeZone: 'IST'
        },
        end: {
            dateTime: eventEndTime,
            timeZone: 'IST'
        },
        ColorId: 1,
    }
    // Check if we a busy and have an event on our calendar for the same time.
calendar.freebusy.query({
        resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'IST',
            items: [{ id: 'primary' }],
        },
    },
    (err, res) => {
        // Check for errors in our query and log them if they exist.
        if (err) return console.error('Free Busy Query Error: ', err)

        // Create an array of all events on our calendar during that time.
        const eventArr = res.data.calendars.primary.busy

        // Check if event array is empty which means we are not busy
        if (eventArr.length === 0)
        // If we are not busy create a new calendar event.
            return calendar.events.insert({ calendarId: 'primary', resource: event },
            err => {
                // Check for errors and log them if they exist.
                if (err) return console.error('Error Creating Calender Event:', err)
                    // Else log that the event was created.
                return console.log('Calendar event successfully created.')
            }
        )

        // If event array is not empty log that we are busy.
        return console.log(`Sorry I'm busy...`)
    }
)*/
module.exports=addEventGoogle