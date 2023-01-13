import { useCallback, useEffect, useState } from "react";
import HangManDrawing from "./HangManDrawing";
import HangManWord from "./HangManWord";
import Keyboard from "./Keyboard";
import words from "./WordList.json";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)]
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const inCorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter));
  
  const isLose = inCorrectLetters.length >= 6;
  const isWin = wordToGuess.split("").every(letter => guessedLetters.includes(letter));
  
  const addGuessLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isWin || isLose) return;
    setGuessedLetters(currentLetters => [...currentLetters, letter]);
  }, [guessedLetters, isWin, isLose]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const key = event.key;
      if (!key.match(/^[a-z]$/)) return;
      event.preventDefault();
      addGuessLetter(key)
    }

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    }
  }, [guessedLetters]);
  return (
    <div style={{
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      margin: "0 auto",
      alignItems: "center"
    }}>
      <div style={{
        fontSize: "2rem",
        textAlign: "center"
      }}>
        {isWin && "Winner! - Refresh to play again"}
        {isLose && "You lose! - Refresh to try again"}
      </div>
      <HangManDrawing numberOfGuesses={inCorrectLetters.length} />
      <HangManWord guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{alignSelf: "stretch"}}>
        <Keyboard 
        disabled={isWin || isLose}
        activeLetters={guessedLetters.filter(letter => wordToGuess.includes(letter))} 
        inActiveLetters={inCorrectLetters} 
        addgussessedLetters={addGuessLetter}
        />
      </div>
    </div>
  )
}

export default App
