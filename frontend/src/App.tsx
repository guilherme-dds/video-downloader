import { useState } from 'react';
import './App.css'
import axios from 'axios'

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("1080");
  const [audioFormat, setAudioFormat] = useState("wav");
  const [active, setActive] = useState("video");

  const requestBody =
  active === "video"
    ? { url: videoUrl, quality }
    : { url: videoUrl, audioFormat };

  const downloadFile = async () => {
    try {

      const response = await axios.post(
        "http://backend:5000/download",
        requestBody,
        { responseType: "blob" }
      );

      const disposition = response.headers["content-disposition"];

      function getFilenameFromDisposition(disposition: string) {
        if (!disposition) return "video.mp4";

        const utf8Match = disposition.match(/filename\*\=UTF-8''(.+)/i);

        if (utf8Match && utf8Match[1]) {
          return decodeURIComponent(utf8Match[1]);
        }

        const asciiMatch = disposition.match(/filename="(.+)"/i);

        if (asciiMatch && asciiMatch[1]) {
          return asciiMatch[1];
        }

        return "video.mp4";
      }

      console.log(disposition)

      const filename = getFilenameFromDisposition(disposition);

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }
  };

  return (
    <>
      <div className='main'>
        <div className='title'>
          <h1>VIDEO DOWNLOADER</h1>
          <p>Projeto desenvolvido apenas para fins de estudo e aprendizado.</p>
        </div>
        <div className='download-section'>
          <div className="section-bar">
            <div className={`section-video ${active === "video" ? "active" : ""}`} onClick={() => setActive("video")}>Vídeo</div>
            <div className={`section-audio ${active === "audio" ? "active" : ""}`} onClick={() => setActive("audio")}>Áudio</div>
          </div>
          {active === "video" &&
          <div className='inputs'>
            <label htmlFor="">URL do vídeo</label>
            <input type="text" placeholder='https://www.youtube.com/watch?v=' onChange={(e) => setVideoUrl(e.target.value)} />
            <label htmlFor="">Qualidade do vídeo</label>
            <select name="" id="" className='select-quality' onChange={(e) => setQuality(e.target.value)}>
              <option value="1080">FULL HD (1080p)</option>
              <option value="720">HD (720p)</option>
            </select>
          </div>
          }
          {active === "audio" &&
          <div className='inputs'>
            <label htmlFor="">URL do vídeo</label>
            <input type="text" placeholder='https://www.youtube.com/watch?v=' onChange={(e) => setVideoUrl(e.target.value)} />
            <label htmlFor="">Qualidade do áudio</label>
            <select name="" id="" className='select-quality' onChange={(e) => setAudioFormat(e.target.value)}>
              <option value="wav">WAV</option>
              <option value="mp3">MP3</option>
            </select>
          </div>
          }
          <button onClick={downloadFile}>Download</button>
        </div>
      </div>
    </>
  )
}

export default App
