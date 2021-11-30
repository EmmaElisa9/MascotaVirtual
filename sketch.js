var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var CP;

//crea aquí las variables feed y lastFed 
var feed, lastFed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //crea aquí el boton Alimentar al perro
  CP=createButton("Alimenta al perro");
  CP.position(1000,95);
  CP.mousePressed(feedDog);

  addFood=createButton("Agregar Alimento");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();


  //escribe el código para leer el valor de tiempo de alimentación de la base de datos
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fechaHora();


  drawSprites();
}

//función para leer la Existencia de alimento
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var food_val = foodObj.getFoodStock();
  if(food_val <= 0){
    foodObj.updateFoodStock(food_val*0);
  }
  else{
    foodObj.updateFoodStock(food_val-1);
  }
  //escribe el código aquí para actualizar las existencia de alimento, y la última vez que se alimentó al perro

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//función para agregar alimento al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

async function fechaHora(){
  var fechahora = await fetch("http://worldtimeapi.org/api/timezone/America/Mexico_City");
  var FHjson = await fechahora.json();
  console.log(FHjson);
  var DateTime = FHjson.datetime;
  console.log(DateTime);
  var time = DateTime.slice(11,13);
  console.log(time);

  //escribe el código para mostrar el texto lastFed time aquí
  fill(200,20,100);
  textSize(17);
  if(lastFed>=12) {
    text("última hora en que se alimentó : "+time +" PM", 300,30);
  }
  else if(lastFed===0){
     text("última hora en que se alimentó : "+time +" PM", 300,30);
  }
  else{
    text("última hora en que se alimentó : "+time +" AM", 300,30);
  }
}
