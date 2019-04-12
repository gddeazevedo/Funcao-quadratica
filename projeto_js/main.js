'use strict'

//Objetos
const tela = new Object

const resultFunc = new Object

const coef = {
  $a: NaN,
  $b: NaN,
  $c: NaN,
  set a(valor) { this.$a = valor },
  set b(valor) { this.$b = valor },
  set c(valor) { this.$c = valor },
  get a() { return this.$a },
  get b() { return this.$b },
  get c() { return this.$c }
}


//Funcoes
/*----------------INICIALIZANDO OS OBJETOS-----------------*/
const inputCoef = function() {
  let a = parseFloat(document.getElementById('a').value)
  let b = parseFloat(document.getElementById('b').value)
  let c = parseFloat(document.getElementById('c').value)

  coef.a = a
  coef.b = b
  coef.c = c
}


const inputResultFunc = function(a, b, c, x1, x2, x) {
  resultFunc.x1 = x1 || x
  resultFunc.x2 = x2

  let delta = b ** 2 - 4 * a * c
  let yv = -delta / (4 * a)
  let xv = (-b) / (2 * a)

  resultFunc.xv = xv
  resultFunc.yv = yv
}


const inputTela = function(canvas) {
  Object.defineProperties(tela, {
    w: {value: canvas.width, writable: false, enumerable: true, configurable: false},
    h: {value: canvas.height, writable: false, enumerable: true, configurable: false}
  })
}


/*---------------------------------REDIMENSIONANDO AS COORDENADAS------------------------------*/
const yTela = y => -25 * y


const xTela = x => 25 * x


const funcaoQuad = function(coef, x) {
  let a = coef.a
  let b = coef.b
  let c = coef.c

  let equacao = a * (x ** 2) + (b * x) + c

  return yTela(equacao)
}


/*-------------------------------DESENHO DO GRAFICO------------------------------------*/
const linha = function(x0, y0, x1, y1, ctx) {
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.closePath()
}


const desenharNumeros = function(x, y, i, ctx) {
  ctx.font = '17spx Arial'
  let tmp = i
  let num = tmp / 25
  ctx.fillText(num, x, y)
}


const desenharLinhas = function(ctx) {
  ctx.beginPath()

  for(let i = 0; i < tela.h; i += 25) {
    linha(tela.w / 2 - 5, i, tela.w / 2 + 5, i, ctx)
    desenharNumeros(tela.w / 2, tela.h / 2 - i, i, ctx)
    desenharNumeros(tela.w / 2, tela.h / 2 + i, -i, ctx)
  }
  for(let i = 0; i < tela.w; i += 25) {
    linha(i, tela.h / 2 - 5, i, tela.h / 2 + 5, ctx)
    desenharNumeros(tela.w / 2 + i, tela.h / 2, i, ctx)
    desenharNumeros(tela.w / 2 - i, tela.h / 2, -i, ctx)
  }
  ctx.stroke()
  ctx.closePath()
}


const desenharPontoDaRaiz = function(ctx) {
  ctx.beginPath()
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.arc(xTela(resultFunc.x1), 0, 4, 0, 2 * Math.PI)
  ctx.arc(xTela(resultFunc.x2), 0, 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}


const desenharPontoDoVertice = function(ctx) {
  ctx.beginPath()
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.arc(xTela(resultFunc.xv), yTela(resultFunc.yv), 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
  ctx.closePath()
}


const grafico = function(ctx) {
  let xi = -100
  let xf = 100
  let x = xi
  let dx = 0.1

  ctx.translate(tela.w / 2, tela.h / 2)
  ctx.beginPath()
  ctx.moveTo(xTela(x), funcaoQuad(coef, x))
  x += dx

  while(x < xf) {
    ctx.lineTo(xTela(x), funcaoQuad(coef, x))
    x += dx
  }
  ctx.stroke()
  desenharPontoDaRaiz(ctx)
  desenharPontoDoVertice(ctx)
  ctx.translate(-tela.w / 2, -tela.h / 2)
  ctx.closePath()
}


const desenhar = function() {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')

  inputTela(canvas)
  
  linha(tela.w / 2, 0, tela.w / 2, tela.h, ctx)
  linha(0, tela.h / 2, tela.w, tela.h / 2, ctx)
  desenharLinhas(ctx)

  grafico(ctx)

}


/*---------------------------------CANVAS E CALCULOS DA EQUACAO--------------------------------*/


const calcular = function() {
  let r = document.getElementById('span')

  let delta = coef.b ** 2 - 4 * coef.a * coef.c

  if (coef.a === 0)
    r.textContent = new Error('\"a\" não pode ser igual a zero!')

  else if (delta === 0) {
    var x = (-coef.b) / (2 * coef.a)
    r.textContent = 'x = ' + x
  }

  else if (delta > 0) {
    var x1 = ((-coef.b) + delta ** 0.5) / (2 * coef.a)
    var x2 = ((-coef.b) - delta ** 0.5) / (2 * coef.a)
    r.textContent = 'x1= ' + x1 + ' x2= ' + x2
  }

  else if ((coef.a === 0 && coef.b === 0 && coef.c === 0) || delta < 0)
    r.textContent = new Error('Não existe raíz real!')

  inputResultFunc(coef.a, coef.b, coef.c, x1, x2, x)
  desenhar()
}


const main = function() {
  inputCoef()
  console.log(coef)
  console.log(tela)
  calcular()
  console.log(resultFunc)
}


const limpar = function() {
  let ctx = document.getElementById('canvas').getContext('2d')
  ctx.clearRect(0, 0, tela.w, tela.h)
  let r = document.getElementById('span')
  r.textContent = '?'
}
