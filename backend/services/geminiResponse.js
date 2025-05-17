//userFeedback: { type: String, enum: ['phishing', 'safe'], required: true },
const{ GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function verifyUrl(url , prediction) {
  prompt =`You have to identify/validate if my model predicted the site phising or not Based on url is Correct or not
            \n this is how im storing the response userFeedback: { type: String, enum: ['phishing', 'safe'], required: true }
            \n1)Reply with one word only after verification phising or safe thats it
            \n2)Your task is to search the web and find if the site is safe or not
            \nhere is the url ${url} and my model predicted ${prediction}`

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt
  });
  console.log(response.text);
  return response.text;
}

module.exports = verifyUrl