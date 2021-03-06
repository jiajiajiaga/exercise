require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'

// let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据，将图片名信息转化成图片URL路径信息
let imageDatas = require('../data/imageDatas.json');

//利用自執行函數，將圖片名信息轉換成URL路徑信息
imageDatas=(function getImageURL(imageDataArr){
	for(var i = 0,j=imageDataArr.length;i<j;i++){
		let singleImageData = imageDataArr[i];

		singleImageData.imageURL=require('../images/' +
			singleImageData.fileName);

		imageDataArr[i]=singleImageData;
	}
	return imageDataArr;
})(imageDatas);

/*
 *获取区间内的一个随机值
 */
function getRangeRandom(low,high){
	return (Math.floor(Math.random() * (high - low) + low));
}
/*
 *獲取0-30度之間的任意正負值
 */
function get30DegRandom(){
	let deg = '';
    deg = (Math.random() > 0.5) ? '+' : '-';
	return (deg + Math.ceil(Math.random() * 30));
}


class ImgFigure extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleClick = this.handleClick.bind(this);
	}
	/*
	 *imgFigure的點擊處理函數
	 */
	 handleClick(e){
	 	if(this.props.arrange.isCenter){
	 		this.props.inverse();
	 	} else{
	 		this.props.center();
	 	}

	 	e.stopPropagation();
	 	e.preventDefault();
	 }

	render(){
		var styleObj={};
		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj= this.props.arrange.pos;
		}

		//如果圖片的旋轉角度有值并且不爲0，添加旋轉角度
		if(this.props.arrange.rotate){
		      (['Moz', 'ms', 'Webkit', '']).forEach((value) => {
		        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		      })
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex=11;
		}

		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
				<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
					<img src={this.props.data.imageURL} alt={this.props.data.title} />
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
						<div className="img-back" onClick={this.handleClick} >
							<p>{this.props.data.desc}</p>
						</div>
					</figcaption>
				</figure>
			)
	}
}
class ControllerUnit extends React.Component{

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){

	 	if(this.props.arrange.isCenter){
	 		this.props.inverse();
	 	} else{
	 		this.props.center();
	 	}

	 	e.stopPropagation();
	 	e.preventDefault();
	}

	render(){

		var controllerUnitClassName='controller-unit';

		//如果对应的是居中图片 ，显示控制台的居中态
		if(this.props.arrange.isInverse){
			controllerUnitClassName += ' is-inverse';
		}
		if(this.props.arrange.isCenter){
			controllerUnitClassName += ' is-center';
		}
		return(
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
			)
	}
}

class AppComponent extends React.Component {

	/**
	 * 翻轉圖片
	 * @param index 輸入當前被執行inverse操作的圖片對應的圖片信息數組的index值
	 * return {function}這是一個閉包函數，其中return一個真正帶被執行的函數
	 */
	inverse(index){
	 	return () => {
	 			var imgsArrangeArr = this.state.imgsArrangeArr;

	 			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

	 			this.setState({
	 				imgsArrangeArr:imgsArrangeArr
	 			})
	 		};
	}
	 /*
	  *利用rearrange函数，居中对应index的图片
	  *@param index ,需要被居中的图片对应的图片信息数组的index的值
	  * @return {Function}
	  */
	center(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	}



    //重新布局所有图片
 	rearrange ( centerIndex ) {
 		let imgsArrangeArr=this.state.imgsArrangeArr,
 			Constant = this.Constant,

 			centerPos = Constant.centerPos,
 			hPosRange = Constant.hPosRange,
 			vPosRange = Constant.vPosRange,
 			hPosRangeLeftSecX = hPosRange.leftSecX,
 			hPosRangeRightSecX = hPosRange.rightSecX,
 			hPosRangeY = hPosRange.y,
 			vPosRangeTopY = vPosRange.topY,
 			vPosRangeX = vPosRange.x,

 			imgsArrangeTopArr = [],
 			topImgNum =Math.floor(Math.random() * 2),
 			topImgSpliceIndex = 0,
 			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1)

 			//首先居中 centerIndex 的图片，居中的 centerIndex 不需要旋转
 			imgsArrangeCenterArr[0] = {
 				pos : centerPos,
 				rotate : 0,
 				isCenter : true
 			}


 			//取出要布局上册的图片的状态信息
 			topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
 			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

 			//布局位于上测的图片
 			imgsArrangeTopArr.forEach((value,index) => {
 				imgsArrangeTopArr[index] = {
 					pos:{
	 					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
 						left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
 					},
 					rotate: get30DegRandom(),
 					isCenter : false,
 				}
 			})

 			//布局左右两侧的图片
 			for (var i = 0, j=imgsArrangeArr.length,k=j/2; i < j; i++) {
 				var hPosRangeLORX = null;

 				//前半部分布局左边，右半部分布局右边
 				if(i < k){
 					hPosRangeLORX = hPosRangeLeftSecX;
 				}else{
 					hPosRangeLORX = hPosRangeRightSecX;
 				}

 				imgsArrangeArr[i] = {
 					pos:{
	 					top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
 						left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
 					},
 					rotate: get30DegRandom(),
 					isCenter : false,
 				}
 			}

 			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
 				imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
 			}

 			imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
 			this.setState({
 				imgsArrangeArr:imgsArrangeArr
 			});
 	}


  	constructor(props) {
     super(props);

	 this.Constant = {
		centerPos:{
			left:0,
			right:0
		},
		hPosRange: {		//水平方向的取值范围
			leftSecX:[0,0], 
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{		//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	};
 	 this.state={
 	 	imgsArrangeArr :[
 			// {
 			// 	pos:{
 			// 		left: '0',
 			// 		top: '0',
 			// 	}
 			// },
 			// rotato :0  //旋轉角度
 			// isInverse:false  //圖片正反面
 			// isCenter :false   //是否居中
 			]
 		};
	}



  //组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

  	//首先拿到舞台的大小
  	let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
  		stageH = stageDOM.scrollHeight,
  		halfStageW = Math.ceil(stageW / 2),
  		halfStageH = Math.ceil(stageH / 2);

  	//拿到一个imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
  		imgW = imgFigureDOM.scrollWidth,
  		imgH = imgFigureDOM.scrollHeight,
  		halfImgW = Math.ceil(imgW/2),
  		halfImgH = Math.ceil(imgH/2);



  	//计算中心图片的位置点
  	this.Constant.centerPos = {
  		left : halfStageW - halfImgW,
  		top : halfStageH - halfImgH
  	}

  	//計算左側，右側圖片排布位置的取值範圍
  	this.Constant.hPosRange.leftSecX[0] = - halfImgW;
  	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  	
  	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  	this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  	this.Constant.hPosRange.y[0] = -halfImgH;
  	this.Constant.hPosRange.y[1] = stageH-halfImgH;

  	//計算上側區域圖片排布的取值範圍
  	this.Constant.vPosRange.topY[0] = -halfImgH;
  	this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

  	this.rearrange(0);
  }

  render() {
	
	var controllerUnits = [],
		imgFigures = [];

    imageDatas.forEach((value, index) => {

		if( !this.state.imgsArrangeArr[index] ){
			this.state.imgsArrangeArr[index]={
				pos:{
					left:0,
					top:0
				},
				rotate: 0,
				isInverse:false,
				isCenter:false
			}
		}

		imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} 
			arrange={this.state.imgsArrangeArr[index]} 
			inverse={this.inverse(index)} 
			center={this.center(index)} />);

		controllerUnits.push(<ControllerUnit 
			arrange={this.state.imgsArrangeArr[index]} 
			inverse={this.inverse(index)} 
			center={this.center(index)} />)


	});

    return (
    	<section className='stage' ref="stage">
    		<section className='img-sec'>
				{imgFigures}
    		</section>
    		<nav className='controller-nav'>
    			{controllerUnits}
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
