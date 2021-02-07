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

                uniform sampler2D uMainSampler;
                    
                varying vec2 outTexCoord;
                varying float outTintEffect;
                varying vec4 outTint;

                uniform vec3 cA;
                    
                    void main(void) 
                    {
                      vec4 texture = texture2D(uMainSampler, outTexCoord);
                      vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
                      vec4 color = texture;
                    
                      if (outTintEffect == 0.0)
                      {
                        color = texture * texel;
                      }
                      else if (outTintEffect == 1.0)
                      {
                        color.rgb = mix(texture.rgb, outTint.rgb * outTint.a, texture.a);
                        color.a = texture.a * texel.a;
                      }
                      else if (outTintEffect == 2.0)
                      {
                        color = texel;
                      }

                      gl_FragColor = vec4(color.rgb * cA,1.0);
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
    //customPipeline.setFloat3('cA',1.0, 0.5, 0.4);
    customPipeline.setFloat3('cA', 1.0, 1.0, 1.0);
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

