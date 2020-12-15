import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'

@Injectable()
export class CryptoUtil {
  encryPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex')
  }

  checkPassword(password: string, encryptedPassword: string) {
    const currentPassword = this.encryPassword(password)
    return currentPassword === encryptedPassword
  }
}
