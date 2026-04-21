var Render = {


  //---------------------------------------------------------------------------

  segment: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color) {

    var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;
    
    ///COMMENT IF YOU DON'T WANT SHOWN GRASS
    ctx.graphics.beginFill(color.grass);
    ctx.graphics.drawRect(START_X_ROTATION_VIEW, y2, width, y1 - y2);
    ////////////////
    
    Render.simplePolygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    Render.simplePolygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    Render.simplePolygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road);
    
    if (color.lane) {
        lanew1 = w1*2/lanes;
        lanew2 = w2*2/lanes;
        lanex1 = x1 - w1 + lanew1;
        lanex2 = x2 - w2 + lanew2;
        for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
          //Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
              Render.simplePolygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
    
  },

  simplePolygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {

    ctx.graphics.beginFill(color);
    //if(bGradient)

    //ctx.graphics.beginLinearGradientFill(["#000","#044f92", "#000"], [0.1, 0.5, 0.9], x1, y1, x2, y2);
    ctx.graphics.moveTo(x1, y1);
    ctx.graphics.lineTo(x2, y2);
    ctx.graphics.lineTo(x3, y3);
    ctx.graphics.lineTo(x4, y4);

  },

   polygon: function(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {

    //ctx.graphics.beginFill(color);
    //if(bGradient)

    //ctx.graphics.beginLinearGradientFill(["#000","#044f92", "#000"], [0.1, 0.5, 0.9], x1, y1, x2, y2);
    ctx.graphics.moveTo(x1, y1);
    ctx.graphics.lineTo(x2, y2);
    ctx.graphics.lineTo(x3, y3);
    ctx.graphics.lineTo(x4, y4);
    
    //ctx.graphics.beginFill(color);

    //console.log("x1:"+x1+" x2:"+x2 + " x3:"+x3 + " x4:"+x4)

  },

  simpleSegment: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color, oSprite) {

    //var r1 = Render.rumbleWidth(w1, lanes),
        //r2 = Render.rumbleWidth(w2, lanes);
        //l1 = Render.laneMarkerWidth(w1, lanes),
        //l2 = Render.laneMarkerWidth(w2, lanes),
        //lanew1, lanew2, lanex1, lanex2, lane;
    
    
    ///COMMENT IF YOU DON'T WANT SHOWN GRASS
    //ctx.graphics.beginFill(color.grass);
    //ctx.graphics.drawRect(START_X_ROTATION_VIEW, y2, width, y1 - y2);
    ////////////////
    
    //Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
    //Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
    Render.polygon(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2/*, color.road*/);
    
    ///COMMENT IF YOU DON'T WANT SHOWN LANE
    /*
    if (color.lane) {
        console.log("aaa")
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
    */
   
    //Render.polySprite(ctx, x1-w1,    y1, x1+w1, y1, x2+w2, y2, x2-w2,    y2, color.road, oSprite);
    
  },

    grass: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color) {

        //ctx.graphics.beginFill(color.grass);
        ctx.graphics.drawRect(START_X_ROTATION_VIEW, y2, width, y1 - y2);
        
        
  },

    rumble: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color) {
        
        
        var r1 = Render.rumbleWidth(w1*2, lanes),
            r2 = Render.rumbleWidth(w2*2, lanes);

            //ctx, x1, y1, x2, y2, x3, y3, x4, y4
            
            var px1 = x1-w1-r1;
            var py1 = y1;
            var px2 = x1+w1;
            var py2 = y1;
            var px3 = x2+w2;
            var py3 = y2;
            var px4 = x2-w2-r2;
            var py4 = y2;

            ctx.graphics.moveTo(px1, py1);
            ctx.graphics.lineTo(px2, py2);
            ctx.graphics.moveTo(px3, py3);
            ctx.graphics.lineTo(px4, py4);

        //Render.polygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2/*, color.rumble*/);
        //Render.polygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2/*, color.rumble*/);
        Render.simplePolygon(ctx, x1-w1-r1, y1, x1-w1, y1, x2-w2, y2, x2-w2-r2, y2, color.rumble);
        Render.simplePolygon(ctx, x1+w1+r1, y1, x1+w1, y1, x2+w2, y2, x2+w2+r2, y2, color.rumble);
        
        /*
        var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;
        
        
        if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2, color.lane);
    }
        */
  },

    centralLane: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color) {

        var r1 = Render.rumbleWidth(w1, lanes),
        r2 = Render.rumbleWidth(w2, lanes),
        l1 = Render.laneMarkerWidth(w1, lanes),
        l2 = Render.laneMarkerWidth(w2, lanes),
        lanew1, lanew2, lanex1, lanex2, lane;
        
        
        if (color.lane) {
      lanew1 = w1*2/lanes;
      lanew2 = w2*2/lanes;
      lanex1 = x1 - w1 + lanew1;
      lanex2 = x2 - w2 + lanew2;
      for(lane = 1 ; lane < lanes ; lanex1 += lanew1, lanex2 += lanew2, lane++)
        Render.polygon(ctx, lanex1 - l1/2, y1, lanex1 + l1/2, y1, lanex2 + l2/2, y2, lanex2 - l2/2, y2/*, color.lane*/);
    }

  },

  stroke: function(ctx, width, lanes, x1, y1, w1, x2, y2, w2, color) {

        //var r1 = Render.rumbleWidth(w1, lanes);
        //var r2 = Render.rumbleWidth(w2, lanes);

            //var px1 = x1-w1-r1;
            //var py1 = y1;
            var px2 = x1-w1;
            var py2 = y1;
            var px3 = x2-w2;
            var py3 = y2;
            //var px4 = x2-w2-r2;
            //var py4 = y2;

            ctx.graphics.moveTo(px2, py2);
            ctx.graphics.lineTo(px3, py3);
            //ctx.graphics.moveTo(px4, py4);     
            //ctx.graphics.lineTo(px1, py1);
            
            
            //px1 = x1+w1+r1;
            px2 = x1+w1;
            px3 = x2+w2;
            //px4 = x2+w2+r2;
            
            ctx.graphics.moveTo(px2, py2);
            ctx.graphics.lineTo(px3, py3);
            //ctx.graphics.moveTo(px4, py4);     
            //ctx.graphics.lineTo(px1, py1);

  },  


  //---------------------------------------------------------------------------

  background: function(ctx, background, width, height, layer, rotation, offset) {

    rotation = rotation || 0;
    offset   = offset   || 0;

    var imageW = layer.w/2;
    var imageH = layer.h;

    var sourceX = layer.x + Math.floor(layer.w * rotation);
    var sourceY = layer.y
    var sourceW = Math.min(imageW, layer.x+layer.w-sourceX);
    var sourceH = imageH;
    
    var destX = 0;
    var destY = offset;
    var destW = Math.floor(width * (sourceW/imageW));
    var destH = height;

    ctx.drawImage(background, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH);
    if (sourceW < imageW)
      ctx.drawImage(background, layer.x, sourceY, imageW-sourceW, sourceH, destW-1, destY, width-destW, destH);
  },

    
  //---------------------------------------------------------------------------   
  sprite: function(sprite, sprites, scale, destX, destY, offsetX, offsetY, clipY) {

        //var iProportion =  scale * ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH_ANIMATED;
        
        //  scale for projection AND relative to roadWidth (for tweakUI)
        var destW  = (sprite.width * scale);
        var destH  = (sprite.height * scale);


        destY = destY + (destH * (offsetY || 0));

        var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
        if (clipH < destH){
            
            destX = destX + (destW * (offsetX || 0));
            
            sprites.x = destX;
            sprites.y = destY;

            var iScale = (destH/sprite.height);
            sprites.scaleX = sprites.scaleY = iScale;
            
            var iClipHeight = sprite.height - (sprite.height*clipH/destH);

            var oRect = new createjs.Rectangle(0,0,sprite.width,iClipHeight);
            sprites.sourceRect = oRect;
            
        } else {
            sprites.visible = false;
        }
  },  

    spriteWithMask: function(spriteBounds, sprites, scale, destX, destY, offsetX, offsetY, clipY, oMask) {
        //var iProportion =  scale * ROAD_PER_SCALE_PER_HALF_CANVAS_WIDTH;
        
        //  scale for projection AND relative to roadWidth (for tweakUI)
        var destW  = (spriteBounds.width * scale);
        var destH  = (spriteBounds.height * scale);

        destY = destY + (destH * (offsetY || 0));


        var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
        if (clipH < destH){

            destX = destX + (destW * (offsetX || 0));
            sprites.x = destX;
            sprites.y = destY;


            var iScale = (destH/spriteBounds.height);            
            sprites.scaleX = sprites.scaleY = iScale;
            
            //var iClipHeight = sprite.height - (sprite.height*clipH/destH);
            
            //OPTIMIZATION:
            //oMask.scaleY = iClipHeight/sprite.height ---> 1-clipH/destH 

            oMask.scaleY = (1-clipH/destH);
            
            //console.log(scale)
            
        } else {

            sprites.visible = false;
        }
  },  
   
  //---------------------------------------------------------------------------


  rumbleWidth:     function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(6,  2*lanes); },
  laneMarkerWidth: function(projectedRoadWidth, lanes) { return projectedRoadWidth/Math.max(32, 8*lanes); }

}
