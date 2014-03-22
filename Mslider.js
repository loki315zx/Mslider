/*
 * Mslider javascript 幻灯轮播插件
 * 动画算法参考 http://www.cnblogs.com/cloudgamer/archive/2009/01/06/Tween.html
 * @param        {String}        id                幻灯容器的ID名     必须
 * @param        {Boolean}       auto              是否开启自动播放   default = true
 * @param        {Number}        time              默认切换时间       default = 4000
 * @param        {Number}        speed             动画执行速度       default = 40
 * @param        {String}        effect            动画执行效果       default = [ Linear, Quint, Expo, Bounce ];
 * @param        {String}        direction         动画执行方向       default = [ Lateral, Vertical ] Lateral=横向，Vertical=竖向
 * @param        {String}        arrowLeft         幻灯Prev ID名
 * @param        {String}        arrowRight        幻灯Next ID名
 * @param        {Bollean}       isHidden          幻灯 Prev 和 Next 是否开启自动隐藏 
 * @param        {String}        nav               幻灯片小导航 ID名
 * @param        {String}        navEvent          幻灯片小导航触发事件       default = [ click, mouseover ]
 * @param        {String}        current           默认导航 a className 名    default = current
 *
 *
 * @author        M.J
 * @URL           http://webjyh.com
 * @Demo          http://demo.webjyh.com/Mslider/
 * @Time          2014/03/21
 * @Ver           1.0.0
 */
(function(){
	var Mslider = function( params ){
		var _this = this;
		if ( !params ) return false;
		
		/* common */
		_this.id = _this.$$( params.id );
		_this.ul = _this.id.getElementsByTagName('ul')[0];
		_this.li = _this.ul.getElementsByTagName('li');
		_this.width = _this.id.offsetWidth;
		_this.height = _this.id.offsetHeight;
		_this.index = 0;
		_this.re = null;
		_this.animateTime = null;
		
		/* options */
		_this.options = {
			auto : params.auto ? true : false,
			time : params.time ? params.time : 4000,
			speed : params.speed ? params.speed : 40,
			effect : params.effect ? params.effect : 'Quint',
			direction : params.direction ? params.direction : 'Lateral',
			arrowLeft : params.arrowLeft ? _this.$$( params.arrowLeft ) : null,
			arrowRight : params.arrowRight ? _this.$$( params.arrowRight ) : null,
			isHidden : params.isHidden ? true : false,
			nav : params.nav ? _this.$$( params.nav ) : null,
			navEvent : params.navEvent ? params.navEvent : 'click',
			current : params.current ? params.current : 'current'
		};
		_this.init();
	};
	Mslider.prototype = {
		$$ : function( id ){
			return document.getElementById( id );
		},
		addEventCheck : function( obj, evt, fn ){
			if ( obj.addEventListener ){
				obj.addEventListener( evt, fn, false );
			} else if ( obj.attachEvent ){
				obj.attachEvent( 'on'+evt, fn );
			}
		},
		createCss : function( obj, css ){
			var cssStr = '';
			for ( attr in css ){
				cssStr += attr + ":" + css[attr] + ";";
			}
			obj.style.cssText = cssStr;
		},
		setCss : function(){
			var _this = this,
				cssUl = {
					'width' : _this.options.direction == 'Lateral' ? _this.width * _this.li.length + 'px' : _this.width + 'px',
					'height' : _this.options.direction == 'Lateral' ? _this.height + 'px' : _this.height * _this.li.length + 'px',
					'margin' : '0px',
					'clear' : 'both'
				},
				cssLi = {
					'width' : _this.width + 'px',
					'height' : _this.height + 'px',
					'float' : _this.options.direction == 'Lateral' ? 'left' : 'none',
					'overflow' : 'hidden'
				};
			_this.createCss( _this.ul, cssUl );
			for ( var i=0; i < _this.li.length; i++ ){
				_this.createCss( _this.li[i], cssLi );
			}
		},
		createHtml :  function( obj ){
			var _this = this;
			var ul = document.createElement('ul');
			for ( var i=0; i<_this.li.length; i++ ){
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.setAttribute( 'href', 'javascript:;' );
				( i == 0 ) ? a.setAttribute( 'class', _this.options.current ) : '';
				a.innerText = i+1;
				li.appendChild( a );
				ul.appendChild( li );
			}
			obj.appendChild(ul);
		},
		setClass : function( obj, index ){
			var _this = this;
			for ( var i=0; i<obj.length; i++ ){
				obj[i].getElementsByTagName('a')[0].className = '';
			}
			obj[index].getElementsByTagName('a')[0].className = _this.options.current;
		},
		animate : function( t, b, c, d ){
			var _this = this;
			var effect = _this.effect( _this.options.effect );
			clearTimeout( _this.animateTime );
			if ( _this.options.direction == 'Lateral' ){
				_this.ul.style.marginLeft = parseInt( effect( t, b, c, d ) ) + 'px';
			} else {
				_this.ul.style.marginTop = parseInt( effect( t, b, c, d ) ) + 'px';
			}
			if ( t < d ) { t++;  _this.animateTime = setTimeout( function(){ _this.animate( t, b, c, d ); }, 20 ); }
		},
		effect : function( effect ){
			var _this = this;
			switch ( effect ){
				case 'Linear':
					return _this.Tween.Linear;
					break;
				case 'Quint':
					return _this.Tween.Quint;
					break;
				case 'Expo':
					return _this.Tween.Expo;
					break;
				case 'Bounce':
					return _this.Tween.Bounce;
					break;
				default :
					return _this.Tween.Quint;
			}
		},
		Tween : {
			Linear: function( t, b, c, d ){ 
				return c*t/d + b;
			},
			Quint : function( t, b, c, d ){
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			Expo : function( t, b, c, d ){
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			Bounce : function( t, b, c, d ){
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
			}
		},
		action : function( index ){
			var _this = this;
			var t = b = c = e = 0, d = _this.options.speed;
			if ( _this.index < 0 ){
				_this.index = _this.li.length-1;
			}
			if ( _this.index >= _this.li.length ){
				_this.index = 0;
			}
			e = ( _this.options.direction == 'Lateral' ) ? -_this.index * _this.width : -_this.index * _this.height;
			b = ( _this.options.direction == 'Lateral' ) ? parseInt( _this.ul.style.marginLeft ) : parseInt( _this.ul.style.marginTop );
			c = e - b;
			_this.animate( t, b, c, d );
			if ( _this.options.nav ){ 
				var li = _this.options.nav.getElementsByTagName('ul')[0].getElementsByTagName('li');
				_this.setClass( li, _this.index );
			}
		},
		mouseover : function(){
			var _this = this;
			if ( _this.options.arrowLeft &&  _this.options.arrowRight ){
				_this.createCss(  _this.options.arrowLeft, { "display":"block" } );
				_this.createCss(  _this.options.arrowRight, { "display":"block" } );
			}
			clearInterval( _this.re );
		},
		mouseout : function(){
			var _this = this;
			if ( _this.options.arrowLeft &&  _this.options.arrowRight ){
				if ( _this.options.isHidden ){
					_this.createCss( _this.options.arrowLeft, { "display":"none" } );
					_this.createCss( _this.options.arrowRight, { "display":"none" } );
				}
			}
			if ( _this.options.auto ) { _this.interval(); }
		},
		arrowsLeft : function(){
			var _this = this;
			_this.action( _this.index-- );
		},
		arrowsRight : function(){
			var _this = this;
			_this.action( _this.index++ );
		},
		interval : function(){
			var _this = this;
			_this.re = setInterval( function(){ _this.action( _this.index++ ); }, _this.options.time );
		},
		navfun : function(){
			var _this = this;
			_this.createHtml( _this.options.nav );
			var li = _this.options.nav.getElementsByTagName('ul')[0].getElementsByTagName('li');
			
			for ( var i=0; i<li.length; i++ ){
				( _this.li == i ) ? li.getElementsByTagName('a')[0].className = _this.options.current : '';
				li[i].index = i;
				_this.addEventCheck( li[i], _this.options.navEvent, function(){ _this.navEvent( li, this.index ) } );
			}
		},
		navEvent : function( obj, index ){
			var _this = this;
			_this.setClass( obj, index );
			_this.index = index;
			_this.action( _this.index );
		},
		init : function(){
			var _this = this;
			
			/* common */
			_this.setCss();

			/* slide onmouse */
			_this.addEventCheck( _this.id, 'mousemove', function(){ _this.mouseover(); } );
			_this.addEventCheck( _this.id, 'mouseout', function(){ _this.mouseout(); } );
			
			/* arrow onclick */
			if ( _this.options.arrowLeft && _this.options.arrowRight ) {
				_this.addEventCheck( _this.options.arrowLeft, 'click', function(){ _this.arrowsLeft(); } );
				_this.addEventCheck( _this.options.arrowRight, 'click', function(){ _this.arrowsRight(); } );
			}

			/* nav */
			if ( _this.options.nav ){
				_this.navfun();
			}
			
			/* setInterval */
			if ( _this.options.auto ) {
				_this.interval();
			}
		}
	};
	window.Mslider = Mslider;
}());