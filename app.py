from flask import Flask, render_template
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from flask_cors import CORS
#API_KEY.env için gerekli
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)

load_dotenv()  # .env dosyasını yükler

client = OpenAI()

# OpenAI API anahtarını buraya yaz
client.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    input_text = data.get('text')
    language = data.get('language', 'en')  # varsayılan İngilizce

    if not input_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        if language == 'tr':
            prompt = f"Lütfen bu metni türkçe özetle:\n{input_text}"
        else:
            prompt = f"Please summarize this text in english:\n{input_text}"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that only summarizes text."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        summary = response.choices[0].message.content
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)