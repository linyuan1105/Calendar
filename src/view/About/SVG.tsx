import React from 'react'

export function SVG() {

  return (
    <>
      {/*<StartSVG />*/}
      {/*<PositionSvg />*/}
      <BasicShapes />
      <Path />
    </>
  )
}

function Path() {
  // 关于path中的值
  // d 一个点数集以及如何绘制路径的信息
  // M 100 100 移动到坐标 100 100  大写代表绝对定位；小写代表相对定位，例如：从上一个点开始，向上移动10px，向左移动7px
  // h 100 水平向右移动100
  // h -100 水平向左移动100
  // v 100 垂直向下移动80
  // v -100 垂直向上移动80
  // z 回到初起点
  return (

    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      {/*创建一个矩形
          起始点 100 100
          向右移 100
          向下移 100
          向左移 100
          向上移 100
          */}
      <path d="M300 300"/>
      <circle cx="300" cy="300" r="2" fill="red"/>
      <path d="M 10 10 h 200 m 10 90 h 200"  stroke={'black'}/>
      <path d="m 0,0 Q100,100 50,230 T90,230" fill="none" stroke="blue" strokeWidth="1"/>
      <path d="M 0 0 h 100 v 100 h -100 v -100" stroke='black' fill='transparent'></path>
    </svg>
  )
}

function BasicShapes() {
  // rect 矩形 起始点 (50,50) 宽100，高150(宽高不包含strokeWidth) ；stroke:描边； rx=50 ry=20 设置边角； fill： 填充内容
  // circle 圆 (cx,cy)=>(150,50) 圆心坐标 ；r=50，圆的半径50
  // ellipse 椭圆 中心坐标(cx,cy)=>(150,50); rx=100,ry=30,x轴半径100，y轴30
  // line 线条 起始点坐标(150,0)=>(150,50),结束点坐标
  // polyline 折线 解析points，以两个数值为一个坐标（数值个数为奇数时，会自动解析坐标点，不受逗号影响）
  // polygon 多边形 和折现类型，不过最终会自动连接结束点和起始点
  return (
    <svg width="400" height="400"  xmlns="http://www.w3.org/2000/svg">
      <path d="M 0,0 Q40,205 50,230 T90,230" fill="none" stroke="blue" strokeWidth="5"/>
      <rect x={50} y={50} width={100} height={150} stroke={'red'} strokeWidth={10}  rx={50} ry={20} fill={'blue'} ></rect>
      <circle cx={150} cy={50} r={50} stroke={'green'} strokeWidth={5} fill={'yellow'} ></circle>
      <ellipse cx={150} cy={50} rx={100} ry={30} stroke={'black'} fill={'transparent'}></ellipse>
      <line x1={150} y1={0} x2={150} y2={50} stroke={'blue'} strokeWidth={5}></line>
      <polyline points=" 70,0 0, 20 70, 115 75, 130 80, 125 85, 140 90, 135 95, 150 150 50" fill={'transparent'} strokeWidth={5} stroke={'black'}/>
      <polygon points="50 50 80 80 50 100 30 80"
        stroke="yellow" fill="#061a2a" strokeWidth="5"/>
    </svg>
  )
}

function PositionSvg() {
  // 定义了一个100*100px的SVG画布
  // viewBox属性定义了画布上可以显示的区域：从(0，0)开始，到50宽，50高的区域；这50*50的区域会放到100*100的画布上显示
  // 于是就形成了放大两倍的效果
  return (
    <svg width="100" height="100"  viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="red" />
      <text x="0" y="50" fontSize="20"  fill="black">SVG</text>
    </svg>

  )
}
function StartSVG() {
  return (
    <svg
      width="400" height="400"
      xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="red" />
      <circle cx="200" cy="0" r="200" fill="green" />
      <circle cx="200" cy="400" r="200" fill="green" />
      <text x="150" y="125" fontSize="60" textAnchor="middle" fill="white">SVG</text>
    </svg>

  )
}
