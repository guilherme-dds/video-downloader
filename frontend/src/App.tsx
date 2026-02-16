import { useState } from 'react';
import './App.css'
import axios from 'axios'

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [active, setActive] = useState("video");

  const downloadFile = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/download",
        { url: videoUrl },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";

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
            <select name="" id="" className='select-quality'>
              <option value="1080p">FULL HD (1080p)</option>
              <option value="720p">HD (720p)</option>
            </select>
          </div>
          }
          {active === "audio" &&
          <div className='inputs'>
            <label htmlFor="">URL do vídeo</label>
            <input type="text" placeholder='https://www.youtube.com/watch?v=' onChange={(e) => setVideoUrl(e.target.value)} />
            <label htmlFor="">Qualidade do áudio</label>
            <select name="" id="" className='select-quality'>
              <option value="1080p">MP3 (320kbps)</option>
              <option value="720p">HD (720p)</option>
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
