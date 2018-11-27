const mapConfig = {
  mapboxKey:
    'pk.eyJ1IjoicHpoaW5lIiwiYSI6ImNqb3lpc3d5NjJieDMzcGtmemVscWQ0ZnkifQ.FzHR5HQu1lAHCcqI9g4HFg',
  mappaOptions: {
    studio: true,
    username: 'pzhine',
    style: 'cjoyiufdc3zhi2smr3ws3upbr',
    lng: 2.171309,
    lat: 41.403057,
    zoom: 13.5,
    pitch: 0,
    logo: false,
  },
}

const loadImageP = path =>
  new Promise((resolve, reject) => {
    loadImage(path, resolve, reject)
  })

const overlayMapP = (map, canvas) =>
  new Promise(resolve => {
    map.overlay(canvas, resolve)
  })

const mappa = new Mappa('Mapbox', mapConfig.mapboxKey)
const TILE_W = 50
const TILE_H = 50

let table
let canvas
let tileMap
let drops
let speed = 1

const drawDrops = () => {
  drops = []

  const drawRow = i => {
    //get the lat/lng of each house
    try {
      const pos = tileMap.map.latLngToContainerPoint(
        L.latLng(
          table.getString(i, 'LATITUD_Y'),
          table.getString(i, 'LONGITUD_X'),
        ),
      )
      drops.push({
        pos,
        size: 10,
      })
    } catch (err) {
      console.error(err)
    }
    setTimeout(() => drawRow(i + 1), 100 / speed)
  }

  drawRow(0)
}

function preload() {
  table = loadTable(
    'http://www.bcn.cat/huts/hut_comunicacio_opendata.csv',
    'csv',
    'header',
  )
}

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight).parent('root')

  // console.log('rows', table.getRowCount())

  tileMap = mappa.tileMap({
    ...mapConfig.mappaOptions,
    style: `mapbox://styles/${mapConfig.mappaOptions.username}/${
      mapConfig.mappaOptions.style
    }`,
    width: window.innerWidth,
    height: window.innerHeight,
  })

  overlayMapP(tileMap, canvas)

  tileMap.onChange(drawDrops)
}

function draw() {
  clear()
  if (!drops) {
    return
  }
  for (drop of drops) {
    noStroke()
    fill(255, 255, 255)
    drop.size += 0.05 * speed
    ellipse(drop.pos.x, drop.pos.y, drop.size)
  }
}

function mouseClicked() {
  speed += 20
  console.log('speed', speed)
}
