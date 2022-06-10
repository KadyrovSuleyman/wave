import './style.css'

const main = document.createElement('div')
main.className = 'main'
document.body.appendChild(main)

import sound from './sound/MainMenuLoop.ogg'
const player = document.createElement('audio')
player.src = sound
player.id = 'player'
player.controls = true
player.loop = true
player.canPlayType = 'audio/mp3'
main.appendChild(player)

const canvas = document.createElement('canvas')
canvas.width = 1280 + 2 * 20  // x5
canvas.height = 200 + 8.75   // x5
canvas.id = 'myCanvas'
main.appendChild(canvas)

// ============================================================
const audioCtx = window.AudioContext

let audioContext, canvasContext
let width, height

window.onload = function() {
  audioContext= new audioCtx()
  width = canvas.width
  height = canvas.height
  canvasContext = canvas.getContext('2d')

  buildAudioGraph()

  window.requestAnimationFrame(visualize)
};

let analyser
let bufferLength, dataArray

function buildAudioGraph() {
  player.onplay = (e) => {audioContext.resume()}

  // исправлено для политики автозапуска
  player.addEventListener('play',() => audioContext.resume())

  const sourceNode =   audioContext.createMediaElementSource(player)

  // Создать узел анализатора
  analyser = audioContext.createAnalyser()

  // Попробуйте изменить на более низкие значения: 512, 256, 128, 64 ...
  analyser.fftSize = 128
  bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)

  sourceNode.connect(analyser)
  analyser.connect(audioContext.destination)
}

function visualize() {
  // очистить canvas
  canvasContext.clearRect(0, 0, width, height)

  // Или используйте заливку RGBA, чтобы получить небольшой эффект размытия
  //canvasContext.fillStyle = 'rgba (0, 0, 0, 0.5)';
  //canvasContext.fillRect(0, 0, width, height);

  // Получить данные анализатора
  analyser.getByteFrequencyData(dataArray)

    let barWidth = 10
      let barHeight
      let x = 0

      // значения изменяются от 0 до 255, а высота холста равна 100. Давайте изменим масштаб
      // перед отрисовкой. Это масштабный коэффициент
      let heightScale = height / 255

      for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]
        // console.log(barHeight)

        canvasContext.fillStyle = `rgb(
          ${126 + ((255 - 126) / 255 * barHeight)},
          ${230 + ((195 - 230) / 255 * barHeight)},
          ${255 + ((100 - 255) / 255 * barHeight)}
          )`
        barHeight *= heightScale
        canvasContext.fillRect(x, (height - barHeight) / 2, barWidth, barHeight / 2)
        canvasContext.fillRect(x, height / 2 + 8.75, barWidth, barHeight / 2)
        // 10 - количество пикселей между столбцами
        x += barWidth + 10
      }


  window.requestAnimationFrame(visualize)
}
