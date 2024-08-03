## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run Fashion Recommender With AI Chatbot

- Node.js (Version: >=18.x)
- PostgreSQL (Version: >=13.x)
- Yarn _(recommended)_

## Development

### Setup

1. Clone the repo into a public GitHub repository (or fork https://github.com/Real-Partha/Fashion-Recommender-With-AI-Chatbot/fork).

   ```sh
   git clone https://github.com/Real-Partha/Fashion-Recommender-With-AI-Chatbotgit
   ```

2. Go to the project folder

   ```sh
   cd Fashion-Recommender-With-AI-Chatbot
   ```

3. Set up your `.env` file


### Configuring Backend

1. Setup Virtual Environment
    ```sh
    python -m venv venv
    ```

2. Activate Virtual Environment
    ```sh
    venv/script/Activate.ps1
    ```

3. Installing Dependencies
    ```sh
    pip install -r requirements.txt
    ```

### Configuring Frontend

1. Go to Frontend folder
    ```sh
    -cd Frontend
    ```

2. Install Node Modules
    ```sh
    npm install
    ```

## Usage

### Start Backend

1. Go to Backend Folder
    ```sh
    -cd Backend
    ```

2. Start the Backend Server
    ```sh
    uvicorn app.main:app --reload
    ```
### Start Frontend

1. Go to Frontend Folder
    ```sh
    -cd Frontend
    ```

2. Start the Frontend Server
    ```sh
    npm run dev
    ```

3.
