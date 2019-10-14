
(function(){
    'use strict';
    window.addEventListener('load',init,false);
    var KEY_ENTER=13;
    var KEY_SPACE=32;
    var KEY_LEFT=37;
    var KEY_UP=38;
    var KEY_RIGHT=39;
    var KEY_DOWN=40;

    var canvas=null,ctx=null;
    var lastPress=null;
    var pressing=[];
    var pause;
    var player=new Rectangle(90,280,10,10);
    var shots=[];

    function init(){
        canvas=document.getElementById('canvas');
        ctx=canvas.getContext('2d');
        canvas.width=200;
        canvas.height=300;
        
        run();
        repaint();
    }

    function run(){
        setTimeout(run,50);
        act();
    }

    function repaint(){
        requestAnimationFrame(repaint);
        paint(ctx);
    }

    function act(){
        if(!pause){
            // Move Rect
            //if(pressing[KEY_UP])
            //    player.y-=10;
            if(pressing[KEY_RIGHT])
                player.x+=10;
            //if(pressing[KEY_DOWN])
            //    player.y+=10;
            if(pressing[KEY_LEFT])
                player.x-=10;

            // Out Screen
            if(player.x>canvas.width-player.width)
                player.x=canvas.width-player.width;
            if(player.x<0)
                player.x=0;
            
            // New Shot
            if(lastPress==KEY_SPACE){
                shots.push(new Rectangle(player.x+3,player.y,5,5));
                lastPress=null;
            }
            
            // Move Shots
            for(var i=0,l=shots.length;i<l;i++){
                shots[i].y-=10;
                if(shots[i].y<0){
                    shots.splice(i--,1);
                    l--;
                }
            }
        }
        // Pause/Unpause
        if(lastPress==KEY_ENTER){
            pause=!pause;
            lastPress=null;
        }
    }

    function paint(ctx){
        ctx.fillStyle='#000';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        ctx.fillStyle='#0f0';
        player.fill(ctx);
        ctx.fillStyle='#f00';
        for(var i=0,l=shots.length;i<l;i++)
            shots[i].fill(ctx);
        
        ctx.fillStyle='#fff';
        ctx.fillText('Last Press: '+lastPress,0,20);
        ctx.fillText('Shots: '+shots.length,0,30);
        if(pause){
            ctx.textAlign='center';
            ctx.fillText('PAUSE',100,150);
            ctx.textAlign='left';
        }
    }

    document.addEventListener('keydown',function(evt){
        lastPress=evt.keyCode;
        pressing[evt.keyCode]=true;
        
        if(lastPress==32||lastPress>=37&&lastPress<=40)
            evt.preventDefault();
    },false);

    document.addEventListener('keyup',function(evt){
        pressing[evt.keyCode]=false;
    },false);

    function Rectangle(x,y,width,height){
        this.x=(x==null)?0:x;
        this.y=(y==null)?0:y;
        this.width=(width==null)?0:width;
        this.height=(height==null)?this.width:height;
    }

    Rectangle.prototype.intersects=function(rect){
        if(rect!=null){
            return(this.x<rect.x+rect.width&&
                this.x+this.width>rect.x&&
                this.y<rect.y+rect.height&&
                this.y+this.height>rect.y);
        }
    }
    
    Rectangle.prototype.fill=function(ctx){
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,17);};
    })();
})();