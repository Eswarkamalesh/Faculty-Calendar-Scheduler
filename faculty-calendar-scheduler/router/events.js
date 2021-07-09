const express = require('express')
const path = require('path')
var session = require('express-session')
const bodyParser = require('body-parser')
const urlencodedparser = bodyParser.urlencoded({ extended: true })
const queries = require('./db_queries')
const forgotpwd = require('./forget_pwd')
const addEventGoogle=require('./calendar')
const router = new express.Router()
const { check, validationResult } = require('express-validator')
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)
/*queries.addUserEvent('srivathsan77', {
    'Date': new Date(),
    'Start_time': eventStartTime,
    'End_Time': eventEndTime,
    'Desc': 'Meeting with Developers.2.0'
    'type':'personal'
})*/
router.post('/addEvent', urlencodedparser, (req, res) => {
	console.log("hi");
	console.log(req.body.eventStarttimeInput);
	new Date(new Date(req.body.eventStarttimeInput).toDateString())
	if(new Date(req.body.eventStarttimeInput)>new Date(req.body.eventEndTimeInput)){
            req.session.isDateError=true
            res.redirect('/calendar')
	}
	else{
	queries.addUserEvent(req.session.username, {
    'Date': new Date(new Date(req.body.eventStarttimeInput).toDateString()),
    'Start_time': new Date(req.body.eventStarttimeInput),
    'End_Time': new Date(req.body.eventEndTimeInput),
    'Desc': req.body.eventDescInput,
    'venue':req.body.eventVenueInput,
    'type':'personal'
	})
	var event={'start_time':new Date(req.body.eventStarttimeInput),
				'end_time':new Date(req.body.eventEndTimeInput),
				'venue':req.body.eventVenueInput,
				'desc': req.body.eventDescInput
				}
	queries.getUserToken(req.session.username,function (result) {
		addEventGoogle(event,result)
	})
	
    res.redirect('/calendar')
	}
})
router.get('/calendar',(req,res)=>{
	//console.log(req.session.username);
	queries.getUserEvent(req.session.username,function(result){
		req.session.events={}
		for (var i = result.length - 1; i >= 0; i--) {
			if (!req.session.events[result[i]['Date'].toDateString()]) {
      			req.session.events[result[i]['Date'].toDateString()] = {};
   			}
			req.session.events[result[i]['Date'].toDateString()][i]={
				'Start_time': result[i]['Start_time'].toLocaleTimeString(),
    			'End_Time': result[i]['End_Time'].toLocaleTimeString(),
    			'Desc': result[i]['Desc'],
    			'venue':result[i]['venue']
			}
			
		}
		queries.getUserTimetable(req.session.username,function(result2){
           var slot_timings=result2[1]
           var timetable=result2[0]

		queries.getCalendar(function(result3){

			for (var i = result3.length - 1; i >= 0; i--) {
				if(result3[i]['W/H']=='W'){
					
			if (!req.session.events[result3[i]['Date'].toDateString()]) {
      			req.session.events[result3[i]['Date'].toDateString()] = {};
   			}
   			for(var j=0;j<timetable.length;j++){
   				//console.log(timetable[j]['day'],result3[i]['Day']);
   				if(timetable[j]['day']==result3[i]['Day']){
   					
   					for(var k=0;k<timetable[j]['slots'].length;k++){

   						req.session.events[result3[i]['Date'].toDateString()][k+100]={
							'Start_time': slot_timings[k]['start_time'],
    						'End_Time': slot_timings[k]['end_time'],
    						'Desc': timetable[j]['slots'][k]['desc'],
    						'venue':timetable[j]['slots'][k]['venue']
							}
							   					
   				}
   			}
   			}
			
			
		}
		}
		if(req.session.isDateError){
			req.session.isDateError=false
		res.render('calendar',{events : req.session.events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:true,errors:[{
                msg: "Enter a valid Start and End date"
            }]})
	}
		else{
			//console.log(req.session.events)
			res.render('calendar',{events : req.session.events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false})
		}
		})

		})
		
		
	})
})
router.get('/slots',(req,res)=>{
	req.session.no_of_slots=3
	console.log(req.session.events);
	res.render('slots',{t_slot:req.session.no_of_slots,isAdmin:req.session.isAdmin,username:req.session.username})
})
router.post('/no_of_slots',urlencodedparser,(req,res)=>{
 req.session.no_of_slots=req.body.tot_slots

 res.render('slots',{t_slot:req.session.no_of_slots,isAdmin:req.session.isAdmin,username:req.session.username})

})
router.post('/slot_timings',urlencodedparser,(req,res)=>{
	var slot_timings=[]
		for (var i =1;i<=req.session.no_of_slots;i++) {
		var s='start'+i
		var e='end'+i
	slot_timings.push({'start_time':req.body[s],
					 'end_time':req.body[e]
						})
	}
	req.session.slot_timings=slot_timings
	console.log(req.session.slot_timings);
	res.redirect('/timetable')
})
router.get('/timetable',(req,res)=>{
	if(req.session.table){
		console.log('inside after');
	}
	else{
		console.log('inside before');
	var id=1
	tab=[{day:'Monday',slots:[]},
	{day:'Tuesday',slots:[]},
	{day:'Wednesday',slots:[]},
	{day:'Thursday',slots:[]},
	{day:'Friday',slots:[]},
	{day:'Saturday',slots:[]},
	{day:'Sunday',slots:[]}]
	no_of_slots=req.session.no_of_slots
	for(var i=0;i<tab.length;i++){
          for(j=0;j<no_of_slots;j++){
          	tab[i]['slots'].push({id:id.toString(),venue:'Ex:room no:204',desc:'Class: CSE-D'})
          	id+=1
          }
	}
	req.session.table=tab}
	res.render('timetable_final',{username:req.session.username,tab:req.session.table,tot_slots:req.session.no_of_slots,slot_timings:req.session.slot_timings,isAdmin:req.session.isAdmin})
	
})
router.post('/submit_slot/:slot_id',urlencodedparser,(req,res)=>{
	slot_id=req.params.slot_id
	venue=req.body.venue
	desc=req.body.desc
	for(var i=0;i<req.session.table.length;i++){
		for(var j=0;j<req.session.table[i]['slots'].length;j++){
			if(req.session.table[i]['slots'][j]['id']==slot_id){
				req.session.table[i]['slots'][j]['venue']=venue
				req.session.table[i]['slots'][j]['desc']=desc
			}
		}
	}
	res.redirect('../timetable')
})
router.post('/submit_timetable_final',urlencodedparser,(req,res)=>{
	console.log('timetable submitted')
	queries.addUserTimetable(req.session.username,req.session.table,req.session.slot_timings)
	res.redirect('/home')
})
router.get('/show_timetable',(req,res)=>{
	queries.getUserTimetable(req.session.username,function(result2){
           var slot_timings=result2[1]
           var timetable=result2[0]
	res.render('show_timetable',{username:req.session.username,tab:timetable,tot_slots:slot_timings.length,slot_timings:slot_timings,isAdmin:req.session.isAdmin})
})
})
router.get('/:user_id/show_timetable',urlencodedparser,(req,res)=>{
	queries.getUserTimetable(req.params.user_id,function(result2){
           var slot_timings=result2[1]
           var timetable=result2[0]
	res.render('admin_show_timetable',{username:req.session.username,tab:timetable,tot_slots:slot_timings.length,slot_timings:slot_timings,isAdmin:req.session.isAdmin})
})
})
router.get('/show_events',(req,res)=>{
	queries.getUserEvent(req.session.username,function(result){
		s_events=[]
		color_map={'faculty meeting':'blue',
				   'personal':'lightslategrey',
				   'exam duty':'violet',
				   'timetable':'antiquewhite'
		}
		for (var i = result.length - 1; i >= 0; i--) {
			s_events.push({
   							'Date':result[i]['Date'].toDateString(),
							'Start_time': result[i]['Start_time'].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    						'End_Time': result[i]['End_Time'].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    						'Desc': result[i]['Desc'],
    						'venue':result[i]['venue'],
    						'type':result[i]['type'],
    						'color':color_map[result[i]['type']]
							})
		}
		queries.getUserTimetable(req.session.username,function(result2){
           var slot_timings=result2[1]
           var timetable=result2[0]

		queries.getCalendar(function(result3){

			for (var i = result3.length - 1; i >= 0; i--) {
				if(result3[i]['W/H']=='W'){
   			for(var j=0;j<timetable.length;j++){
   				//console.log(timetable[j]['day'],result3[i]['Day']);
   				if(timetable[j]['day']==result3[i]['Day']){
   					
   					for(var k=0;k<timetable[j]['slots'].length;k++){

   						s_events.push({
   							'Date':result3[i]['Date'].toDateString(),
							'Start_time': slot_timings[k]['start_time'],
    						'End_Time': slot_timings[k]['end_time'],
    						'Desc': timetable[j]['slots'][k]['desc'],
    						'venue':timetable[j]['slots'][k]['venue'],
    						'type':'timetable',
    						'color':'antiquewhite'
							})
							   					
   						}
   					}
   			}
			
			
		}
		}req.session.show_events=s_events
			if(s_events.length%4==0){
			res.render('events_display',{events : s_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:0
		})
		}
		else{
			res.render('events_display',{events : s_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:1})
		}
		})
	})
		})
		

})
router.post('/filter_event',urlencodedparser,(req,res)=>{
console.log(req.body.start_time)
console.log(req.body.end_time)
console.log(req.body.event_type)
filtered_events=[]
for(var i=0;i<req.session.show_events.length;i++){
	if(req.body.event_type=='all' || req.session.show_events[i]['type']==req.body.event_type){
		var d1=new Date(new Date(req.session.show_events[i]['Date']).toDateString())
		var d2=new Date(new Date(Date.parse(req.body.start_time)).toDateString())
		var d3=new Date(new Date(Date.parse(req.body.end_time)).toDateString())
		if(d1>=d2 && d1<=d3){
			filtered_events.push(req.session.show_events[i])
			console.log('hi')
		}
	}
}
if(filtered_events.length%4==0){
			res.render('events_display',{events : filtered_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:0
		})
		}
		else{
			res.render('events_display',{events : filtered_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:1})
		}
})
router.post('/addEvent-admin', urlencodedparser, (req, res) => {
	var list = req.body.Faculty;
	if (typeof (list) == "string") {
		queries.addUserEvent(list, {
			'Date': new Date(new Date(req.body.eventStarttimeInput).toDateString()),
			'Start_time': new Date(req.body.eventStarttimeInput),
			'End_Time': new Date(req.body.eventEndTimeInput),
			'Desc': req.body.eventDescInput,
			'venue': req.body.eventVenueInput,
			'type': req.body.eventtype
		})
		var event={'start_time':new Date(req.body.eventStarttimeInput),
				'end_time':new Date(req.body.eventEndTimeInput),
				'venue':req.body.eventVenueInput,
				'desc': req.body.eventDescInput
				}
		queries.getUserToken(list,function (result) {
			addEventGoogle(event,result)
			})
	}
	else {
		for (var i = 0; i < list.length; i++) {
			queries.addUserEvent(list[i], {
				'Date': new Date(new Date(req.body.eventStarttimeInput).toDateString()),
				'Start_time': new Date(req.body.eventStarttimeInput),
				'End_Time': new Date(req.body.eventEndTimeInput),
				'Desc': req.body.eventDescInput,
				'venue': req.body.eventVenueInput,
				'type': req.body.eventtype
			})
			var event={'start_time':new Date(req.body.eventStarttimeInput),
				'end_time':new Date(req.body.eventEndTimeInput),
				'venue':req.body.eventVenueInput,
				'desc': req.body.eventDescInput
				}
			queries.getUserToken(list[i],function (result) {
				console.log(list[i],result);
			addEventGoogle(event,result)
			})
		}
	}
	res.redirect('/admin_dashboard')
})
router.get('/:user_id/show_events',urlencodedparser,(req,res)=>{
	queries.getUserEvent(req.params.user_id,function(result){
		s_events=[]
		color_map={'faculty meeting':'blue',
				   'personal':'lightslategrey',
				   'exam duty':'violet',
				   'timetable':'antiquewhite'
		}
		for (var i = result.length - 1; i >= 0; i--) {
			s_events.push({
   							'Date':result[i]['Date'].toDateString(),
							'Start_time': result[i]['Start_time'].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    						'End_Time': result[i]['End_Time'].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
    						'Desc': result[i]['Desc'],
    						'venue':result[i]['venue'],
    						'type':result[i]['type'],
    						'color':color_map[result[i]['type']]
							})
		}
		queries.getUserTimetable(req.params.user_id,function(result2){
           var slot_timings=result2[1]
           var timetable=result2[0]

		queries.getCalendar(function(result3){

			for (var i = result3.length - 1; i >= 0; i--) {
				if(result3[i]['W/H']=='W'){
   			for(var j=0;j<timetable.length;j++){
   				//console.log(timetable[j]['day'],result3[i]['Day']);
   				if(timetable[j]['day']==result3[i]['Day']){
   					
   					for(var k=0;k<timetable[j]['slots'].length;k++){

   						s_events.push({
   							'Date':result3[i]['Date'].toDateString(),
							'Start_time': slot_timings[k]['start_time'],
    						'End_Time': slot_timings[k]['end_time'],
    						'Desc': timetable[j]['slots'][k]['desc'],
    						'venue':timetable[j]['slots'][k]['venue'],
    						'type':'timetable',
    						'color':'antiquewhite'
							})
							   					
   						}
   					}
   			}
			
			
		}
		}req.session.show_events=s_events
			if(s_events.length%4==0){
			res.render('admin_event_display',{events : s_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:0
		})
		}
		else{
			res.render('admin_event_display',{events : s_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:1})
		}
		})
	})
		})
		
})
router.post('/:user_id/filter_event',urlencodedparser,(req,res)=>{
console.log(req.body.start_time)
console.log(req.body.end_time)
console.log(req.body.event_type)
filtered_events=[]
for(var i=0;i<req.session.show_events.length;i++){
	if(req.body.event_type=='all' || req.session.show_events[i]['type']==req.body.event_type){
		var d1=new Date(new Date(req.session.show_events[i]['Date']).toDateString())
		var d2=new Date(new Date(Date.parse(req.body.start_time)).toDateString())
		var d3=new Date(new Date(Date.parse(req.body.end_time)).toDateString())
		if(d1>=d2 && d1<=d3){
			filtered_events.push(req.session.show_events[i])
			console.log('hi')
		}
	}
}
if(filtered_events.length%4==0){
			res.render('admin_event_display',{events : filtered_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:0
		})
		}
		else{
			res.render('admin_event_display',{events : filtered_events,isAdmin:req.session.isAdmin,username:req.session.username,isWrong:false,result_len:1})
		}
})
module.exports = router;