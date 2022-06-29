const testFunction = (arr) => {

    const newArray = arr.filter((elem) => typeof elem === "number")
    return newArray
}

console.log(testFunction([2, 5, "3242543"]))