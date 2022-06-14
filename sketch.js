// Geniuses conversations
// Author: Maria Lopez Lira, april 2022
// Based on: https://learn.gold.ac.uk/mod/url/view.php?id=1081742&redirect=1
// For those times when we wonder what would happen if two geniuses that didn't meet had a conversation.  This is a simulation of such conversation between William Shakespeare and Miguel de Cervantes.  I am curious because these two classical writers almost died in the exact same day, they lived so close but never met.  They probably had little in common other than their vivid imagination and elaborate language.
// This code emulates a conversation between two writers, using a text generation model from ml5 (charRNN).
// The user needs to set the first input in the textbox and press the Start button.
// Then press the Next button for every subsequent sentence.  The reset button will set the conversation back to the first input.
// The code takes the previous generated text as seed to continue the conversation.
// The user can choose the length and the temperature of each sentence.


// variables
let charRNN1, charRNN2,
    textInput,
    tempSlider,
    lengthSlider,
    startBtn,
    resetBtn,
    singleBtn,
    generating = false,
    generated_text = "",
    generated_text_darwin = "",
    generated_text_shakes = "",
    img1, img2,
    SIZE = 100,
    prediction_text = "",
    state = 0;

function setup() {
  createCanvas(800, 500);
  
    canvasLeft = createGraphics(400, 500);
    canvasRight = createGraphics(800, 500);
    
    img1 = loadImage("images/darwin.jpeg");
    img2 = loadImage("images/shakespeare.jpeg");
    img1.resize(SIZE, SIZE);
    img2.resize(SIZE, SIZE);
    
  // Create the LSTM Generator passing it the model directory
    charRNN1 = ml5.charRNN('./models/darwin/', modelReady);
    charRNN2 = ml5.charRNN('./models/shakespeare/', modelReady);
  
  // Grab the DOM elements
  textInput = select('#textInput');
    lengthSlider = select('#lenSlider');
  tempSlider = select('#tempSlider');
  startBtn = select('#start');
  resetBtn = select('#reset');
  //singleBtn = select('#single');

  // DOM element events
  startBtn.mousePressed(generate);
  resetBtn.mousePressed(resetModel);
  //singleBtn.mousePressed(predict);
  tempSlider.input(updateSliders);
    lengthSlider.input(updateSliders);
}

function draw() {
    canvasLeft.background(255, 0, 0);
    canvasRight.background(0);
    canvasLeft.fill(255);
    canvasRight.fill(255);
    canvasLeft.textSize(16);
    canvasRight.textSize(16);
    canvasLeft.image(img1, 0, 0, SIZE, SIZE);
    canvasRight.image(img2, 0, 0, SIZE, SIZE);
    
    canvasLeft.text(generated_text_darwin, 10, 110, width/2 - 10, height/2 - 10);
    canvasRight.text(generated_text_shakes, 10, 110, width/2 - 10, height/2 - 10);
    
    image(canvasLeft, 0, 0, width/2, height);
    image(canvasRight, width/2, 0, width, height);

    console.log("done");
    
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

// Update the slider values
function updateSliders() {
    select('#temperature').html(tempSlider.value());
    select('#length').html(lengthSlider.value());
}


async function modelReady() {
  select('#status').html('Models Loaded');
  resetModel();
}

function resetModel() {
    charRNN1.reset();
    charRNN2.reset();
    const seed = select('#textInput').value();
    charRNN1.feed(seed);
    charRNN2.feed(seed);
    generated_text_darwin = seed;
    generated_text_shakes = seed;
}

function generate() {
  if (generating) {
    generating = false;
    //startBtn.html('Start');
  } else {
    generating = true;
    //startBtn.html('Pause');
      
      
    let original = textInput.value();
    let txt = original.toLowerCase();
    if ((txt.length > 0) && (status == 0)) {
        //generated_text = txt;
        let data = {
            seed: txt,
            temperature: tempSlider.value(),
            length: lengthSlider.value()
        };
        
        charRNN1.generate(data, gotData);
        startBtn.html('Next');
        textInput.hide();
        status = 1;
        
    } // if text box is not empty (first time)
      else {
        //generated_text = "I am the previous data";
        if (state == 1) {    // if Darwin
            let data = {
                seed: generated_text_shakes,
                temperature: tempSlider.value(),
                length: lengthSlider.value()
            };
          
            charRNN1.generate(data, gotData);
            
        } // if Darwin
          else {  // else if shakespeare
            let data = {
                seed: generated_text_darwin,
                temperature: tempSlider.value(),
                length: lengthSlider.value()
            };
          
            charRNN2.generate(data, gotData2);
            
        } // else if shakespeare
 
      } // else (not first time)
      
  } // else (generating)
}
    
    
// Update the DOM elements with typed and generated text
function gotData(err, result) {
  select('#status').html('Ready!');
  generated_text_darwin = result.sample;
    state = 2;
  generating = false;
}

function gotData2(err, result) {
  select('#status').html('Ready!');
  generated_text_shakes = result.sample;
    state = 1;
  generating = false;
}
    
