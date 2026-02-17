import os
from flask import Flask, jsonify, request, send_file
from yt_dlp import YoutubeDL
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    resources={r"/download": {"origins": "*"}}, 
    expose_headers=["Content-Disposition"],
    supports_credentials=True
)

url = []

@app.route("/download", methods=["POST"])
def post_video():
    data = request.json

    quality = data.get("quality")
    audio = data.get("audio")

    if quality == "1080":
        formatQuality = "bestvideo[height<=1080]+bestaudio/best"

    elif quality == "720":
        formatQuality = "bestvideo[height<=720]+bestaudio/best"

    elif audio is True:
        formatQuality = "bestaudio/best"

    else:
        formatQuality = "bestvideo[height<=1080]+bestaudio/best"

    ydl_opts = {
        "format": formatQuality,
        "merge_output_format": "mp4",
        "outtmpl": "videos/%(title)s.%(ext)s",

        "cookiesfrombrowser": ("brave",),

        "js_runtimes": {
            "node": {}
        },

        "remote_components": ["ejs:github"],

        "extractor_args": {
            "youtube": {
                "player_client": ["web", "tv"]
            }
        },

        "quiet": False,
        "verbose": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(data["url"], download=True)
        filename = ydl.prepare_filename(info)

    return send_file(
        filename,
        as_attachment=True,
        download_name=os.path.basename(filename)
    )

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
