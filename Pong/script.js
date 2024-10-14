
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let scoreSpiller1 = 0
let scoreSpiller2 = 0

var FPS = 60

let ball = {
    radius: 12,
    farge: "DarkGreen",
    xpos: Math.random() * 300 + 50,
    ypos: Math.random() * 200 + 400,
    xfart: 5,
    yfart: 4  
};

let plate = {
    bredde: 5,
    hoyde: 200,
    farge: "black",
    xpos: 20,
    ypos: 400,
    xfart: 0,
    yfart: 0
}

let plate2 = { //plate høyre side
    bredde: 5,
    hoyde: 200,
    farge: "black",
    xpos: canvas.width - 20,
    ypos: 250,
    xfart: 0,
    yfart: 0
}

var spillStartet = false //brukes til å starte spillet
var ikkePaused = true //brukes til å pause spillet når man tabber ut

document.addEventListener("visibilitychange", function(){ //når man tabber ut av spillet så pauser spillet
    if (!ikkePaused){
        ikkePaused = true
    } else if (ikkePaused){
        ikkePaused = false
    }     
})

document.body.onkeyup = function(e) { 
    if (!spillStartet && e.keyCode === 32) { //når spillet ikke er statet og man trykket space starter spillet
        if (lett.checked){
            fartAI = 4
        } else if (vanskelig.checked){
            fartAI = 6
        } else if (umulig.checked){
            fartAI = 8
        }
        spillStartet = true
        setInterval(gameloop, 1000/FPS)
        startSkjerm.style.visibility = "hidden"
        startSkjerm.style.position = "absolute"
        modes.style.visibility = "hidden"
        canvas.style.visibility = "visible"
      
        setInterval(function(){ //øker farten hvert 2 sekund
            if (ikkePaused){
                ball.xfart *= 1.08
                ball.yfart *= 1.05
            }
        },2000)
    }
}

spillere.onchange = function() {
    if (player1.checked){
        modes.style.visibility = "visible"
    } else if (player2.checked){
        modes.style.visibility = "hidden"
    }
}

meny.onclick = function() {
    document.location.reload()
}

function tegnBackgrunn() {
    ctx.font = "30px Comic Sans MS";
    ctx.fillText(scoreSpiller1 + "-" + scoreSpiller2, canvas.width/2, 50);
    ctx.font = "50px Comic Sans MS"
    ctx.fillStyle = "gray"
    ctx.fillText("PONG", canvas.width/2 - 50, canvas.height/2);
    if (player1.checked) {
        ctx.font = "30px Comic Sans MS"
        ctx.fillText("Win Streak: " + streak, 30, 50);
    }

}

function tegnPlate() {
    ctx.fillStyle = plate.farge
    ctx.fillRect(plate.xpos, plate.ypos, plate.bredde, plate.hoyde)
}

function tegnPlate2() {
    ctx.fillStyle = plate2.farge
    ctx.fillRect(plate2.xpos, plate2.ypos, plate2.bredde, plate2.hoyde)
}

function tegnBall() {
    ctx.fillStyle = "white"
    ctx.fillRect(0,0, canvas.width,canvas.height)

    ctx.strokeStyle = ball.farge
    ctx.fillStyle = ball.farge
    ctx.beginPath()
    ctx.arc(ball.xpos,ball.ypos, ball.radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.fill()
}

function oppdaterPlate(){
  plate.ypos += plate.yfart
  plate.xpos += plate.xfart
  if (plate.ypos >= (canvas.height - plate.hoyde)) {
    plate.yfart = 0
    plate.ypos = (canvas.height - plate.hoyde)
  }
  if (plate.ypos <= 0) {
    plate.yfart = 0
    plate.ypos = 0
  }
}

function oppdaterPlate2() {
    plate2.ypos += plate2.yfart
    plate2.xpos += plate2.xfart
    if (plate2.ypos >= (canvas.height - plate2.hoyde)) {
        plate2.yfart = 0
        plate2.ypos = (canvas.height - plate2.hoyde)
    }
    if (plate2.ypos <= 0) {
        plate2.yfart = 0
        plate2.ypos = 0
    }
}

var fartAI //farten til AI platen bestemt av vanskelighetsgrad

function oppdaterPlate2AI(){
    if (plate2.ypos + plate2.hoyde/2 > ball.ypos){
        plate2.ypos -= fartAI
    } else if (plate2.ypos + plate2.hoyde/2 < ball.ypos) {
        plate2.ypos += fartAI
    } 

    if (Math.abs(ball.yfart) < fartAI){
        plate2.ypos = ball.ypos - plate2.hoyde/2
    }
    
    if (plate2.ypos >= (canvas.height - plate2.hoyde)) {
        plate2.yfart = 0
        plate2.ypos = (canvas.height - plate2.hoyde)
    }
    if (plate2.ypos <= 0) {
        plate2.yfart = 0
        plate2.ypos = 0
    }
}

function oppdaterBall(){    
    ball.ypos += ball.yfart
    ball.xpos += ball.xfart

    if (ball.ypos + ball.radius >= canvas.height || ball.ypos <= 0) {
        ball.yfart *= -1
    }

//sjekker om det er kollisjon mellom ball og plate, og om det er i øvre eller nedre halvdel
    //1 halvdel
    if (ball.xpos >= (plate2.xpos - ball.radius - 5) && 
        ball.ypos + ball.radius - 5 > plate2.ypos && 
        ball.ypos < plate2.ypos + plate2.hoyde * 1/5) {
            
            ball.xpos -= 5
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * -1.2
    }
    //2 halvdel
    if (ball.xpos >= (plate2.xpos - ball.radius - 5) && 
        ball.ypos > plate2.ypos + plate2.hoyde * 1/5 && 
        ball.ypos < plate2.ypos + plate2.hoyde * 2/5) {
            
            ball.xpos -= 5
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * -1.1
            
    }
    //3 halvdel
    if (ball.xpos >= (plate2.xpos - ball.radius - 5) && 
        ball.ypos > plate2.ypos + plate2.hoyde  * 2/5 && 
        ball.ypos < plate2.ypos + plate2.hoyde * 3/5) {
            
            ball.xpos -= 5
            ball.xfart = ball.xfart * -1.05
            
    }
    //4 halvdel
    if (ball.xpos >= (plate2.xpos - ball.radius - 5) && 
        ball.ypos > plate2.ypos + plate2.hoyde  * 3/5 && 
        ball.ypos < plate2.ypos + plate2.hoyde * 4/5) {
            
            ball.xpos -= 5
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * 1.1
            
    }
    //5 havldel
    if (ball.xpos >= (plate2.xpos - ball.radius - 5) &&
        ball.ypos > plate2.ypos + plate2.hoyde * 4/5 && 
        ball.ypos - ball.radius + 5 < plate2.ypos + plate2.hoyde) {
            ball.xpos -= 5
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * 1.2
            
        }
// plate - venstre side
    //1 halvdel
    if (ball.xpos <= plate.xpos + 2*ball.radius + 5 && 
        ball.ypos + ball.radius > plate.ypos && 
        ball.ypos < plate.ypos + plate.hoyde * 1/5) {
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * -1.2
            
        }
    //2 havldel
    if (ball.xpos <= plate.xpos + 2*ball.radius + 5 && 
        ball.ypos > plate.ypos + plate.hoyde * 1/5 && 
        ball.ypos < plate.ypos + plate.hoyde * 2/5) {
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * -1.1
            
        }

    //3 
    if (ball.xpos <= plate.xpos + 2*ball.radius + 5 && 
        ball.ypos > plate.ypos + plate.hoyde * 2/5 && 
        ball.ypos < plate.ypos + plate.hoyde * 3/5) {
            ball.xfart = ball.xfart * -1.05
            
        } 

    //4 halvdel
    if (ball.xpos <= plate.xpos + 2*ball.radius + 5 && 
        ball.ypos > plate.ypos + plate.hoyde * 3/5 && 
        ball.ypos < plate.ypos + plate.hoyde * 4/5) {
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * 1.1
            
        }
    //5 havldel
    if (ball.xpos <= plate.xpos + 2*ball.radius + 5 && 
        ball.ypos > plate.ypos + plate.hoyde * 4/5 && 
        ball.ypos - ball.radius < plate.ypos + plate.hoyde) {
            ball.xfart = ball.xfart * -1.05
            ball.yfart = Math.abs(ball.yfart) * 1.2
            
        }
}

var vinkel //vinkel mellom ball retningsvektor og plate (venstre side)

function skjæring() {
    vinkel = (Math.atan((ball.xfart/ball.yfart))) / Math.PI * 180
    
}

document.onkeydown = function(evt) {
    var tallKode = evt.keyCode;
    if (tallKode === 87) {
        plate.yfart = -5
    }
    if (tallKode === 83) {
        plate.yfart = 5
    }
    if (tallKode === 38) {
        plate2.yfart = -5
    }
    if (tallKode === 40) {
        plate2.yfart = 5
    }
}

document.onkeyup = function(evt) {
    var tallKode = evt.keyCode;
    if (tallKode === 87) {
        plate.yfart = 0
    }
    if (tallKode === 83) {
        plate.yfart = 0
    }
    if (tallKode === 38) {
        plate2.yfart = 0
    }
    if (tallKode === 40) {
        plate2.yfart = 0
    }
}

function sjekkAntallSpillere() {
    if (player1.checked){
        return oppdaterPlate2AI()
    } else if (player2.checked){
        return oppdaterPlate2()
    }
}

var streak = 0

var lsHighscore = parseInt(localStorage.getItem("highscorePONG")) || 0
if (lsHighscore) {
    highscore.innerText = "Høyeste Winning-Streak: " + lsHighscore + "🔥"
}

resetHighscore.onclick = function() {
    localStorage.setItem("highscorePONG", 0)
    document.location.reload()
}

function sluttSpill() {
    if (ball.xpos > canvas.width || ball.xpos < 0) {
        if (ball.xpos > canvas.width) {
            scoreSpiller1 ++
            streak++
            sluttTekst.innerText = "Du Vant Runden!"
            
        } else if (ball.xpos < 0){
            scoreSpiller2++
            streak = 0
            sluttTekst.innerText = "Du Tapte Runden!"

        }

        if (player1.checked && streak > lsHighscore) {
            localStorage.setItem("highscorePONG", streak);
        }

            ball.xpos = 500
            ball.xfart = 0
            ball.yfart = 0

        sluttSkjerm.style.visibility = "visible"
        sluttSkjerm.style.position = "fixed"
        canvas.style.visibility = "hidden"
        
        provIgjen.onclick = function() {
            sluttSkjerm.style.visibility = "hidden"
            sluttSkjerm.style.position = "absolute"
            canvas.style.visibility = "visible"

            ball.xpos = Math.random() * 300 + 50
            ball.ypos = Math.random() * 200 + 400
            ball.xfart = 5
            ball.yfart = 4
        }
    }
}


function gameloop() {
    sluttSpill()
    tegnBall()
    tegnPlate()
    tegnPlate2()
    oppdaterBall()
    oppdaterPlate()
    sjekkAntallSpillere()
    tegnBackgrunn()
    // skjæring()
}


