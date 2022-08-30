//html elements
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const num3 = document.getElementById("num3");
const check = document.getElementById("check");
const cross = document.getElementById("cross");
const addScore = document.getElementById("addScore");

//hide
document.getElementById("endScreen").style.display = "none";
document.getElementById("instructions").style.display = "none";

addScore.hidden = true;
cross.hidden = true;
check.hidden = true;

//sounds
const popSound = new sound("sounds/pop2.mp3");
const popSound2 = new sound("sounds/pop5.mp3");
const checkSound = new sound("sounds/right.mp3");
const crossSound = new sound("sounds/wrong.mp3");
const endSound = new sound("sounds/pop4.mp3");

//vars
var curNums = []
var curIndex = 0
var muted = false
var paused = false

// make private
var score = 0
document.getElementById("score").innerHTML = score;

function getRandomPosition(element) {
	var x = document.body.offsetHeight-element.clientHeight-100;
	var y = document.body.offsetWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x)+100;
    var randomY = Math.floor(Math.random()*y);

	element.style.top = randomX + 'px';
    element.style.left = randomY + 'px';
}

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect();
    const domRect2 = el2.getBoundingClientRect();
  
    return !(
      domRect1.top > domRect2.bottom ||
      domRect1.right < domRect2.left ||
      domRect1.bottom < domRect2.top ||
      domRect1.left > domRect2.right
    );
}

function checkPos() {
    if (elementsOverlap(num1, num2)) {
        return true
    }
    if (elementsOverlap(num1, num3)) {
        return true
    }
    if (elementsOverlap(num2, num3)) {
        return true
    }
    return false
}

function assignNewNum(element) {
    var randomNum = Math.floor(Math.random() * 11);
    while (curNums.includes(randomNum)) {
        randomNum = Math.floor(Math.random() * 11);
    }
    curNums.push(randomNum);
    element.innerHTML = randomNum.toString();
}

function renderNewNums() {
    curNums=[];
    curIndex=0;
    assignNewNum(numText1);
    assignNewNum(numText2);
    assignNewNum(numText3);
    curNums.sort(function(a, b){return a-b});

    getRandomPosition(num1);
    getRandomPosition(num2);
    getRandomPosition(num3);

    while (checkPos()) {
        getRandomPosition(num1);
        getRandomPosition(num2);
        getRandomPosition(num3);
    }

    num1.classList.add("pulse");
    num2.classList.add("pulse");
    num3.classList.add("pulse");
}

num1.addEventListener("click", function() {
    clicked(num1, numText1, path1);
});
num2.addEventListener("click", function() {
    clicked(num2, numText2, path2);
});
num3.addEventListener("click", function() {
    clicked(num3, numText3, path3);
});

function clicked(element, textElement, pathElement) {

    //stop game
    if (countdown <= -1) {
        num1.removeEventListener("click", function() {
            clicked(num1, numText1, path1);
        });
        num2.removeEventListener("click", function() {
            clicked(num2, numText2, path2);
        });
        num3.removeEventListener("click", function() {
            clicked(num3, numText3, path3);
        });
        return
    }
    
    //click logic
    if (curNums[curIndex].toString() == textElement.innerHTML) {
        if (!muted) {popSound.play()};

        //shrink animation
        pathElement.style.fill = "white";
        // element.classList.add("pulse");
        setTimeout(function(){
            // element.classList.remove("pulse");
            element.classList.add("shrink2");
            setTimeout(function(){
                element.classList.remove("shrink2");
                element.hidden = true;
            },300);
        },200);
        
        curIndex += 1

        if (curIndex == 3) {
            score+= 100;
            document.getElementById("score").innerHTML = score;
            addScoreAnimate("+100")
            setTimeout(showCheck, 300);
            return
        } else {
            score+= 10;
            document.getElementById("score").innerHTML = score;
            addScoreAnimate("+10")
        }

    } else {
        //shrink animation
        pathElement.style.fill = "red";
        if (!muted) {popSound2.play()};
        num1.classList.add("shake");
        num2.classList.add("shake");
        num3.classList.add("shake");
        setTimeout(function(){
            num1.classList.remove("shake");
            num2.classList.remove("shake");
            num3.classList.remove("shake");

            num1.classList.add("shrink2");
            num2.classList.add("shrink2");
            num3.classList.add("shrink2");
            setTimeout(function(){
                num1.classList.remove("shrink2");
                num2.classList.remove("shrink2");
                num3.classList.remove("shrink2");
                num1.hidden = true;
                num2.hidden = true;
                num3.hidden = true;
            },300);
        },500);

        setTimeout(showCross, 800);
    }
}

function addScoreAnimate(scoreText) {
    addScore.innerHTML = scoreText;
    addScore.hidden = false;
    addScore.classList.add("score-move");
    setTimeout(function(){
        check.classList.remove("score-move");
        addScore.hidden = true
    }, 300);
}


//combine into one function
function showCheck() {
    check.hidden = false;
    if (!muted) {checkSound.play()}
    check.classList.add("grow");
    setTimeout(function(){
        check.classList.remove("grow");
        check.classList.add("bounce-out");
        setTimeout(function(){
        check.classList.remove("bounce-out");
        check.hidden = true;
        }, 300);

        setTimeout(function(){
            num1.hidden = false;
            num2.hidden = false;
            num3.hidden = false;
            path1.style.fill = "orange";
            path2.style.fill = "orange";
            path3.style.fill = "orange";
            renderNewNums()
        }, 300);
        //turn into a seperate reset function

        //make animations faster maybe. add back in pulse? maybe a smaller pulse??
        
    },300);
}

function showCross() {
    cross.hidden = false;
    if (!muted) {crossSound.play()}
    cross.classList.add("grow");
    setTimeout(function(){
        cross.classList.remove("grow");
        cross.classList.add("bounce-out");
        setTimeout(function(){
            cross.classList.remove("bounce-out");
            cross.hidden = true;
        }, 300);

        setTimeout(function(){
            num1.hidden = false;
            num2.hidden = false;
            num3.hidden = false;
            path1.style.fill = "orange";
            path2.style.fill = "orange";
            path3.style.fill = "orange";
            renderNewNums()
        }, 300);
        //turn into a seperate reset function
        
    },300);
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

//timer
var countdown = 60;
function timer(){
    if (!paused) {
        countdown--;
    }

    if(countdown<=-1){
        clearInterval(timer);
        showEndScreen();
        return
    }

    document.getElementById("timer").innerHTML = countdown;
}

//end screen
function showEndScreen() {
    document.getElementById("endScreen").style.display = "block";
    // endSound.play();
    document.getElementById("endScreen").classList.add("grow");
    document.getElementById("finalScore").innerHTML = score.toString();
    document.getElementById("game-wrapper").style.opacity = "0.5";
}

document.getElementById("playAgainButton").addEventListener("click", function() {
    setTimeout(function(){
        document.getElementById("endScreen").style.display = "none";
        renderNewNums();
        countdown = 60;
        document.getElementById("game-wrapper").style.opacity = "1";
    }, 100);
});

function showStartScreen() {
    paused = true
    clearInterval(timer, 1000);
    document.getElementById("instructions").style.display = "block";
    document.getElementById("instructions").classList.add("grow");
    document.getElementById("game-wrapper").style.opacity = "0.5";
}

document.getElementById("closeButton").addEventListener("click", function() {
    setTimeout(function(){
        paused = false
        document.getElementById("instructions").style.display = "none";
        document.getElementById("game-wrapper").style.opacity = "1";
    }, 100);
});


document.getElementById("volume").addEventListener("click", function() {
    muted = !muted
    document.getElementById("volume").src = muted ? "imgs/volume-mute.png" : "imgs/volume.png";
    // if muted {}
    //ADD MUSIC?
});

document.getElementById("info").addEventListener("click", function() {
    showStartScreen()
});

//run game
window.onload = function() {
    document.getElementById("loading").style.display = "none";
    renderNewNums()
    setInterval(timer, 1000);
};