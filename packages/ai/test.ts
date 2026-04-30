import { runCritic } from "@/agents/critic";
import { runParser } from "@/agents/parser";
import { runResearcher } from "@/agents/researcher";

const idea = `                                                                                                                   
  Quiero hacer una app donde los desarrolladores puedan compartir sus dotfiles
  y configuraciones de terminal. Los usuarios pueden buscar por herramienta (neovim, zsh, tmux),                                   
  dar estrellitas, hacer fork de configuraciones de otros, y comentar.                                                             
  Seria como un GitHub pero solo para configs.                                                                                     
  `;

const test = async () => {
  console.log("Testing parser...\n");
  try {
    const parsed = await runParser(idea);
    console.log("Parsed:", JSON.stringify(parsed, null, 2));

    console.log("\n\nTesting researcher...\n");
    const research = await runResearcher(idea);
    console.log("Research:", JSON.stringify(research, null, 2));

    console.log("\n\nTesting critic...\n");
    const critic = await runCritic(idea);
    console.log("Research:", JSON.stringify(critic, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
};

test();
