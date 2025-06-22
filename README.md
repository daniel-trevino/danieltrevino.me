# Daniel Treviño's Personal Website

This is the repository for my personal website, which is an AI Agent built with [Mastra](https://mastra.ai) that has knowledge about my resume.

## Teck Stack

- [Mastra](https://mastra.ai)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Lucide](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org)

## Getting Started

First, you need to have Node.js (v24.x) and pnpm installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/daniel-trevino/danieltrevino.me.git
    cd danieltrevino.me
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    You'll need to create a `.env` file in both `/apps/api` and `/apps/web`. You can copy the example file if one is present, or create it from scratch.

4.  **Run the development servers:**

    The best way is to open two terminals and run the following commands:


    ```bash
    cd apps/api
    pnpm dev
    ```

    ```bash
    cd apps/web
    pnpm dev
    ```

    This will start the web application and the API.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.