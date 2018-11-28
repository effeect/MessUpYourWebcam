var camera;
var boxWidth = 10;
var boxHeight = 10;
var binning = true;

var textvalue = "hello"; //Default Value for the text mode
var textinput, button;



function setup() {
    //P5JS related functions
    pixelDensity(1);
    camera = createCapture(VIDEO); 
    camera.hide();
    createCanvas(1920,1080);
    noStroke();
    //---HUD---//
    //Slider to change bitrate
    modeslider = createSlider(0,2,0)
    modeslider.position(320, 500);
    modeslider.style('width','100px')
    //Slide to change box values
    boxslider = createSlider(5,50,10) //Box Slider has been set to a minimum of 5 and max of 50, if set lower it will crash.
    boxslider.position(20,500)
    boxslider.style('width','200px')
    //Slide to change shapes
    shapeslider = createSlider(0,2,0)
    shapeslider.position(20,600)
    shapeslider.style('width','100px')
    //Input for Text Mode
    textinput = createInput();
    textinput.position(250,600)
    button = createButton("Submit");
    button.position(textinput.x + textinput.width, 600)
    button.mousePressed(submit) //Created a function called submit, it can be found at the bottom
}



function draw() {       
    background(0);
    camera.loadPixels(); //Updates the camera to keep the motion smooth, although the framerate will drop
    //SLIDER//
    var modevalue = modeslider.value() //Value of the slider, it goes from 0 to 2, resulting in three possible modes.
    var boxvalue = boxslider.value()
    var shapevalue = shapeslider.value()
    //TEXT AND MODE VALUES//
    textSize(20);
    fill(255)
    //Color Mode//
    text("Color Modes",315,545)
    //These if statements change the text below the color mode//
    if(modevalue == 0)
        {
            text("Original",315,570)
        }
    if(modevalue == 1)
        {
            text("8-bit",315,570)
        }
    if(modevalue == 2)
        {
            text("4-bit",315,570)
        }
    //Box Values//
    text("Size Value : " + boxvalue ,20,540)
    fill(255)
    boxHeight = boxvalue
    boxWidth = boxvalue
    //Shape Values//
    text("Shape : ",20,640)
    if(shapevalue == 0)
        {
            text("Rectangle",20,680)
        }
    if(shapevalue == 1)
        {
            text("Circle",20,680)
        }
    if(shapevalue == 2)
        {
            text("Text Mode",20,680)
        }
    //Text Values//
    text("Text (Select Text Mode from Shape Slider)",250,640)
    fill(255)     

    //CAMERA//
    var total = boxWidth * boxHeight; 

    for (var x = 0; x < camera.width; x += boxWidth)
    {
        for (var y = 0; y < camera.height; y += boxHeight) 
        {
            var red = 0; var green = 0; var blue = 0;
            if(binning) { //Pixel Binning Method//
                for(var i = 0; i < boxWidth; i++)
                    {
                        for(var j = 0; j < boxHeight; j++)
                            {
                                var index = ((x + i) + ((y + j) * camera.width))*4;
                                red += camera.pixels[index + 0];
                                green += camera.pixels[index + 1];
                                blue += camera.pixels[index + 2];
                                
                            }
                    }
                if(modevalue == 0) //Original;
                    {
                        fill(color(red/total,green/total,blue/total))        
                    }
                if(modevalue == 1)//8 bit color
                    {
                        fill(replace8bit(color(red/total,green/total,blue/total)))        
                    }
                if(modevalue == 2)//4 Bit color
                    {
                        fill(replace4bit(color(red/total,green/total,blue/total)))
                    }
            }
            
            //SHAPE CHANGING//
            if(shapevalue == 0) //SQUARES MODE
                {
                    rect(x, y, boxWidth, boxHeight);
                }
            if(shapevalue == 1) //CIRCLES MODE
                {
                    ellipse(x, y, boxWidth, boxHeight);
                }
            if(shapevalue == 2) //TEXT MODE
                {
                    textSize(boxvalue)
                    text(textvalue,x,y);
                }
        }
    }
    }

function replace8bit(c)
{
    var r = int(red(c) / (255/8)) * (255/8)
    var g = int(green(c) / (255/8)) * (255/8)
    var b = int(blue(c) / (255/8)) * (255/8)
    
    c = color(r,g,b)
    return c
}

function replace4bit(c)
{
    colors = [color("#000000"), //black
    color("#555555"), // gray
    color("#0000AA"), // blue
    color("#5555FF"), // light blue
    color("#00AA00"), // green
    color("#55FF55"), // light green
    color("#00AAAA"), // cyan
    color("#55FFFF"), // light cyan
    color("#AA0000"), // red
    color("#FF5555"), // light red
    color("#AA00AA"), // magenta
    color("#FF55FF"), // light magenta
    color("#AA5500"), // brown // #AA5500
    color("#FFFF55"), // yellow
    color("#AAAAAA"), // light gray
    color("#FFFFFF") // white (high intensity)
    ];
    
    //These values are the input of the users webcam in colors.//
    var r1 = int(red(c))
    var g1 = int(green(c))
    var b1 = int(blue(c))
    
    //These values are to store and return the values.//
    var r;
    var g;
    var b; 
    
    var minDist = 1000 ; //set to default large value
    
    for(var i = 0; i < colors.length; i++)
        {
            r2 = red(colors[i])
            g2 = green(colors[i])
            b2 = blue(colors[i])
            
            d = sqrt( ( (r2-r1)^2)*0.30 + ( (g2-g1)^2)*0.59 + ( (b2-b1)^2)*0.11) //Method to calculate distance between colors//
            
            if(d < minDist)
                {
                    minDist = d //Replaces minDist with the lowest possible distance
                    r = red(colors[i])
                    g = green(colors[i])
                    b = blue(colors[i])   
                }
        }
    c = color(r,g,b)
    return c
}

function submit() //This function submits the text for the text mode feature
{
    textvalue = textinput.value()
}
