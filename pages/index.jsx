import Head from 'next/head'
import Content from '../components/main'

export default function Home() {
  return (
    <div className="mx-4 lg:max-w-screen-lg lg:mx-auto flex flex-col justify-between min-h-screen">
      <Head>
        <title>ImageReader</title>
        <meta name="description" content="Extract text from image" />
        <meta name="keywords" content="Extract text from image, OCR" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ImageReader.vercel.app/" />
        <meta property="og:title" content="ImageReader" />
        <meta property="og:description" content="Extract text from image" />
        <meta property="og:image" content="/imagereader-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ImageReader" />
        <meta name="twitter:description" content="Extract text from image" />
        <meta name="twitter:site" content="@ekaliacid" />
        <meta name="twitter:creator" content="@ekaliacid" />
        <meta name="twitter:image" content="/imagereader-og.png" />
        <meta name="twitter:alt" content="ImageReader" />

        <link rel="canonical" href="https://ImageReader.vercel.app/" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content />
    </div>
  )
}
