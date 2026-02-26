export const FormattedDate = (date:Date) => {
    return date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
}

export const FormattedTime = (date:Date) => {
    return date.toLocaleTimeString("default", {
        timeZone: "UTC",
    })
}
