const getOnlyNumbers = (arr) => {
    const newArr= arr.filter((num) => {
        if(typeof num === 'number')
        return true;
    })
    // ony return numbers from incoming array
return newArr
   
}

const duttyArray = [2, '55', true, 77, "my man", undefined]

getOnlyNumbers(duttyArray) 
console.log(2);
console.log(getOnlyNumbers(duttyArray));