import axios from 'axios';
import Vue from 'vue'

axios.defaults.timeout = 10000;
// axios.defaults.baseURL = process.env.api;
// export const baseUrl = process.env.api;
const collectUrl = '/api/n_gather';
const liveUrl = ''

//发送拦截
axios.interceptors.request.use(
  config => {
    return config;
  }, err => {
    return Promise.reject(err);
  }
);
//接收拦截
axios.interceptors.response.use(
  response => {
    if (response.status == 200) {            
        return Promise.resolve(response);        
    } else {            
        return Promise.reject(response);        
    }
  },
  error => {
    if (error.response) {
      switch (error.response.errorCode) {
        
      }
    }
    return Promise.reject(error.response)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function getAxios(url, params = {},type="collect") {
  let baseUrl = liveUrl;
  if(type=='collect'){
    baseUrl = collectUrl;
  }
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}/${url}`, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postAixos(url, data = {},type="collect") {
  let baseUrl = liveUrl;
  if(type=='collect'){
    baseUrl = collectUrl
  }
  return new Promise((resolve, reject) => {
    axios.post(`${baseUrl}/${url}`, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleteAixos(url) {
  return new Promise((resolve, reject) => {
    axios.delete(`/n_gather/${url}`)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patchAxios(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(`/n_gather/${url}`, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function putAxios(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(`/n_gather/${url}`, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}