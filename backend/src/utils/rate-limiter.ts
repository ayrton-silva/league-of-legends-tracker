class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private timeWindow: number

  constructor(maxRequests: number = 80, timeWindow: number = 120000) { // 80 requests por 2 minutos
    this.maxRequests = maxRequests
    this.timeWindow = timeWindow
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now()
    
    // Remove requisições antigas
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    // Se ainda há espaço, permite a requisição
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return
    }
    
    // Se não há espaço, espera até que uma requisição expire
    const oldestRequest = Math.min(...this.requests)
    const waitTime = this.timeWindow - (now - oldestRequest) + 1000 // +1 segundo de margem
    
    console.log(`Rate limit atingido. Aguardando ${waitTime}ms...`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    
    // Tenta novamente
    return this.waitForSlot()
  }

  async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.waitForSlot()
        return await fn()
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < maxRetries) {
          const retryAfter = parseInt(error.response.headers['retry-after']) || baseDelay
          const delay = retryAfter * 1000 * attempt // Delay exponencial
          
          console.log(`Erro 429. Tentativa ${attempt}/${maxRetries}. Aguardando ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        
        throw error
      }
    }
    
    throw new Error(`Falha após ${maxRetries} tentativas`)
  }
}

export const rateLimiter = new RateLimiter() 