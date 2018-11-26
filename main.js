import Mappa from 'mappa-mundi'
require('@code-dot-org/p5')
require('@code-dot-org/p5.play/lib/p5.play')
import { loadImage, overlayMap } from './lib'
import mapConfig from './map.config'

console.log('play', play)

const mappa = new Mappa('Mapbox', mapConfig.mapboxKey)
const TILE_W = 1280
const TILE_H = 1280
const TILE_ROWS = 3
const TILE_COLS = 3

let table
let imgGrid
let canvas
let mapImg

const generateMapGrid = (sk, latLngGrid) => {
  // generate a 2d array of images that form a seamless map when rendered
  latLngGrid.forEach((gridRow, row) => {
    gridRow.forEach((latLng, col) => {
      const currMap = mappa.staticMap({
        ...mapConfig.mappaOptions,
        lat: latLng.lat,
        lng: latLng.lng,
        width: TILE_W,
        height: TILE_H,
      })
      loadImage(sk, currMap.imgUrl).then(img => {
        sk.image(img, col * TILE_W, row * TILE_H)
      })
    })
  })
}

const sketch = sk => {
  sk.preload = () => {
    // table = sk.loadTable(
    //   'http://www.bcn.cat/huts/hut_comunicacio_opendata.csv',
    //   'csv',
    //   'header',
    // )
  }
  sk.setup = () => {
    canvas = sk
      .createCanvas(window.innerWidth, window.innerHeight)
      .parent('root')
    // console.log('rows', table.getRowCount())

    // load overview map as overlay to calc tile lat/lng centers
    const tileMap = mappa.tileMap({
      ...mapConfig.mappaOptions,
      style: `mapbox://styles/${mapConfig.mappaOptions.username}/${
        mapConfig.mappaOptions.style
      }`,
      width: window.innerWidth,
      height: window.innerHeight,
    })
    const tileW = Math.round(window.innerWidth / TILE_COLS)
    const tileH = Math.round(window.innerHeight / TILE_ROWS)
    console.log('tileW/tileH', tileW, tileH)

    overlayMap(tileMap, canvas).then(() => {
      // create grid of lat/lng centers
      const grid = []
      for (let row = 0; row < TILE_ROWS; row++) {
        grid[row] = []
        for (let col = 0; col < TILE_COLS; col++) {
          const x = tileW * col + Math.round(tileW / 2)
          const y = tileH * row + Math.round(tileH / 2)
          sk.ellipse(x, y, 10)
          const latlng = tileMap.map.containerPointToLatLng(L.point(x, y))
          grid[row][col] = latlng
        }
      }

      generateMapGrid(sk, grid)
    })
  }
  sk.draw = () => {
    console.log('camera', createSprite)
    camera.zoom = 1
  }
}

export default p5(sketch)
