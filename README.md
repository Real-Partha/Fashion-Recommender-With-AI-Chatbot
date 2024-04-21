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

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Use `openssl rand -base64 32` to generate a key and add it under `CALENDSO_ENCRYPTION_KEY` in the `.env` file.

5. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```sh
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```sh
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

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
    pip install -r requirnments.txt
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