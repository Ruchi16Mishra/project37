//Create variables here
var dog, happydog, database, foodS, foodStock;
var saddogImage, happydogImage;
var addFood, foodobj;
var fedTime, lastFed;
var gameState;
var readState;

var brImage, grdImage, wrImage;
var currentTime;

function preload()
{
  //load images here
  happydogImage = loadImage("images/dogImg1.png");
  saddogImage = loadImage("images/dogImg.png");
  brImage = loadImage("images/Bed Room.png");
  grdImage = loadImage("images/Garden.png");
  wrImage = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodobj = new Food();

  dog = createSprite(800,200, 150,150);
  dog.addImage(saddogImage);
  dog.scale = 0.15;

  //foodStock is the refernce created to the database variable that holds the actual value
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  fedTime = database.ref('fedtime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });
  
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDogs);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    state = data.val();
    });
}


function draw() {  
  background(46, 139, 87);

  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("Playing");
    foodobj.garden();
  }
  else if(currentTime === (lastFed + 2)){
    update("Sleeping");
    foodobj.bedRoom();
  }
  else if(currentTime>(lastFed+2) && currentTime <= (lastFed+4)){
    update("Bathing");
    foodobj.washRoom();
  }
  else{
    update("Hungry");
    foodobj.display();
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show()
    dog.addImage(saddogImage);
  }

  drawSprites();
}
  
function update(state){
  database.ref('/').update({
    gameState : state
  })
}
function readStock(data){
  //foodS is the container which hold the number of bottles.
  foodS = data.val();
  foodobj.updateFoodStock(foodS);
}

function feedDogs(){
  dog.addImage(happydogImage);

  foodobj.updateFoodStock(foodobj.getFoodStock() - 1);
  database.ref('/').update({
    food : foodobj.getFoodStock(),
    fedtime: hour(),
    gameState: "Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food : foodS
  })
}