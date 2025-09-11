import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

const config = {
  plugins: [
    tailwindcss(), // Specify your Tailwind config path
    autoprefixer,
  ],
};

export default config;
