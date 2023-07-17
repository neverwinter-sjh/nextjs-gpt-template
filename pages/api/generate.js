import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "user", content: "슈퍼히어로와 같은 동물 이름을 지어줘. 항상 한글로만 대답해야 돼."},
        {role: "user", content: "고양이"},
        {role: "system", content: "캡틴 샤프클로우, 슈퍼 블랙캣, 아이언캣"},
        {role: "user", content: "개"},
        {role: "system", content: "배트바둑이, 슈퍼 블랙독, 아이언독"},
        {role: "user", content: animal},
      ],
      temperature: 0.6,
    });
    console.log(chatCompletion.data.choices[0].message);
    res.status(200).json({ result: chatCompletion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


