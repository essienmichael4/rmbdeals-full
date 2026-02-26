export const GenerateSlug = (name:string): string => {
    const spilt = name.split(" ").join("-") 
    const removeOpenParenthesis = spilt.replaceAll("(", "")
    const removecloseParenthesis = removeOpenParenthesis.replaceAll(")", "")
    const removeOpenBrackets = removecloseParenthesis.replaceAll("[", "")
    const removecloseBrackets = removeOpenBrackets.replaceAll("]", "")
    const removecommas = removeOpenBrackets.replaceAll(",", "")

    return removecloseBrackets
}

export const GetDay = ()=>{
    const currentDate = new Date()
    const day = currentDate.getUTCDate()
    return day
}

export const GetMonth = ()=>{
    const currentDate = new Date()
    const month = currentDate.getUTCMonth()
    return month
}

export const GetYear = ()=>{
    const currentDate = new Date()
    const year = currentDate.getUTCFullYear()
    return year
}

export function DateToUTCDate(date:Date){
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    )
}

export function calcPercentageDifference(prevNum:number, currNum:number){
    return ((prevNum - currNum) / ((prevNum - currNum) / 2)) * 100
}
