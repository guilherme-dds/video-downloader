from flask import Flask, jsonify, request
from yt_dlp import YoutubeDL

app = Flask(__name__)

url = []

@app.route("/download", methods=["POST"])
def post_video():
    data = request.json

    ydl_opts = {
        "format": "bestvideo[height=1080]",
        "merge_output_format": "mp4",
        "outtmpl": "videos/%(title)s.%(ext)s",
    }

    with YoutubeDL(ydl_opts) as ydl:
        ydl.download([data["url"]])

    return jsonify(data["url"]), 201

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
