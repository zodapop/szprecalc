function trim(string){
  let newS = '';
  for(let i = 0; i < string.length; i++){
    if(string[i] !== ' '){
      newS += string[i];
    }
  }
  return newS;
}

function findNum(str, val){
  let nums   = [],
      numStr = '';
  for(let i = 0; i < str.length; i++){
    if(str.charCodeAt(i) > 47 && str.charCodeAt(i) < 58 || str[i] == '.' || i == 0 && str[i] == '-'
    || str[i] == '-' && str[i - 1] == '('){
      numStr += str[i];
    }
    else if(str[i] == 'x'){
      if(numStr){
        nums.push(numStr);
        numStr = '';
      }
      numStr += val;
    }
    else if(str[i] == '(' && str[i - 1] == '-' && i == 1){
      numStr += '1';
      nums.push(numStr);
      numStr = '';
    }
    else if(numStr){
      nums.push(numStr);
      numStr = '';
    }
  }
  if(numStr){
    nums.push(numStr);
  }
  for(let j = 0; j < nums.length; j++){
    nums[j] *= 1;
  }
  return nums;
}

function findOperands(str){
  let ops = [];
  for(let i = 0; i < str.length; i++){
    if(str[i] == '(' && (str[i - 1] == ')' || str[i - 1] == 'x' || str.charCodeAt(i - 1) > 47 && str.charCodeAt(i - 1) < 58 || str[i - 1] == '-' && i == 1)){
      ops.push('*');
      ops.push('(');
    }
    else if(str[i] == 'x' && str.charCodeAt(i - 1) > 47 && str.charCodeAt(i - 1) < 58){
      ops.push('*');
    }
    else if(str[i] == '%' || str.charCodeAt(i) > 39 && str.charCodeAt(i) < 44
    || str[i] == '-' && i !== 0 && str[i - 1] !== '(' || str[i] == '/' || str[i] == '^'){
       ops.push(str[i]);
    }
  }
  return ops;
}

function factorial(n){
  if(n == 0 || n == 1){
    return 1;
  }
  return n * factorial(n - 1);
}

function powerIndex(base, exponent){
  if(exponent === 0){
    return 1;
  }
  let number = base;
  while(--exponent){
    number *= base;
  }
  return number;
}

function naturalLog(x, n){
  if(n === 1 && x >= 0.5){
    return (x - 1)/x;
  }
  else if(n == 1){
    return x - 1;
  }
  else if(!n){
    n = 10000;
  }
  if(x >= 0.5){
    return powerIndex((x-1)/x, n)/n + naturalLog(x, n - 1);
  }
  else{
    return powerIndex(-1, n + 1)*powerIndex(x - 1, n)/n + naturalLog(x, n - 1);
  }
}

function ePowerSeries(x, n){
  if(n === 1){
    return x + 1;
  }
  else if(!n){
    n = 154;
  }
  return powerIndex(x, n)/factorial(n) + ePowerSeries(x, n - 1);
}

function power(base, exponent){ // doesnt work for complex numbers yet
  if(base === 0 && exponent > 0){
    return 0;
  }
  else if(base === 0 && exponent <= 0){
    return undefined;
  }
  else if(exponent !== 0 && base > 0){
    return ePowerSeries(exponent*naturalLog(base));
  }
  else if(exponent !== 0 && base < 0){
    return -ePowerSeries(exponent*naturalLog(-base));
  }
  else{
    return 1;
  }
}

function arithmeticSwitch(numArr, opsArr, operand, idx){
  if(operand == '^'){
    numArr[idx] = power(numArr[idx], numArr[idx + 1]);
  }
  else if(operand == '*'){
    numArr[idx] *= numArr[idx + 1];
  }
  else if(operand == '/'){
    numArr[idx] /= numArr[idx + 1];
  }
  else if(operand == '%'){
    numArr[idx] %= numArr[idx + 1];
  }
  else if(operand == '+'){
    numArr[idx] += numArr[idx + 1];
  }
  else{
    numArr[idx] -= numArr[idx + 1]
  }
  removeAt(numArr, idx + 1);
  removeAt(opsArr, idx);
}

function transferItem(arr1, arr2, idx){
  arr1.push(arr2[idx]);
  removeAt(arr2, idx);
}

function arrayOperandCondition(arr1, arr2, operand, idx){
  if(arr2[idx] == operand){
    arithmeticSwitch(arr1, arr2, operand, idx);
    idx--;
  }
}

function removeAt(arr, idx){
  for(let i = idx; i < arr.length - 1; i++){
    arr[i] = arr[i + 1];
  }
  arr.length--;
}

function insertAt(arr, idx, item){
  for(let i = arr.length - 1; i >= idx; i--){
    arr[i + 1] = arr[i];
  }
  arr[idx] = item;
}

function evaluate(string, val, numArr, opsArr){
  if(string){
    let trimmedString = trim(string);
    numArr = findNum(trimmedString, val);
    opsArr = findOperands(trimmedString);
  }
  let priority = 0,
      idx      = 0;
  while(opsArr.length){
    if(opsArr[idx] == '('){
      let parenCount = 1,
          newOpsArr  = [],
          newNumArr  = [];
      removeAt(opsArr, idx);
      transferItem(newNumArr, numArr, idx);
      while(parenCount){
        if(opsArr[idx] == ')'){
          if(parenCount == 1){
            insertAt(numArr, idx, 'placeholder');
            removeAt(opsArr, idx);
          }
          else{
            transferItem(newOpsArr, opsArr, idx);
          }
          parenCount--;
        }
        else if(opsArr[idx] == '('){
          parenCount++;
          transferItem(newOpsArr, opsArr, idx);
        }
        else{
          transferItem(newOpsArr, opsArr, idx);
          transferItem(newNumArr, numArr, idx);
        }
      }
      numArr[idx] = evaluate('', '', newNumArr, newOpsArr);
    }
    else if(priority == 1){
      arrayOperandCondition(numArr, opsArr, '^', idx);
    }
    else if(priority == 2){
      if(opsArr[idx] == '*'){
        arithmeticSwitch(numArr, opsArr, '*', idx);
        idx--;
      }
      else if(opsArr[idx] == '/'){
        arithmeticSwitch(numArr, opsArr, '/', idx);
        idx--;
      }
      else if(opsArr[idx] == '%'){
        arithmeticSwitch(numArr, opsArr, '%', idx);
        idx--;
      }
    }
    else if(priority == 3){
      if(opsArr[idx] == '+'){
        arithmeticSwitch(numArr, opsArr, '+', idx);
        idx--;
      }
      else if(opsArr[idx] == '-'){
        arithmeticSwitch(numArr, opsArr, '-', idx);
        idx--;
      }
    }
    if(idx == opsArr.length){
      idx = -1;
      priority++;
    }
    idx++;
  }
  return numArr[0];
} //doesnt check for the function to be valid yet, doesnt round either

// function roundNum(num, place){
//   let stringNum   = '' + num,
//       returnedNum = '',
//       count = 0,
//       onesIndex,
//       i = 0;
//   while(!onesIndex){
//     if(i == stringNum.length - 1 || stringNum[i + 1] == '.'){
//       onesIndex = i;
//     }
//     i++;
//   }
//   if(place < 1){
//     count++;
//   }
//   i = 1;
//   while(i !== place){
//     if(place > i){
//       i *= 10;
//       count--;
//     }
//     else{
//       i /= 10;
//       count++;
//     }
//   }
//   i = 0;
//   for(i; i < onesIndex + count; i++){
//     if(i == onesIndex + count - 1){
//       if(stringNum[i + 2] >= 5){
//         if(stringNum[i + 1] == 9){
//           returnedNum += stringNum[i]*1 + 1;
//           returnedNum += 0;
//         }
//         else{
//           returnedNum += stringNum[i];
//           returnedNum += stringNum[i+1]++;
//         }
//       }
//       else{
//         returnedNum += stringNum[i];
//         returnedNum += stringNum[i + 1];
//       }
//     }
//     else{
//       returnedNum += stringNum[i];
//     }
//   }
//   returnedNum *= 1;
//   while(count < 0){
//     returnedNum *= 10;
//     count++;
//   }
//   return returnedNum;
// }
