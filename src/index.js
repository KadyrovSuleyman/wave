import './style.css'

const main = document.createElement('div')
main.className = 'main'
document.body.appendChild(main)

// import sound from './sound/Helmet.ogg'
// import sound from './sound/In-Cockpit.ogg'
// import sound from './sound/MainMenuLoop.ogg'
import sound from './sound/World.ogg'

const player = document.createElement('audio')
player.src = sound
player.id = 'player'
player.controls = true
player.loop = true
player.canPlayType = 'audio/mp3'
main.appendChild(player)

const canvas = document.createElement('canvas')
canvas.width = 950  // x5
canvas.height = 255 + 10   // x5
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
  analyser.fftSize = 256
  bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)

  sourceNode.connect(analyser)
  analyser.connect(audioContext.destination)
}

function visualize() {
  // очистить canvas
  canvasContext.clearRect(0, 0, width, height)

  // Получить данные анализатора
  analyser.getByteFrequencyData(dataArray)

    let barWidth = 10
      let barHeight
      let x = 0

      let range = 0.5 * 0.75

      for(let i = 1; i < bufferLength * range + 1; i++) {
        barHeight = dataArray[i]


        // фильтр высоких частот
        barHeight =  Math.abs(((1 / 6 * (dataArray[i + 1]) || 0) + (-2 / 3 * (dataArray[i] || 0))  + (3 / 2 * (dataArray[i - 1] || 0))))
        // barHeight *= (Math.exp(-0.5 * ((i - bufferLength * range) / (bufferLength / 4))**2) - 0) * 1

        canvasContext.fillStyle = `rgb(
          ${126 + ((235 - 126) / 255 * barHeight)},
          ${230 + ((197 - 230) / 255 * barHeight)},
          ${255 + ((109 - 255) / 255 * barHeight)}
          )`

        canvasContext.fillRect(x, (height - barHeight) / 2, barWidth, barHeight / 2)
        canvasContext.fillRect(x, height / 2 + 8.75, barWidth, barHeight / 2)
        // 10 - количество пикселей между столбцами
        x += barWidth + 10
      }


  window.requestAnimationFrame(visualize)
}
