# Nidum Bot

This project creates using React with Vite with configurations.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/NidumAI-Inc/agent-studio-vui-widget.git
cd agent-studio-vui-widget
```

Then, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Note: You need to clone `Nidum Agent` to access bot backend. To setup `Nidum Agent`, visit [`Nidum Agent`](https://github.com/NidumAI-Inc/agent-studio-ui.git) repo.


## Environment Configuration
This project uses environment variables for configuration. Before running the project, you need to set up your environment:

```
VITE_API_LIVEKIT_URL=
VITE_API_NEXT_backend=
VITE_API_ML_Backend=
```

You can check `.env.example` file for more details.

Finally, run the app and serve the application using `serve` library or any other static server

```bash
npm run build
# or
yarn build
# or
pnpm build
```


```bash
npm i serve -g
# or
yarn install serve -g
# or
pnpm add serve -g
```

and finally serve using the following command

```bash
serve -S dist
```