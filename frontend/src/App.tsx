import { useState } from 'react';
import './App.css'
import axios from 'axios'

function App() {
  const [videoUrl, setVideoUrl] = useState("");

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
      a.href = url; // ❗ faltava isso
      a.download = "video.mp4"; // nome do arquivo

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
        <h1>Video Downloader</h1>
        <input type="text" onChange={(e) => setVideoUrl(e.target.value)} />
        <button onClick={downloadFile}>Download</button>
      </div>
    </>
  )
}

export default App
