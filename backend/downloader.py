import os
from flask import Flask, jsonify, request, send_file
from yt_dlp import YoutubeDL
from flask_cors import CORS
import ffmpeg

app = Flask(__name__)
CORS(
    app,
    resources={r"/download": {"origins": "*"}}, 
    expose_headers=["Content-Disposition"],
)

@app.route("/download", methods=["POST"])
def post_video():
    try:
        os.makedirs("videos", exist_ok=True)

        postprocessors = []
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON received"}), 400

        quality = data.get("quality")
        audioFormat = data.get("audioFormat")

        if quality == "1080":
            formatQuality = "bestvideo[height<=1080]+bestaudio/best"
        elif quality == "720":
            formatQuality = "bestvideo[height<=720]+bestaudio/best"
        elif audioFormat in ["wav", "mp3"]:
            formatQuality = "bestaudio/best"
            postprocessors.append({
                "key": "FFmpegExtractAudio",
                "preferredcodec": audioFormat,
                "preferredquality": "192" if audioFormat == "mp3" else None
            })
        else:
            formatQuality = "bestvideo[height<=1080]+bestaudio/best"

        ydl_opts = {
            "format": formatQuality,
            "merge_output_format": "mp4",
            "outtmpl": "videos/%(title)s.%(ext)s",
            "postprocessors": postprocessors,
            "noplaylist": True,
            "cookiefile": "cookies.txt",
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(data["url"], download=True)

            filename = ydl.prepare_filename(info)

            if "requested_downloads" in info:
                filename = info["requested_downloads"][0]["filepath"]

        return send_file(
            filename,
            as_attachment=True,
            download_name=os.path.basename(filename)
        )

    except Exception as e:
        print("ERRO:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
