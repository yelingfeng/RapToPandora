import axios, { AxiosInstance } from 'axios'

const domainName = '/RAP'

const instance: AxiosInstance = axios.create({
  baseURL: domainName,
  timeout: 15000,
})

export const getQueryModelAPI = (projectId: string) => {
  const url = `/api/queryModel.do?projectId=${projectId}`
  return instance.get(url)
}

export const getQueryRAPModel = (projectId: string) => {
  const url = `/api/queryRAPModel.do?projectId=${projectId}`
  return instance.get(url)
}

export const getWhiteList = (projectId: string) => {
  const url = `/mock/getWhiteList.do?projectId=${projectId}`
  return instance.get(url)
}
