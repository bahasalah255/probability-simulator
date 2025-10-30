# 🎲 Probability Distribution Simulator

An interactive educational simulation demonstrating probability theory, weighted distributions, and expected value calculations in real-time.

![Demo Screenshot](screenshots/demo.png)

## 🎯 Purpose

This project was built for **educational purposes** to help developers and students understand:

- How **Random Number Generation (RNG)** works
- **Weighted probability distributions**
- **Expected value** and mathematical outcomes
- Why **house edge** guarantees long-term profitability in probability-based systems
- The mathematics behind why "beating the system" is impossible

## ⚠️ DISCLAIMER

**This is purely an educational tool for learning mathematics and probability theory.**

- ❌ NOT intended for real gambling
- ❌ NOT promoting betting or wagering
- ❌ NO real money involved
- ⚠️ Gambling is illegal in Morocco and causes harm

The author does not endorse or promote gambling activities in any form.

## 🧮 How It Works

### Probability Distribution

The simulator uses a **weighted random distribution** to generate outcomes:

```javascript
// Simplified example
const generateOutcome = () => {
  const rand = Math.random(); // 0.0 to 1.0
  
  if (rand < 0.33)      // 33% chance
    return 1.00-1.50x;  // Low multiplier
  
  if (rand < 0.60)      // 27% chance  
    return 1.50-2.50x;  // Medium multiplier
  
  if (rand < 0.80)      // 20% chance
    return 2.50-5.00x;
  
  // ... and so on
}
```

### House Edge (~3%)

The distribution is designed so that:
```
Expected Value = 0.97x
House Edge = 3%
```

This means over 100 bets of 100 units:
- Total wagered: 10,000 units
- Expected return: ~9,700 units
- House profit: ~300 units (3%)

**Key insight:** No strategy can overcome mathematical house edge in the long run.

## 📊 Features

- ✅ **Real-time simulation** with animated visualization
- ✅ **Live statistics** tracking wins, losses, ROI
- ✅ **Casino profit calculator** showing house edge in action
- ✅ **Auto-play mode** for large sample testing
- ✅ **Configurable parameters** (bet amount, auto-cashout)
- ✅ **History tracking** of recent rounds

## 🚀 Running the Demo

### Option 1: Direct HTML
1. Open `index.html` in a modern browser
2. No build process needed!

### Option 2: With React Dev Server
```bash
npm install
npm start
```

### Option 3: Live Demo
[View Live Demo](https://your-username.github.io/probability-simulator)

## 📚 Learning Outcomes

After exploring this simulation, you'll understand:

1. **Probability Theory Basics**
   - Random distributions
   - Independent events
   - Law of large numbers

2. **Expected Value**
   - Why "strategies" fail mathematically
   - Long-term vs short-term variance

3. **House Edge Mechanics**
   - How probability-based systems guarantee profit
   - Why the house always wins (mathematically)

4. **Software Development**
   - React state management
   - Real-time data visualization
   - Clean code practices

## 🔢 Mathematical Deep Dive

See [docs/MATHEMATICS.md](docs/MATHEMATICS.md) for detailed explanations of:
- Probability distribution calculations
- Expected value formulas
- Variance and standard deviation
- Why martingale strategies fail

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript (ES6+)** - Core logic

## 📖 Code Structure

```
probability-simulator/
├── src/
│   └── ProbabilitySimulator.jsx  # Main component
├── docs/
│   ├── MATHEMATICS.md             # Math explanations
│   └── PROBABILITY.md             # Distribution details
├── screenshots/
│   └── demo.png                   # Visual demo
└── README.md                      # This file
```

## 🤝 Contributing

Contributions are welcome! If you'd like to:
- Add new probability distributions
- Improve visualizations
- Enhance documentation
- Add unit tests

Please open an issue or submit a pull request.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎓 Educational Resources

Want to learn more about probability theory?

- [Khan Academy - Probability](https://www.khanacademy.org/math/statistics-probability)
- [MIT OpenCourseWare - Probability](https://ocw.mit.edu/courses/mathematics/)
- [3Blue1Brown - Probability Playlist](https://www.youtube.com/playlist?list=PLZHQObOWTQDPsKl2HIPRz0az58G2I5VGM)

## ⚖️ Responsible Gambling Awareness

If you or someone you know has a gambling problem:
- 🇲🇦 Morocco: Gambling is illegal
- 🌍 International: [Gamblers Anonymous](https://www.gamblersanonymous.org/)
- 📞 Get help: Contact local support services

## 👨‍💻 Author

Built with ❤️ for education and learning.

**Remember:** Mathematics doesn't lie. In probability-based systems with house edge, the house always wins in the long run. This is not opinion—it's mathematical certainty.

---

⭐ If you found this educational, please star the repo!

**Questions?** Open an issue or reach out.
