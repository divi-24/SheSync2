
module.exports = {
  darkMode: ["class"],
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navbar: {
          light: {
            bg: "rgb(255 255 255 / 0.8)",
            border: "rgb(229 231 235)",
            text: "rgb(17 24 39)",
            hover: "rgb(243 244 246)"
          },
          dark: {
            bg: "rgb(11 12 15 / 0.8)",
            border: "rgb(22 24 29)",
            text: "rgb(255 255 255)",
            hover: "rgb(22 24 29)"
          }
        }
      },
      animation: {
        "navbar-slide-down": "navbar-slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "navbar-dropdown": "navbar-dropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "navbar-slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" }
        },
        "navbar-dropdown": {
          "0%": { 
            opacity: "0",
            transform: "rotateX(-12deg) scale(0.9)" 
          },
          "100%": { 
            opacity: "1",
            transform: "rotateX(0) scale(1)" 
          }
        }
      },
      backdropBlur: {
        navbar: "10px"
      }
    }
  }
}
