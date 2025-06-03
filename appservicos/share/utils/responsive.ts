import { Dimensions } from 'react-native';

// Obtém altura e largura da tela
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Converte percentual da altura da tela em pixels
 * @param percent Valor em string ('50%') ou número (50)
 */
export const hp = (percent: string | number): number => {
  const parsed = typeof percent === 'string' ? parseFloat(percent) : percent;
  return (SCREEN_HEIGHT * parsed) / 100;
};

/**
 * Converte percentual da largura da tela em pixels
 * @param percent Valor em string ('50%') ou número (50)
 */
export const wp = (percent: string | number): number => {
  const parsed = typeof percent === 'string' ? parseFloat(percent) : percent;
  return (SCREEN_WIDTH * parsed) / 100;
};

/**
 * Exporta dimensões diretamente, caso precise em outras lógicas
 */
export const screenHeight = SCREEN_HEIGHT;
export const screenWidth = SCREEN_WIDTH;
