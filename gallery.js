//通用函数
function g (selector){
	var method = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';
	return document[method](selector.substr(1));
}

//随机数生成
function random( range ){
	var max = Math.max( range[0],range[1] );
	var min = Math.min( range[0],range[1] );
	var diff = max - min;
	var number = Math.random()*diff + min;
	return Math.ceil(number);
}


//翻面控制函数
function turn(elem) {
	var cls = elem.className;
	var n = elem.id.split('_')[1];

	if ( !/photo_center/.test(cls) ){
		return rsort(n);
	}

	if (/photo_front/.test( cls )) {
		cls = cls.replace(/photo_front/,'photo_back');
		g('#nav_'+n).className += ' i_back ';
	}else{
		cls = cls.replace(/photo_back/,'photo_front');
		g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
	}
	return elem.className = cls;
}//需要优化

//输出所有的海报
function addPhotos(){
	var template = g('#wrap').innerHTML;
	var html = [];

	var nav = [];
	for( var s in data){
		var _html = template.replace('{{index}}',s)
							.replace('{{img}}',data[s].img)
							.replace('{{caption}}',data[s].caption)
							.replace('{{desc}}',data[s].desc);
		html.push(_html);

		nav.push('<span id="nav_'+s+'" onclick="turn( g(\'#photo_'
			+s+'\') )" class="i">&nbsp;</span>');
	}
	html.push('<div class="nav">'+nav.join('')+'</div>');

	g('#wrap').innerHTML = html.join('');
	rsort(random([0,data.length-1]));
}	
addPhotos();
//哪些海报需要添加photo_center标签
//随意点击的一个海报
//控制按钮对应的海报
//第一次排序、随机取一个海报
function rsort( n ){
	//js开发约定，如果一个变量不常用，会以_开头，表示临时变量
	var _photo = g('.photo');
	var photos = [];

	for(let s = 0;s < _photo.length;s++){
		_photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
		_photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ')

		_photo[s].style.top = '';
		_photo[s].style.left = '';
		_photo[s].style.transform = 'rotate(360deg) scale(1.1)';
		
		photos.push(_photo[s]);
	}

	var photo_center = g('#photo_'+n);
	photo_center.className += ' photo_center';

	photo_center = photos.splice(n,1)[0];


	for( let s in photos){
	   var photo = photos[s];
	   var ang = random([0,360])
	   var avg = ang*2*Math.PI/360;
	   var ang = -ang; //用于控制旋转的方向
	   photo.style['transform'] = 'translate('+500*Math.sin(avg)+'px,'
	   +400*Math.cos(avg)+'px) rotate('+ang+'deg) scale(0.8)';
	    // 400 为半径值;
	}

	//控制按钮处理
	var navs = g('.i');
	for(let s =0;s<navs.length;s++){
		navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
		navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
	}
	g('#nav_'+n).className += ' i_current ';
}

//计算左右分区的范围
function range(){
	var range = {
		left:{
			x:[],
			y:[]
		},
		right:{
			x:[],
			y:[]
		}
	};

	var wrap = {
		w:g('#wrap').clientWidth,
		h:g('#wrap').clientHeight
	}

	var photo = {
		w:g('.photo')[0].clientWidth, 
		h:g('.photo')[0].clientHeight
	}

	range.wrap = wrap;
	range.photo = photo;

	range.left.x = [ 0-photo.w, wrap.w/2-photo.w/2];
	range.left.y = [ 0-photo.h, wrap.h];

	range.right.x = [ wrap.w/2 + photo.w/2 , wrap.w + photo.w ];
	range.right.y = range.left.y;

	return range;
}

