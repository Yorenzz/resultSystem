import request from '../utils/request.js'

export const Login = (username, password) => {
  return request({
    method: 'POST',
    url: '/users/login',
    data: {
      username,
      password,
    },
  })
}

export const getStudentInformation = () => {
  return request({
    method: 'GET',
    url: '/student/getStudentInformation'
  })
}

export const searchStudent = (keyword) => {
  return request({
    method: 'GET',
    url: '/student/remoteSearchStudent',
    data: { keyword }
  })
}

export const studentResult = (id) => {
  return request({
    method: 'GET',
    url: '/student/studentResult',
    data: { id }
  })
}