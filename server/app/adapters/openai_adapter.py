import requests


class OpenAIAdapter:
    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.openai.com/v1"

    def chat(self, messages: list[dict], tools_schema: list[dict]) -> str:
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.2,
        }
        headers = {"Authorization": f"Bearer {self.api_key}"}
        response = requests.post(
            f"{self.base_url}/chat/completions", json=payload, headers=headers, timeout=60
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
