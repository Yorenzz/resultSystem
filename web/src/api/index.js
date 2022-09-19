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

export const verify = token => {
  return request({
    method: 'GET',
    url: '/users/verify',
    data: { token },
  })
}

export const getStudentInformation = () => {
  return request({
    method: 'GET',
    url: '/student/getStudentInformation',
  })
}

export const searchStudent = keyword => {
  return request({
    method: 'GET',
    url: '/student/remoteSearchStudent',
    data: { keyword },
  })
}

export const register = (username, password) => {
  return request({
    method: 'POST',
    url: '/users/register',
    data: { username, password },
  })
}

export const changeStudentInformation = (
  ID,
  changeData,
  type,
) => {
  return request({
    method: 'POST',
    url: '/student/changeStudentInformation',
    data: { ID, changeData, type },
  })
}

export const uploadFile = file => {
  return request({
    method: 'POST',
    url: '/student/uploadFile',
    data: { file },
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

export const downloadStudentTemplate = () => {
  return request({
    method: 'GET',
    url: '/student/templateLink',
  })
}

export const getClass = grade => {
  return request({
    method: 'GET',
    url: '/student/getClass',
    data: { grade },
  })
}

export const studentResult = id => {
  return request({
    method: 'GET',
    url: '/result/studentResult',
    data: { id },
  })
}

export const advantageResult = (
  grade,
  Class,
  testTime = 1,
) => {
  return request({
    method: 'POST',
    url: '/result/getAdvantage',
    data: { grade, Class, testTime },
  })
}
