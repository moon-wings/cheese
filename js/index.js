$(function(){
	var canvasS=600;
	var row = 15;
	var blockS = canvasS/row;
	var ctx = $('#canvas').get(0).getContext('2d');
	$('#canvas').get(0).width = canvasS;
	$('#canvas').get(0).height = canvasS;
	var starRadius = 5;
	var qiziRadius = blockS/2*0.7;

// 棋盘
	ctx.save();
	var draw = function(){
		ctx.save();
		ctx.clearRect(0,0,600,600);
		var img = new Image();
		img.src = '../cheese/img/desk2.jpg';
		$(img).on('load',function(){
			ctx.save();
		    ctx.clearRect(0,0,600,600);
			var imgs = ctx.createPattern(img,'no-repeat');
			ctx.fillStyle = imgs;
			ctx.fillRect(0,0,600,600);
			ctx.strokeRect(10,10,580,580);
			ctx.strokeStyle = '#290700';
			ctx.restore();

		    // 横线
			ctx.save();
			ctx.beginPath();
			ctx.translate(blockS/2+0.5,blockS/2+0.5);
			var lineWidth = canvasS - blockS
			for(var i = 0; i< row ; i++){
			    ctx.moveTo(0,0);
			    ctx.lineTo(lineWidth,0);
				ctx.translate(0,blockS);
			}
			
			ctx.stroke()
			ctx.closePath();
			ctx.restore();

			// 纵线
			ctx.save();
			ctx.beginPath();
			ctx.translate(blockS/2+0.5,blockS/2+0.5);
			// var lineWidth = canvasS - blockS
			for(var i = 0; i< row ; i++){
			    ctx.moveTo(0,0);
			    ctx.lineTo(0,lineWidth);
				ctx.translate(blockS,0);
			}
			ctx.stroke()
			ctx.closePath();
			ctx.restore();

			// 基点
			var points = function(x,y){
				ctx.save();
				ctx.beginPath();
				ctx.translate(x*blockS+0.5,y*blockS+0.5);
				ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
				ctx.fillStyle ='#000';
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
			points(3.5,3.5)
			points(3.5,11.5)
			points(11.5,3.5)
			points(11.5,11.5)
			points(7.5,7.5)

		})
	
	}


// 绘棋
	var drop = function(qizi){
		// qizi.x
		// qizi.y
		// qizi.color
		ctx.save();
		ctx.beginPath();
		ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
		ctx.arc(0,0,qiziRadius,0,(Math.PI/180)*360);
		if( qizi.color === 1 ){
			ctx.fillStyle ='black';
			$('#black').get(0).play();
		}else{
			ctx.fillStyle = 'white';
			ctx.strokeStyle = '#8d8c8c';
			ctx.stroke();
			$('#white').get(0).play();
		}
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
  ctx.restore();

// 输赢  x y   x y-1 / x y-2 / x y-3 / x y-4     x-1 y / x-2 y ...
  	
	var judge = function(qizi){
		var shuju = {};
		$.each(Allqizi,function(k,v){
			if(v.color===qizi.color){
				shuju[k]=v
			}
		})

		var shu = 1 , hang = 1 , zuoxie = 1 , youxie = 1;
		var tx,ty;

		// 横
		tx = qizi.x; ty = qizi.y;
		while(shuju [ tx +'-'+ (ty+1) ] ){
			shu ++ ; ty++;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju [ tx +'-'+ (ty-1)]){
			shu ++; ty--;
		}

		// 横
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx+1 ) +'-'+ ty ] ){
			hang ++ ; tx++;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx-1 ) +'-'+ ty]){
			hang ++; tx--;
		}

		// 左斜
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx-1 ) +'-'+ (ty-1) ]){
			zuoxie ++; tx--; ty--;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx+1 ) +'-'+ (ty+1) ]){
			zuoxie ++; tx++; ty++;
		}

		// 右斜
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx+1 ) +'-'+ (ty-1) ]){
			youxie ++; tx++; ty--;
		}
		tx = qizi.x; ty = qizi.y;
		while(shuju [ ( tx-1 ) +'-'+ (ty+1) ]){
			youxie ++; tx--; ty++;
		}

		if(shu >= 5 || hang >= 5 || zuoxie >= 5 || youxie >= 5){
			return true;
		}

	} 



// 落子
	var kaiguan = true;
	var step = 1;
	var Allqizi =  {}           //字典思想  字符串-键  
	$('#canvas').on('click',function(e){
		var x = Math.floor(e.offsetX/blockS);
		var y = Math.floor(e.offsetY/blockS);
		if(Allqizi[x+'-'+y]){
			return;
		}
		if(kaiguan){
			var qizi = {x:x,y:y,color:1,step:step};
			drop(qizi);
			if(judge(qizi)){
				$('.cartel').show().find('#tishi').text('黑棋胜')
			}
			kaiguan = false;
		}else{
			var qizi = {x:x,y:y,color:0,step:step};
			drop(qizi);
			if(judge(qizi)){
				$('.cartel').show().find('#tishi').text('白棋胜');
			}
			kaiguan = true;
		}
		step += 1
		Allqizi[x+'-'+y] = qizi;
	})
	

	
	$('.tips').on('click',false);
	$('#close').on('click',function(){
		$('.cartel').hide();
	})
	$('.cartel').on('click',function(){
		$(this).hide();
	})

	$('#restart').on('click',function(){
		ctx.clearRect(0,0,600,600);
		$('.cartel').hide();
		kaiguan = true;
		Allqizi = {};
		step = 1;
		draw();
	})

	 $('#qipu').on('click',function(){
	    $('.cartel').hide();
	    $('#save').show();
	    ctx.save();
	    ctx.font = "20px consolas";
	    for( var i in Allqizi){
	      if( Allqizi[i].color === 1){
	          ctx.fillStyle = '#fff';
	      }else{
	        ctx.fillStyle = 'black';
	      }
	      ctx.textAlign = 'center';
	      ctx.textBaseline = 'middle';

	      ctx.fillText(Allqizi[i].step,
	        (Allqizi[i].x+0.5)*blockS,
	        (Allqizi[i].y+0.5)*blockS);
	    }
	    ctx.restore();
	    var image = $('#canvas').get(0).toDataURL('img/jpg',1);
	    $('#save').attr('href',image);
	    $('#save').attr('download','qipu.png');

	})


	draw();

})