const express = require('express');
const router = express.Router();
const Routes = require('../models/Routes')
const Users = require('../models/User')
const Robots = require('../models/Robots')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});




router.post('/saveRoutes', (req, res, next) => {


  let userId = req.user._id

  const {mines,time,distance,robotId} = req.body
  console.log(req.body)

  let saveRoute = {
    mines: mines,
    time: time,
    distance:distance,
    userId: userId,
    ownerRobot: robotId
  }

  Routes.create(saveRoute)
    .then(data => {
      Users.findByIdAndUpdate(userId, { $push: { routes: data._id } })
        .then(data => {
          res.json({ data })
        })
        .catch(err => console.log(err))
    })
    .catch(err => res.json({ err,Donde:"En Node" }))

})


router.get('/updateCounters', (req, res, next) => {
  console.log("update Counters Antes de la query")
  Routes.find()
  .then(data => {
    let totalDistance = 0;
    let totalMines = 0;
    let time = 0;
      data.forEach(ruta=>{
        totalDistance += ruta.distance
      })

      data.forEach(ruta=>{
        totalMines += ruta.mines
      })

      data.forEach(ruta=>{
        time += ruta.time
      })

      console.log(totalDistance)
      console.log(totalMines)
      console.log(time)

      totalDistance = totalDistance.toFixed(2)
   

      // let totalTime = data.reduce((first, second) => {
      //   return parseInt(first.time) + parseInt(second.time)
      // })
      console.log("Update counter")
      res.json({ "distance": totalDistance, "mines": totalMines, "time": time })
    })
})

router.get('/allRobots',(req,res,next)=>{


  Robots.find()
  .then(data=>{
    res.json({data})
  })
  .catch(err=>console.log(err))
  

})

module.exports = router;
