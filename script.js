let gameScreen;
let output;
let bullets;

let ship;

const enemies = new Array();

let gameTimer;

let leftArrowDown = false;
let rightArrowDown = false;

let button;
let displayScore;
let score = 0;

const BG_SPEED = 4;
const GS_WIDTH = 800;
const GS_HEIGHT = 600;

$(document).on("keypress", function(event) {
    if (event.which == 32) fire(); //change to keyCode for chrome
    console.log('fired');
});

$(document).on("keyup", function(event) {
    if (event.which == 37) leftArrowDown = false;
    if (event.which == 39) rightArrowDown = false;
});


$(document).on("keydown", function(event) {
    if (event.which == 37) leftArrowDown = true;
    if (event.which == 39) rightArrowDown = true;
});


$(document).ready(function() {
    gameScreen = document.getElementById('gameScreen');
    gameScreen.style.width = GS_WIDTH + 'px';
    gameScreen.style.height = GS_HEIGHT + 'px';

    bg1 = $('<img />').attr({
        'id': 'bg1',
        'class': 'gameObject',
        'src': 'bg.gif',
        'width': 800,
        'height': 600

    }).appendTo($('#gameScreen'));

    bullets = $('<div />');
    bullets.attr('class', 'gameObject');
    bullets.css({
        'width': parseInt(gameScreen.style.width),
        'height': parseInt(gameScreen.style.height),
        'left': 0,
        'top': 0
    });
    bullets.appendTo($('#gameScreen'));

    button = $('<button />').attr({
        'id': 'restart',
        'class': 'gameObject',
        'src': 'bg.gif',
    });
    button.css({
        'width': 200,
        'height': 68,
        'top': 290,
        'left': 290,
        'font-size': 30,
        'color': 'white',
        'background-color': 'rgb(161, 0, 0,0.5)',
        'opacity': 0.5,
        'font-family': 'Orbitron ,sans-serif',
        'display': 'none'
    });
    button.append(document.createTextNode("Play Again"));
    button.appendTo($('#gameScreen'));


    $("#restart").on("click", function() {
        location.reload(true);
        $("#restart").hide();
    });

    displayScore = $('<div />');
    displayScore.attr('class', 'gameObject');
    displayScore.css({
        'width': 150,
        'height': 30,
        'right': 0,
        'top': 0,
        'backgroundColor': 'black',
        'border': '1px solid red',
        'color': 'white',
        'text-align': 'left',
        'padding-top': '8px',
        'padding-left': '5px',
        'font-family': 'Orbitron ,sans-serif'
    });
    displayScore.text("Score:");
    displayScore.appendTo($('#gameScreen'));

    output = document.getElementById('output');

    ship = document.createElement('IMG');
    ship.src = 'ship.gif';
    ship.className = 'gameObject';
    ship.style.width = '68px';
    ship.style.height = '68px';
    ship.style.top = '500px';
    ship.style.left = '366px';

    gameScreen.appendChild(ship);

    for (let i = 0; i < 10; i++) {
        let enemy = new Image();
        enemy.className = 'gameObject';
        enemy.style.width = '64px';
        enemy.style.height = '64px';
        enemy.src = 'enemyShip.gif';
        gameScreen.appendChild(enemy);
        placeEnemyShip(enemy);
        enemies[i] = enemy;
    }
    gameTimer = setInterval(gameloop, 50);

});

function placeEnemyShip(e) {
    e.speed = Math.floor(Math.random() * 10) + 6;

    let maxX = GS_WIDTH - parseInt(e.style.width);
    let newX = Math.floor(Math.random() * maxX);
    e.style.left = newX + 'px';

    let newY = Math.floor(Math.random() * 600) - 1000;
    e.style.top = newY + 'px';
}




function gameloop() {

    if (leftArrowDown) {
        let newX = parseInt(ship.style.left);
        if (newX > 0) ship.style.left = newX - 20 + 'px';
        else ship.style.left = '0px';
    }

    if (rightArrowDown) {
        let newX = parseInt(ship.style.left);
        let maxX = GS_WIDTH - parseInt(ship.style.width);
        if (newX < maxX) ship.style.left = newX + 20 + 'px';
        else ship.style.left = maxX + 'px';
    }

    let b = bullets.children();
    for (let i = 0; i < b.length; i++) {
        let newY = parseInt(b[i].style.top) - b[i].speed;
        if (newY < 0) bullets.find(b[i]).remove();
        else {
            b[i].style.top = newY + 'px';
            for (let j = 0; j < enemies.length; j++) {
                if (hittest(b[i], enemies[j])) {
                    this.score += 100;
                    displayScore.text("Score:   " + this.score);
                   
                    bullets.find(b[i]).remove();
                    explode(enemies[j]);
                    placeEnemyShip(enemies[j]);
                    break;
                }
            }
        }
    }
    // output.innerHTML = b.length;
    for (let i = 0; i < enemies.length; i++) {
        let newY = parseInt(enemies[i].style.top);
        if (newY > GS_HEIGHT) placeEnemyShip(enemies[i]);
        else enemies[i].style.top = newY + enemies[i].speed + 'px';

        if (hittest(enemies[i], ship)) {
            explode(ship);
            explode(enemies[i]);
            ship.style.top = '-10000px';
            placeEnemyShip(enemies[i]);
             bg1.attr('src','space1.gif');
            $("#restart").show();
        }
    }
}

function explode(obj) {
    let explosion = $('<img />');
    explosion.attr('class', 'gameObject');
    explosion.attr('src', 'explosion.gif?x=' + Date.now());
    explosion.css({
        'width': obj.style.width,
        'height': obj.style.height,
        'left': obj.style.left,
        'top': obj.style.top
    });
    explosion.appendTo($('#gameScreen'));

    new Audio("sounds/explosion.wav").play();
}

function fire() {
    new Audio("sounds/fire.wav").play();
    let bulletWidth = 4;
    let bulletHeight = 10;
    let bullet = document.createElement('DIV');
    bullet.className = 'gameObject';
    bullet.style.backgroundColor = 'yellow';
    bullet.style.width = bulletWidth;
    bullet.style.height = bulletHeight;
    bullet.speed = 20;
    bullet.style.top = parseInt(ship.style.top) - bulletHeight + 'px';
    let shipX = parseInt(ship.style.left) + parseInt(ship.style.width) / 2;
    bullet.style.left = (shipX - bulletWidth / 2) + 'px';
    bullets.append(bullet);
}


function hittest(a, b) {
    let aW = parseInt(a.style.width);
    let aH = parseInt(a.style.height);

    let aX = parseInt(a.style.left) + aW / 2;
    let aY = parseInt(a.style.top) + aH / 2;

    let aR = (aW + aH) / 4;

    let bW = parseInt(b.style.width);
    let bH = parseInt(b.style.height);

    let bX = parseInt(b.style.left) + bW / 2;
    let bY = parseInt(b.style.top) + bH / 2;

    let bR = (bW + bH) / 4;

    let minDistance = aR + bR;

    let cXs = (aX - bX) * (aX - bX);
    let cYs = (aY - bY) * (aY - bY);
    let distance = Math.sqrt(cXs + cYs);

    if (distance < minDistance) {

        return true;
    }
    else return false;

}
