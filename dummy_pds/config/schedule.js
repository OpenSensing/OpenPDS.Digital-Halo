//var dmozTopic = App.require('dmoz') 
var dmozTopic = require('../app/anal/dmoz') 
dmozTopic() // First immediate invocation 
var dmozSchedule = setInterval(dmozTopic, 1800000)



