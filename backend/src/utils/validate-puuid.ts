export function validateAndFixPUUID(puuid: string): string | null {
  if (!puuid) {
    console.error('PUUID está vazio')
    return null
  }

  // Remover espaços e caracteres especiais
  const cleanPUUID = puuid.trim()
  
  // Verificar se tem pelo menos 70 caracteres (PUUIDs da Riot são longos)
  if (cleanPUUID.length < 70) {
    console.error(`PUUID muito curto: ${cleanPUUID} (${cleanPUUID.length} caracteres)`)
    return null
  }

  // Verificar se contém apenas caracteres válidos
  const validChars = /^[a-zA-Z0-9_-]+$/
  if (!validChars.test(cleanPUUID)) {
    console.error(`PUUID contém caracteres inválidos: ${cleanPUUID}`)
    return null
  }

  return cleanPUUID
} 