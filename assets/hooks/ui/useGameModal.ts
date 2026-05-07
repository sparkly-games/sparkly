import { useCallback, useState } from 'react';

export function useGameModal() {
  const [modalGame, setModalGame] = useState(null);
  const [gameLoading, setGameLoading] = useState(true);

  const openGame = useCallback((game: any) => {
    setModalGame(game);
    setGameLoading(true);
  }, []);

  const closeGame = useCallback(() => {
    setModalGame(null);
  }, []);

  return {
    modalGame,
    gameLoading,
    setGameLoading,
    openGame,
    closeGame,
  };
}