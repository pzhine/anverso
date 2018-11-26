export const loadImage = (sk, path) =>
  new Promise((resolve, reject) => {
    sk.loadImage(path, resolve, reject)
  })

export const overlayMap = (map, canvas) =>
  new Promise(resolve => {
    map.overlay(canvas, resolve)
  })
