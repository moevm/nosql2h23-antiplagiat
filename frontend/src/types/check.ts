export interface FileCheck {
    fileName: string
    pushDate: number
    commit: string
    author: string
    checks: Check[]
}

export interface Check {
    id: string
    date: number
    matches: Match[]
}

export interface Match {
    fileName: string
    matchPercent: number
    pushDate: number
    author: string
    matchedLines: MatchLine[]
}

export interface MatchLine {
    initial: string
    outer: string
}