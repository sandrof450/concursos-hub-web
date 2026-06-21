// src/hooks/useTypingCharacter.ts
import { useEffect, useRef, useState } from "react";

type Field = "titulo" | "orgao" | "area" | "tipo" | "fonte";

const messages: Record<Field, (v: string) => string> = {
  titulo: v => `Buscando por "${v}"...`,
  orgao:  v => `Órgão ${v}, anotado!`,
  area:   v => `Área ${v}, ótima escolha!`,
  tipo:   v => `Tipo ${v}, entendido!`,
  fonte:  v => v ? `Fonte ${v} selecionada!` : "Todas as fontes.",
};

const useTypingCharacter = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [bubble, setBubble] = useState("Oi! Me diz o que você procura...");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const onInput = (field: Field, value: string) => {
    setIsTyping(true);
    clearTimeout(timerRef.current);
    if (value.trim()) setBubble(messages[field](value));
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      setBubble(
        value.trim()
          ? `Clique em Buscar para encontrar "${value}"`
          : "Oi! Me diz o que você procura..."
      );
    }, 600);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { isTyping, bubble, onInput };
};

export default useTypingCharacter;
