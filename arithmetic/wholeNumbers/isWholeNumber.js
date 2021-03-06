//<script src="arithmetic/wholeNumbers/isWholeNumber.js"></script>

function isWholeNumber(number){
  if(number >= 0 && !isFloat(number)){
    return true;
  }
  return false;
}

function isFloat(number){
  if(typeof(number) !== 'number'){
    return false;
  }
  let strNum = '' + number;
  for(let i = 0; i < strNum.length; i++){
    if(strNum[i] === '.'){
      return true
    }
  }
  return false;
}

// testRunner([
//   assertEquality(isWholeNumber(16), true, 'integer'),
//   assertEquality(isWholeNumber(291478), true, 'integer2'),
//   assertEquality(isWholeNumber(-29), false, 'negative integer'),
//   assertEquality(isWholeNumber(-21113), false, 'negative integer2'),
//   assertEquality(isWholeNumber(3.5), false, 'is a float'),
//   assertEquality(isWholeNumber(17.23535), false, 'is a float2'),
//   assertEquality(isWholeNumber(-17.23535), false, 'is a neg float'),
//   assertEquality(isWholeNumber(-535.11), false, 'is a neg float2'),
//   assertEquality(isWholeNumber(0), true, 'zero is a whole number')
// ]);
