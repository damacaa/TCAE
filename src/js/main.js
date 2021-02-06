var CustomPipeline = new Phaser.Class({

    Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,

    initialize:
        //https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5
        //https://labs.phaser.io/edit.html?src=src\camera\camera%20blur%20shader.js
        function CustomPipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
                game: game,
                renderer: game.renderer,
                fragShader:
                    `precision mediump float;

                //"in" attributes from our vertex shader
                varying vec4 outColor;
                varying vec2 outTexCoord;

                //declare uniforms
                uniform sampler2D u_texture;
                uniform float resolution;
                uniform float radius;

                void main() {
                    //this will be our RGBA sum
                    vec4 sum = vec4(0.0);

                    //our original texcoord for this fragment
                    vec2 tc = outTexCoord;

                    //the amount to blur, i.e. how far off center to sample from 
                    //1.0 -> blur by one pixel
                    //2.0 -> blur by two pixels, etc.
                    float blur = radius / resolution;

                    bool hasLight = false;

                    vec4 neighbour;
                    vec4 minNeighbour;

                    float dist;
                    float minDist = 10.0;

                    for(int i=-4;i<=4;i++) {
                        for(int j=-4;j<=4;j++) {
                            
                            neighbour = vec4(texture2D(u_texture, vec2(tc.x + float(i) * blur , tc.y + float(j) * blur )).rgb,1.0);

                            if(neighbour.r > 0.92 && neighbour.g > 0.92 && neighbour.b > 0.71){

                                    dist = sqrt(float((i*i)+(j*j)));

                                    if(dist<minDist){
                                        minDist = dist;
                                        minNeighbour=neighbour;
                                    }
                                    hasLight = true;
                            }
                        }
                    }

                    vec4 col = texture2D(u_texture, vec2(tc.x, tc.y));

                    if(hasLight){

                        float attenuation = 1.0 / (1.0 + (1.5*minDist*minDist));
                        float remaining = 1.0-attenuation;

                        col *= remaining;

                        col += minNeighbour * attenuation;
                    }

                    //col = vec4(1);
                    
                    vec2 distToCenter = vec2(tc.x-0.5, tc.y-0.5);
                    float fDistToCenter = sqrt((distToCenter.x * distToCenter.x) + (distToCenter.y * distToCenter.y));

                    float fade = (1.0 / (0.7 + (5.0*fDistToCenter*fDistToCenter)));

                    col = col * fade;

                    
                    /*//1 bit
                    float threshold = 0.175;
                    if((col.r+col.g+col.b)/3.0>threshold){
                        gl_FragColor = vec4(1.0);
                    }else{
                        gl_FragColor = vec4(0.0, 0.0 ,0.0, 1.0);
                    }*/

                    //b&w
                    //gl_FragColor = vec4(vec3((0.5*col.r+col.g+1.5*col.b)/3.0), 1.0);

                    gl_FragColor = vec4(col.rgb, 1.0);
            }
            `
            });
        }
});

var config;
var game;
var customPipeline;

window.onload = function () {
    config = {
        type: Phaser.WEBGL,
        pixelArt: true,
        roundPixels: false,
        scale: {
            mode: Phaser.Scale.FIT,// Phaser.Scale.FIT || Phaser.Scale.RESIZE
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 480,
            height: 270,
        },
        input: {
            gamepad: true
        },
        physics: {
            default: 'arcade',

            arcade: {
                gravity: { y: 981 },
                //debug: true
            }
        }, fps: {
            target: 30,
            forceSetTimeOut: true
        },
        scene: [Preload, MainMenu, BaseScene, UI]
    }

    loadFont("m3x6", "resources/fonts/m3x6.ttf");

    game = new Phaser.Game(config);

    customPipeline = game.renderer.addPipeline('Custom', new CustomPipeline(game));
    customPipeline.setFloat1('resolution', game.config.width);
    customPipeline.setFloat1('radius', 1.0);
}

//https://stackoverflow.com/questions/51217147/how-to-use-a-local-font-in-phaser-3
function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

