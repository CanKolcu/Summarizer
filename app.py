from flask import Flask, render_template
from flask import Flask, render_template, request, jsonify
import openai
from flask_cors import CORS
#API_KEY.env için gerekli
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)

load_dotenv()  # .env dosyasını yükler

# OpenAI API anahtarını buraya yaz
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/english')
def new_page():
    return render_template('newpage.html')


@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    input_text = data.get('text')

    if not input_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                {"role": "user", "content": f"Please summarize this text:\n{input_text}"}
            ],
            max_tokens=150,
            temperature=0.5
        )
        summary = response['choices'][0]['message']['content']
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)