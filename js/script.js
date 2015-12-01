var GLOBALS = {};
var scoreBoard;
var rightAudio = new Audio();
rightAudio.src = "sound/correct.mp3";
var wrongAudio = new Audio();
wrongAudio.src = "sound/wrong.mp3";

var square = document.getElementsByClassName("card_display");

var countries = [ { countryName: 'USA',
                 flagImage: 'img/us_flag.jpeg',
                 foodImage: ['img/us_food1.jpeg', 'img/us_food2.jpeg']
                },
                { countryName: 'China',
                 flagImage: 'img/ch_flag.jpeg',
                 foodImage: ['img/ch_food1.jpeg', 'img/ch_food2.jpeg']
                },
                { countryName: 'Japan',
                 flagImage: 'img/jp_flag.jpeg',
                 foodImage: ['img/jp_food1.jpg', 'img/jp_food2.jpg']
                },
                { countryName: 'Korea',
                 flagImage: 'img/kr_flag.jpeg',
                 foodImage: ['img/kr_food1.jpg', 'img/kr_food2.jpg']
                },
                { countryName: 'Thailand',
                 flagImage: 'img/th_flag.jpeg',
                 foodImage: ['img/th_food1.jpg', 'img/th_food2.jpg']
                },
                { countryName: 'Mexico',
                 flagImage: 'img/mx-flag.jpg',
                 foodImage: ['img/mx_food1.png', 'img/mx_food2.jpg']
                },
                { countryName: 'Spain',
                 flagImage: 'img/sp_flag.png',
                 foodImage: ['img/sp_food1.jpeg', 'img/sp_food2.JPG']
                },
                { countryName: 'Italy',
                 flagImage: 'img/it_flag.jpeg',
                 foodImage: ['img/it_food1.jpeg', 'img/it_food2.jpg']
                }            
            ];

var newImage = [];


window.onload = function(){
	readQueryParams();
	createCardField();
    init();
 };

 function init(){   

    newImage = [];
    shuffleImages();
    displayBoard();
    setTimeout(function() {
        document.getElementById('card-field').style.backgroundColor="white";
    }, 10*1000);

	scoreBoard = document.getElementById('score-board'); 
	
}

function readQueryParams() {
    var queryString = document.location.search.replace('?', '');
    queryString.split('&').map(function (pair) {
        var keyValue = pair.split('=');
        GLOBALS[keyValue[0]] = parseInt(keyValue[1]);
    });
}


function createCardField() {
    var table = document.getElementById('card-field');

    for(var rowIndex = 0; rowIndex < 4; rowIndex++){
        var row = table.insertRow(0);
        
        for(var cellIndex = 0;  cellIndex < GLOBALS.min_card/4; cellIndex++){   
            row.innerHTML += "<td><div class=\"card_display\"></div></td>"; 

        }         
    }   
}

function displayBoard(){
    document.getElementById('score-board').innerHTML = "0"; 
    
    for(var i = 0; i < square.length; i++){    
        square[i].style.backgroundImage = "url('img/blank.jpeg')";
        square[i].style.backgroundSize =  "120px 90px";
        square[i].style.backgroundRepeat =  "no-repeat";
        square[i].style.backgroundPosition ="center"; 
        square[i].setAttribute("index", i);
        square[i].setAttribute("isFlip", "false");
        square[i].setAttribute("isMatch", "false");
        square[i].addEventListener("click", function(){ 
            var index = parseInt(this.getAttribute("index"));
            this.setAttribute("isFlip", true);
            this.style.backgroundImage = "url('" + newImage[index] + "')";   
            setTimeout(flip2Back, 700);          
        })
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function shuffleImages() {
    var randomCountries = shuffle(countries).slice(0, GLOBALS.min_card/4);

    for (var i = 0; i < randomCountries.length; i++) {
        newImage = newImage.concat(randomCountries[i].flagImage,randomCountries[i].flagImage,randomCountries[i].foodImage);
    }
    newImage = shuffle(newImage);
}


function flip2Back(){
    var firstClick = "";
    var secondClick = "";
    var firstCountry = ""; 
    var secondCountry = "";
    var firstIndex = 0;

    for (var i = 0; i < square.length; i++) {

        if(square[i].getAttribute("isFlip") === "true" && square[i].getAttribute("isMatch") === "false") {          
            
            if(firstClick !== "") {
                secondClick = square[i].style.backgroundImage;
                
                secondCountry = secondClick.substring(secondClick.lastIndexOf("/")+1,secondClick.lastIndexOf("/")+3);
                secondClick = secondClick.substring(secondClick.lastIndexOf("_")+1,secondClick.lastIndexOf("_")+5);

                if(firstCountry === secondCountry){
                    if(firstClick !== secondClick) {
                        rightAudio.play();
                        square[i].setAttribute("isMatch", "true");
                        square[firstIndex].setAttribute("isMatch", "true");
                        checkScore();
                    } 
                    else {
                        wrongAudio.play();
                        square[i].setAttribute("isFlip", "false");
                        square[firstIndex].setAttribute("isFlip", "false");
                        square[i].style.backgroundImage = "url('img/blank.jpeg')";
                        square[firstIndex].style.backgroundImage = "url('img/blank.jpeg')";
                    }
                }

                    else {
                        wrongAudio.play();
                        square[i].setAttribute("isFlip", "false");
                        square[firstIndex].setAttribute("isFlip", "false");
                        square[i].style.backgroundImage = "url('img/blank.jpeg')";
                        square[firstIndex].style.backgroundImage = "url('img/blank.jpeg')";
                    }
                

            } else {
                firstClick = square[i].style.backgroundImage;
                firstCountry = firstClick.substring(firstClick.lastIndexOf("/")+1,firstClick.lastIndexOf("/")+3);
                firstClick = firstClick.substring(firstClick.lastIndexOf("_")+1,firstClick.lastIndexOf("_")+5);
                firstIndex = i;
            }
        }
    }
}

function checkScore(){
    var countMatch = 0;
    var isComplete = false;
    var getId = document.getElementById('score-board');
    var currentScore = parseInt(getId.getAttribute('data-score'));

    getId.setAttribute('data-score', ++currentScore);
    getId.innerHTML = currentScore;

    for (var i = 0; i < square.length; i++) {
        if(square[i].getAttribute("isMatch") === "true"){
            countMatch++;
            if(countMatch === square.length){
                isComplete = true;
                alert("Congratulation!!");
                init();
            }
        }
    }
}

function showFlag(){
    
    var showFlag = [];
    var flagDisplay = document.getElementById('flagDisplay');
    for (var i = 0; i < countries.length; i++) {
        showFlag.push(countries[i].flagImage);
        var myDiv = document.createElement("div");
        flagDisplay.appendChild(myDiv);
        myDiv.className = "divFlag";
        myDiv.setAttribute("title", countries[i].countryName)
        myDiv.style.backgroundImage = "url('" + showFlag[i] + "')";  
        myDiv.style.backgroundSize =  "40px 30px";
        myDiv.style.backgroundRepeat =  "no-repeat";
        
    }
}

