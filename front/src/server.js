import axios from 'axios';

export default class logueo {
  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      withCredentials: true
    });
  }

  login = (datosLogin) => {

    return this.service.post('/auth/login', datosLogin)
      .then((res) => {
        console.log(res)
        return res.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  isLoggedIn = () => {
    return this.service.get('/auth/isloggedin')
      .then(({ data }) => {
        return data
      })
      .catch(err => {
        console.log(err)
      })
  }

  comprobarLogueo = () => {
    return this.service.post('/auth/comprobar')
      .then((data) => {
        return data.data.auth
      })
      .catch(err => {
        console.log(err)
      })
  }


  saveRoutes = (mines, time, distance, robotId) => {

    return this.service.post('/saveRoutes', { mines, time, distance, robotId })
      .then((data) => {

        return data.data
      })
      .catch(err => {
        console.log(err + "En Server.js")
      })
  }

  updateCounters = () => {
    return this.service.get('/updateCounters')
      .then((data) => {
        console.log(data)
        return data
      })
      .catch(err => {
        console.log(err)
      })
  }

  allRobots = () => {
    return this.service.get('/allRobots')
      .then((data) => {
        return data.data
      })
      .catch(err => {
        console.log(err)
      })

  }


  logout = () => {
    return this.service.get('/auth/logout')
      .then((data) => {
        console.log("Logout del SERVER")
        return data
      })
      .catch(err => console.log(err))
  }

}

