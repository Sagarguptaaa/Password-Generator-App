const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const indicator = document.querySelector("[data-indicator]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberscaseCheck = document.querySelector("#numbers");
const symbolscaseCheck = document.querySelector("#symbols");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");

//intially
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleslider();

//Set Password length
function handleslider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //one more thing
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//set color
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow - HW
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Genrate Random password Functions
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

//Strength  Color Find
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberscaseCheck.checked) hasNum = true;
  if (symbolscaseCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

//Copy Content
async function copycontent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  //to make copy wala span visible

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

//check count
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
}

//Event Listener
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleslider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copycontent();
});

// Main Event Listener

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;

  let funcArr = [];

  password = "";

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numberscaseCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolscaseCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password = password + funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password = password + funcArr[randIndex]();
  }

  //shuffle the password
  password = shufflePassword(Array.from(password));

  //Show on UI
  passwordDisplay.value = password;

  calcStrength();
});
