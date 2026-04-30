import { runParser } from "@/agents/parser/";

const idea = `
Quiero hacer una app donde los desarrolladores puedan compartir sus dotfiles
y configuraciones de terminal. Los usuarios pueden buscar por herramienta (neovim, zsh, tmux),
dar estrellitas, hacer fork de configuraciones de otros, y comentar.
Seria como un GitHub pero solo para configs.
`;

const test = async () => {
  console.log("Testing parser...\n");
  try {
    const result = await runParser(idea);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
};

test();
