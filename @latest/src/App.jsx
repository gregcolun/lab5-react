import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import palette from './data/palette.json'
import './App.css'

const GRID_SIZE = 20
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE
const STORAGE_KEY = 'pixel-art-gallery-v1'

const createEmptyCanvas = () => Array.from({ length: TOTAL_CELLS }, () => '')

const isValidPixels = (pixels) =>
  Array.isArray(pixels) &&
  pixels.length === TOTAL_CELLS &&
  pixels.every((cell) => typeof cell === 'string')

const readGalleryFromStorage = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    if (!rawValue) return []

    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.savedAt === 'string' &&
        isValidPixels(item.pixels),
    )
  } catch {
    return []
  }
}

const createDrawingId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const PixelCell = memo(function PixelCell({
  index,
  color,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
}) {
  return (
    <button
      type="button"
      className="pixel-cell"
      onMouseDown={(event) => onCellMouseDown(index, event)}
      onMouseEnter={(event) => onCellMouseEnter(index, event)}
      onMouseUp={onCellMouseUp}
      style={{ backgroundColor: color || '#f8fafc' }}
      aria-label={`Pixel ${index + 1}`}
    />
  )
})

function App() {
  const [selectedColor, setSelectedColor] = useState(palette[0]?.hex ?? '#111111')
  const [pixels, setPixels] = useState(createEmptyCanvas)
  const [isPainting, setIsPainting] = useState(false)
  const [gallery, setGallery] = useState(readGalleryFromStorage)
  const [activeDrawingId, setActiveDrawingId] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery))
  }, [gallery])

  useEffect(() => {
    const stopPainting = () => setIsPainting(false)
    window.addEventListener('mouseup', stopPainting)
    return () => window.removeEventListener('mouseup', stopPainting)
  }, [])

  const hasPaintedPixels = useMemo(() => pixels.some(Boolean), [pixels])

  const paintCell = useCallback(
    (index) => {
      setPixels((previousPixels) => {
        if (previousPixels[index] === selectedColor) {
          return previousPixels
        }

        const nextPixels = [...previousPixels]
        nextPixels[index] = selectedColor
        return nextPixels
      })
    },
    [selectedColor],
  )

  const handleCellMouseDown = useCallback(
    (index, event) => {
      if (event.button !== 0) return
      setIsPainting(true)
      paintCell(index)
    },
    [paintCell],
  )

  const handleCellMouseEnter = useCallback(
    (index, event) => {
      if (!isPainting) return
      if ((event.buttons & 1) !== 1) return
      paintCell(index)
    },
    [isPainting, paintCell],
  )

  const stopPainting = useCallback(() => setIsPainting(false), [])

  const resetCanvas = useCallback(() => {
    setPixels(createEmptyCanvas())
    setActiveDrawingId(null)
  }, [])

  const saveDrawing = useCallback(() => {
    if (!hasPaintedPixels) return

    const drawing = {
      id: createDrawingId(),
      pixels: [...pixels],
      savedAt: new Date().toISOString(),
    }

    setGallery((previousGallery) => [drawing, ...previousGallery])
    setActiveDrawingId(drawing.id)
  }, [hasPaintedPixels, pixels])

  const loadDrawing = useCallback(
    (drawingId) => {
      const drawing = gallery.find((item) => item.id === drawingId)
      if (!drawing) return

      setPixels([...drawing.pixels])
      setActiveDrawingId(drawingId)
    },
    [gallery],
  )

  const deleteDrawing = useCallback((drawingId) => {
    setGallery((previousGallery) => previousGallery.filter((item) => item.id !== drawingId))
    setActiveDrawingId((previousActive) =>
      previousActive === drawingId ? null : previousActive,
    )
  }, [])

  const gridStyle = useMemo(
    () => ({ gridTemplateColumns: `repeat(${GRID_SIZE}, var(--cell-size))` }),
    [],
  )

  return (
    <main className="app">
      <div className="artboard-glow" aria-hidden />
      <section className="pixel-app">
        <header className="app-header">
          <p className="eyebrow">Lab 5 React</p>
          <h1>Pixel Art Studio</h1>
          <p className="subtitle">Click, drag, save and reload your own pixel sketches.</p>
        </header>

        <div className="workspace">
          <section className="canvas-panel">
            <div className="controls">
              <div className="palette" role="list" aria-label="Color palette">
                {palette.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    className={`color-chip ${
                      selectedColor === color.hex ? 'is-selected' : ''
                    }`}
                    style={{ '--chip-color': color.hex }}
                    onClick={() => setSelectedColor(color.hex)}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  />
                ))}
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="action-button save"
                  onClick={saveDrawing}
                  disabled={!hasPaintedPixels}
                >
                  Save
                </button>
                <button type="button" className="action-button reset" onClick={resetCanvas}>
                  Reset
                </button>
              </div>
            </div>

            <div
              className="pixel-grid"
              style={gridStyle}
              onMouseUp={stopPainting}
              role="grid"
              aria-label={`${GRID_SIZE} by ${GRID_SIZE} drawing grid`}
            >
              {pixels.map((color, index) => (
                <PixelCell
                  key={index}
                  index={index}
                  color={color}
                  onCellMouseDown={handleCellMouseDown}
                  onCellMouseEnter={handleCellMouseEnter}
                  onCellMouseUp={stopPainting}
                />
              ))}
            </div>
          </section>

          <aside className="gallery-panel">
            <div className="gallery-header">
              <h2>Saved Drawings</h2>
              <span>{gallery.length}</span>
            </div>

            {gallery.length === 0 ? (
              <p className="empty-gallery">No drawings saved yet.</p>
            ) : (
              <ul className="gallery-list">
                {gallery.map((drawing, drawingIndex) => (
                  <li
                    key={drawing.id}
                    className={`drawing-card ${
                      activeDrawingId === drawing.id ? 'is-active' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="thumbnail"
                      onClick={() => loadDrawing(drawing.id)}
                      aria-label={`Load drawing ${drawingIndex + 1}`}
                    >
                      <div className="thumbnail-grid">
                        {drawing.pixels.map((cellColor, index) => (
                          <span
                            key={`${drawing.id}-${index}`}
                            className="thumbnail-pixel"
                            style={{ backgroundColor: cellColor || '#f8fafc' }}
                          />
                        ))}
                      </div>
                    </button>

                    <div className="drawing-meta">
                      <p>Drawing {drawingIndex + 1}</p>
                    </div>

                    <div className="drawing-actions">
                      <button
                        type="button"
                        className="mini-button load"
                        onClick={() => loadDrawing(drawing.id)}
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        className="mini-button delete"
                        onClick={() => deleteDrawing(drawing.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
