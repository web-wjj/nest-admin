import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'

export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

export function RouteMatch() {}
