export interface Repo {
  _id: string
  name: string
  branches: string[]
}

export interface FileInfo {
  _id: string
  name: string
  text: string
  commit: string
  data: any
  checks: any
}