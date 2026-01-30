function getWarning(logo: string): string | null {
  if (logo.includes('cancellazione.png')) return 'Treno con cancellazioni'
  if (logo.includes('deviazione.png')) return 'Treno con deviazioni'
  if (logo.includes('riprogrammato.png')) return 'Treno riprogrammato'
  if (logo.includes('fermata_soppressa.png')) return 'Fermata soppressa'
  return null
}

export { getWarning }
