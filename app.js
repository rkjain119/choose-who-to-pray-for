/**
    POLYFILL, CHROME DOESNT APPLY STANDARDS
*/
if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}

/**
    STEPS MANAGER
*/
var Steps = {
    INDEX : 0,
    STEPS : document.getElementsByClassName('step'),

    init : function(){
        this.STEPS[0].classList.add('step--showing');
    },

    goTo : function(){
        document.getElementsByClassName('step--showing')[0].classList.remove('step--showing');
        this.STEPS[ this.INDEX ].classList.add('step--showing');
    },

    prev : function(){
        if( this.INDEX - 1 >= 0 ){
            this.INDEX--;
        }

        this.goTo( this.INDEX );
    },

    next : function(){
        if( this.INDEX + 1 <= this.STEPS.length ){
            this.INDEX++;
        }

        this.goTo( this.INDEX );
    },

    current : function(){
        return this.STEPS[ this.INDEX ];
    }
};
Steps.init();

/**
    LOAD PROFILE PICUTRE
*/
var $Uploader = document.querySelector('input');
    $Uploader.addEventListener('change', function(){
            App.PROFILE_IMG = new Image();
            App.PROFILE_IMG.src = window.URL.createObjectURL(this.files[0]);
            App.PROFILE_IMG.onload = function() {
                window.URL.revokeObjectURL(this.src);
                Steps.next();
            };
    }, false);

/**
    SELECT FLAG
*/
var $Select = document.querySelector('select'),
    $Submit = document.getElementsByClassName('step__finish')[0];
    $Submit.addEventListener('click', function(){
            App.FLAG_IMG = new Image();
            App.FLAG_IMG.src = 'flags/' + $Select.value + '.svg';
            App.FLAG_IMG.onload = function(){
                Steps.next();
                App.draw( Steps.current() );
            };
    }, false);

/**
    App
*/
var App = {
    PROFILE_IMG : null,
    FLAG_IMG : null,

    draw : function( container ){
        var $Canvas = document.createElement('canvas'),

            flagWidth = this.FLAG_IMG.width,
            flagHeight = this.FLAG_IMG.height,

            profileWidth = this.PROFILE_IMG.width,
            profileHeight = this.PROFILE_IMG.height,

            flagRatio = (flagHeight / flagWidth),
            profileRatio = (profileHeight / profileWidth),
            bgX, bgY;

        if (profileRatio > flagRatio){
            finalHeight = profileHeight;
            finalWidth = (profileHeight / flagRatio);
        }else{
            finalWidth = profileWidth;
            finalHeight = (profileWidth / flagRatio);
        }

        $Canvas.width = profileWidth;
        $Canvas.height = profileHeight;

        var ctx = $Canvas.getContext('2d');
            ctx.drawImage(this.PROFILE_IMG, 0,0);

        bgX = Math.abs((finalWidth - profileWidth) / 2) * -1;
        bgY = Math.abs((finalHeight - profileHeight) / 2) * -1;

        ctx.globalAlpha = 0.45;
        ctx.drawImage( this.FLAG_IMG, bgX, bgY, finalWidth, finalHeight );

        $Canvas.toBlob(function( blob ){
            var a = document.createElement('a');
                a.className = 'button';
        		a.href = window.URL.createObjectURL(blob);
        		a.download = 'image.png';
        		a.text = 'Download image';

        	container.appendChild(a);
        });
    }
};
