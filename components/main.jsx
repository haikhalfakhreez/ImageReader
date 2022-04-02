import Image from 'next/image'
import { useState, useRef } from 'react'
import { createWorker } from 'tesseract.js'
import { journeyStatuses, journeyData } from '../lib/tesseractData'

export default function Home() {
  const [ocr, setOcr] = useState(null)
  const [journey, setJourney] = useState(journeyData)
  const [accuracy, setAccuracy] = useState(0)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState(false)
  const [copyText, setCopyText] = useState('Copy')
  const fileInput = useRef(null)

  const worker = createWorker({
    logger: (m) => {
      const { status, progress, userJobId, workerId } = m

      let currentJourneyId = '1'
      Object.entries(journeyStatuses).forEach(([key, value]) => {
        if (value.includes(status)) {
          currentJourneyId = key
        }
      })

      setJourney((prevObject) => ({
        ...prevObject,
        [currentJourneyId]: {
          ...prevObject[currentJourneyId],
          progress: progress,
        },
      }))
    },
  })

  async function doOCR() {
    setLoading(true)
    const img = fileInput.current.files[0]

    if (!img) {
      setError(true)
      setUploaded(false)
      setLoading(false)
      return
    }

    setError(false)
    setOcr(null)
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    const {
      data: { text, confidence },
    } = await worker.recognize(img)
    setOcr(text)
    setAccuracy(confidence)
    setUploaded(false)
    setLoading(false)
  }

  function reset() {
    setOcr(null)
    setJourney(journeyData)
    setAccuracy(0)
    setLoading(false)
    setError(false)
    setUploaded(false)
    fileInput.current.value = ''
  }

  function onFileChange(event) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      setUploaded(true)
    }

    if (file) reader.readAsText(file)
  }

  function removeFileUpload() {
    fileInput.current.value = ''
    setUploaded(false)
  }

  function copyOCR() {
    if (!ocr || copyText === 'Copied!') return
    navigator.clipboard.writeText(ocr)
    setCopyText('Copied!')
    setTimeout(() => setCopyText('Copy'), 3000)
  }

  return (
    <>
      <main className="py-8">
        <h1 className="font-bold text-2xl pb-2 border-b border-gray-200 mb-12">ImageReader</h1>

        <div className="flex justify-end">
          <div className="overflow-hidden border-t border-x border-gray-200 rounded-t-sm space-x-px bg-gray-200">
            <button
              className="inline-block bg-white text-black px-3 py-2 hover:bg-gray-100 text-xs font-medium h-full"
              onClick={() => reset()}
            >
              Reset
            </button>

            <label
              htmlFor="fileInput"
              className="inline-block bg-white text-black px-3 py-2 hover:bg-gray-100 text-xs font-medium h-full hover:cursor-pointer"
            >
              <span>Upload</span>
              <input id="fileInput" type="file" className="hidden" ref={fileInput} onChange={(e) => onFileChange(e)} accept="image/*,.jpg,.jpeg,.png" />
            </label>

            <button
              className="inline-block bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 text-xs font-medium"
              onClick={() => doOCR()}
            >
              Start OCR
            </button>
          </div>
        </div>

        <div
          className={`relative group border rounded-b-sm rounded-tl-sm px-4 ${
            error ? 'border-red-600' : uploaded ? 'border-green-600' : 'border-gray-200'
          }`}
        >
          <div className="py-4 overflow-x-auto space-y-3">
            {uploaded ? (
              <div className="flex items-center gap-x-2">
                <Image src="/file.svg" height={15} width={15} alt="File icon" />
                <span className="text-xs">{fileInput.current.files[0].name}</span>
                <button onClick={() => removeFileUpload()}>
                  <Image src="/close.svg" height={15} width={15} alt="Remove" />
                </button>
              </div>
            ) : null}
            <pre className={error ? 'text-red-600' : uploaded ? 'text-green-600' : ''}>
              {error
                ? 'Please upload your image first!'
                : loading
                ? 'Recognizing...'
                : ocr
                ? ocr
                : uploaded
                ? 'Click "Start OCR" to start extracting'
                : 'Upload your image and click "Start OCR" to start extracting'}
            </pre>
          </div>

          {ocr ? (
            <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                className="px-2 shadow py-1 rounded-sm text-xs text-gray-400 bg-gray-100"
                onClick={() => copyOCR()}
              >
                {copyText}
              </button>
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <span className="text-sm mr-4">Accuracy</span>
          <span className="font-bold">{accuracy ? accuracy : 0}</span>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold mb-4 text-lg">Status</h2>

          <div className="space-y-3">
            {Object.values(journey).map((item) => (
              <div key={item.id} className="grid sm:grid-cols-[250px_minmax(0,_1fr)] gap-x-4 gap-y-2">
                <label className="text-sm">{item.name}:</label>
                <ProgressBar value={item.progress} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 pt-4 pb-6 mt-8">
        <ul className="flex gap-x-4">
          <FooterLink href="https://github.com/haikhalfakhreez/ImageReader">GitHub</FooterLink>
          <FooterLink href="https://www.linkedin.com/in/haikhalfakhreez/">LinkedIn</FooterLink>
          <FooterLink href="https://www.haikhalfakhreez.com/">Portfolio</FooterLink>
        </ul>
      </footer>
    </>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="w-full min-w-[200px] h-4 rounded-sm bg-gray-100">
      <div className="bg-blue-400 h-full rounded-sm" style={{ width: `${Math.round(value * 100)}%` }}></div>
    </div>
  )
}

function FooterLink({ href, children }) {
  return (
    <li>
      <a href={href} className="text-xs text-gray-500 hover:text-gray-800">
        {children}
      </a>
    </li>
  )
}
