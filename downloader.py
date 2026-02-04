from yt_dlp import YoutubeDL

url = input("URL do vídeo: ")

ydl_opts = {
    "format": "bestvideo[height=1080]",
    "merge_output_format": "mp4",
}

with YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])
